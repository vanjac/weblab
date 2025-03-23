// Date: 2024-10-25

import * as $html from '../lib/html.js'
import * as $gl from '../lib/gl.js'
import * as $glShader from '../lib/glShader.js'
import * as $array from '../lib/array.js'

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

	let screenVao = $gl.createScreenRectVAO(gl)
	let shaderSrc = await fetch(import.meta.resolve('./scanlines.frag')).then(r => r.text())
	let prog = $gl.createProgram(gl, [$gl.createShader(gl, shaderSrc), $glShader.basicVert(gl)])

	let audioCtx = new AudioContext()
	let splitter = audioCtx.createChannelSplitter(numChannels)
	let source = audioCtx.createMediaElementSource(audio)
	source.connect(splitter)
	source.connect(audioCtx.destination)
	let analysers = $array.seq(numChannels, c => {
		let analyser = audioCtx.createAnalyser()
		analyser.fftSize = sampleSize
		splitter.connect(analyser, c)
		return analyser
	})

	audio.addEventListener('play', () => {
		audioCtx.resume()
	})

	let dataArrays = $array.seq(numChannels, () => new Uint8Array(sampleSize))
	for (let c = 0; c < numChannels; c++) {
		gl.activeTexture(gl.TEXTURE0 + c)
		$gl.createTexture(gl)
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
		gl.bindVertexArray(screenVao)
		gl.drawArrays(gl.TRIANGLES, 0, 6)
		gl.bindVertexArray(null)
	}
}

main()
