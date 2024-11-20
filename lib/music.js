import * as $array from './array.js'

export const a4Freq = 440
export const c4Freq = a4Freq * (2 ** (-9/12))

/**
 * @typedef {{
 *		a: number
 *		d: number
 *		s: number
 * }} ADS attack (seconds), decay (exponent), sustain (fraction)
 */

/**
 * @param {AudioParam} param
 * @param {number} startTime
 * @param {number} value
 * @param {Partial<ADS>} ads
 */
export function adsEnv(param, startTime, value, {a = 0, d = 0, s = 0}) {
	param.setValueAtTime(0.001, startTime)
	param.exponentialRampToValueAtTime(value, startTime + a)
	param.setTargetAtTime(value * s, startTime + a, d)
}

/**
 * @param {BaseAudioContext} ctx
 * @param {AudioNode} dest
 * @param {OscillatorOptions} [oscOptions]
 * @param {BiquadFilterOptions} [filterOptions]
 */
export function analogSynth(ctx, dest, oscOptions, filterOptions) {
	oscOptions = Object.assign({type: 'sawtooth', frequency: c4Freq}, oscOptions)
	filterOptions = Object.assign({frequency: 1000, Q: 0.01}, filterOptions)
	let osc = new OscillatorNode(ctx, oscOptions)
	let filter = new BiquadFilterNode(ctx, filterOptions)
	let gain = new GainNode(ctx, {gain: 0})
	osc.connect(filter).connect(gain).connect(dest)
	osc.start()
	return {osc, filter, gain}
}

/**
 * @template T
 */
export class PolySynth {
	/**
	 * @param {number} count
	 * @param {(index: number) => T} fn
	 */
	constructor(count, fn) {
		this.voices = $array.seq(count, fn)
		this.index = 0
	}

	/**
	 * @returns {T}
	 */
	voice() {
		let v = this.voices[this.index]
		this.index = (this.index + 1) % this.voices.length
		return v
	}
}
