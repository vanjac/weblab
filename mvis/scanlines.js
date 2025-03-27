// Date: 2024-10-25

import * as $html from '../lib/html.js'
import * as $gl from '../lib/gl.js'

let width = 512
let height = 512

let texWidth = 32
let texHeight = 64
let sampleSize = texWidth * texHeight

let numChannels = 2

async function main() {
	let input = $html.input({type: 'file', accept: 'audio/*'})

	let src = new URLSearchParams(window.location.search).get('file')
	let audio = document.createElement('audio')
	Object.assign(audio, {controls: true, src})
	audio.style.display = 'block'
	audio.style.width = '100%'

	input.addEventListener('change', () => {
		audio.src = URL.createObjectURL(input.files[0])
	})

	let canvas = $html.canvas({width, height})
	let gl = canvas.getContext('webgl2')

	document.body.append(input, audio, canvas)

	let posData = new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1])
	let uvData = new Float32Array([0,0, 1,0, 0,1, 0,1, 1,0, 1,1])
	$gl.vertexAttribStatic(gl, $gl.boundAttr.aPosition, posData, 2, gl.FLOAT)
	$gl.vertexAttribStatic(gl, $gl.boundAttr.aTexCoord0, uvData, 2, gl.FLOAT)

	let shaderSrc = await fetch(import.meta.resolve('./scanlines.frag')).then(r => r.text())
	let prog = $gl.createProgram(gl, [
		$gl.fragShader(gl, shaderSrc),
		$gl.vertShader(gl, $gl.basicVert)
	])

	let audioCtx = new AudioContext()
	let splitter = audioCtx.createChannelSplitter(numChannels)
	let source = audioCtx.createMediaElementSource(audio)
	source.connect(splitter)
	source.connect(audioCtx.destination)
	/** @type {AnalyserNode[]} */
	let analysers = []
	for (let c = 0; c < numChannels; c++) {
		let analyser = audioCtx.createAnalyser()
		analyser.fftSize = sampleSize
		splitter.connect(analyser, c)
		analysers.push(analyser)
	}

	audio.addEventListener('play', () => {
		audioCtx.resume()
	})

	let dataArrays = [...Array(numChannels)].map(_=> new Uint8Array(sampleSize))
	for (let c = 0; c < numChannels; c++) {
		gl.activeTexture(gl.TEXTURE0 + c)
		gl.bindTexture(gl.TEXTURE_2D, gl.createTexture())
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, texWidth, texHeight, 0, gl.RED, gl.UNSIGNED_BYTE, null)
	}

	while (true) {
		await new Promise(r => requestAnimationFrame(r))
		$gl.checkError(gl)

		for (let c = 0; c < numChannels; c++) {
			analysers[c].getByteTimeDomainData(dataArrays[c])
		}
		for (let c = 0; c < numChannels; c++) {
			gl.activeTexture(gl.TEXTURE0 + c)
			gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, texWidth, texHeight, gl.RED, gl.UNSIGNED_BYTE, dataArrays[c])
		}

		gl.useProgram(prog.program)
		gl.drawArrays(gl.TRIANGLES, 0, 6)
	}
}

main()
