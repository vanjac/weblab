import * as $ram from './ram.js'

export const imports = {
	put,
	write,
}

let lineBuf = ''

/**
 * @param {number} c
 */
function put(c) {
	if (c == 10) {
		console.log(lineBuf)
		lineBuf = ''
	} else {
		lineBuf += String.fromCodePoint(c)
	}
}

/**
 * @param {number} ptr
 */
function write(ptr) {
	while (true) {
		let c = $ram.dataView.getUint8(ptr)
		if (c == 0) {
			break
		}
		put(c)
		ptr++
	}
}
