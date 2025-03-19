import * as $ram from './ram.js'
import * as $console from './console.js'
import * as $display from './display.js'
import * as $text from './text.js'
import * as $audio from './audio.js'

const progSizeLimit = 2 ** 16

/** @type {WebAssembly.Imports} */
const importObj = {
	console: $console.imports,
	display: $display.imports,
	text: $text.imports,
	audio: $audio.imports,
	ram: $ram.imports,
}

async function main() {
	$display.init(document.body)
	$text.init(document.body)
	let audioCtx = new AudioContext()
	$audio.init(audioCtx)

	document.addEventListener('mousedown', () => {
		audioCtx.resume()
	})

	let path = new URLSearchParams(window.location.search).get('file')
	let progBuf = await fetch(path).then(r => r.arrayBuffer())
	console.log(`Loaded program (size: ${progBuf.byteLength} bytes)`)
	if (progBuf.byteLength >= progSizeLimit) {
		throw Error('Program is too large!')
	}
	let src = await WebAssembly.instantiate(progBuf, importObj)
	// @ts-ignore
	src.instance.exports.main()
}

main()
