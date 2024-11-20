import * as $math from '../lib/math.js'
import * as $music from '../lib/music.js'

const toneChannels = 4
const noiseChannel = toneChannels
const numChannels = toneChannels + 1

const c4Cents = 4 * 12 * 100
/** @type {readonly OscillatorType[]} */
const waveTypes = Object.freeze(['sine', 'square', 'sawtooth', 'triangle'])
const noiseLen = 16384
const noiseSampleRate = 48000

export const imports = {
	setWave,
	setPitch,
	setVol,
	setPan,
}

/** @type {OscillatorNode[]} */
let oscillators = []
/** @type {(OscillatorNode | AudioBufferSourceNode)[]} */
let sources = []
/** @type {GainNode[]} */
let gains = []
/** @type {StereoPannerNode[]} */
let panners = []

/**
 * @param {BaseAudioContext} context
 */
export function init(context) {
	let masterGain = context.createGain()
	masterGain.connect(context.destination)

	for (let c = 0; c < numChannels; c++) {
		gains[c] = context.createGain()
		gains[c].gain.value = 0

		panners[c] = context.createStereoPanner()

		gains[c].connect(panners[c])
		panners[c].connect(masterGain)
	}

	for (let c = 0; c < toneChannels; c++) {
		oscillators[c] = context.createOscillator()
		oscillators[c].frequency.value = $music.c4Freq
		oscillators[c].connect(gains[c])
		oscillators[c].start()
		sources[c] = oscillators[c]
	}

	let noiseSource = context.createBufferSource()
	noiseSource.buffer = makeNoiseBuffer(context)
	noiseSource.loop = true
	noiseSource.loopEnd = noiseLen / noiseSampleRate
	noiseSource.connect(gains[noiseChannel])
	noiseSource.start()
	sources[noiseChannel] = noiseSource

	noiseSource = context.createBufferSource()
}

/**
 * @param {BaseAudioContext} context
 */
function makeNoiseBuffer(context) {
	let noiseArr = new Int8Array(noiseLen)
	crypto.getRandomValues(noiseArr)
	let noiseBuffer = context.createBuffer(1, noiseLen, noiseSampleRate)
	let noiseData = noiseBuffer.getChannelData(0)
	for (let i = 0; i < noiseLen; i++) {
		noiseData[i] = noiseArr[i] / 128
	}
	return noiseBuffer
}

/**
 * @param {number} channel
 * @param {number} wave
 */
function setWave(channel, wave) {
	oscillators[channel].type = waveTypes[wave]
}

/**
 * @param {number} channel
 * @param {number} cents
 */
function setPitch(channel, cents) {
	cents = $math.clamp(cents | 0, 0, 16383)
	sources[channel].detune.value = cents - c4Cents
}

/**
 * @param {number} channel
 * @param {number} vol 0 - 255
 */
function setVol(channel, vol) {
	vol = $math.clamp(vol | 0, 0, 255)
	gains[channel].gain.value = vol / 255
}

/**
 * @param {number} channel
 * @param {number} pan
 */
function setPan(channel, pan) {
	pan = $math.clamp(pan | 0, -1, 1)
	panners[channel].pan.value = pan
}
