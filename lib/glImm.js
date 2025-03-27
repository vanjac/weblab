/**
 * @typedef {{
 *		buffer: WebGLBuffer
 *		size: number
 * }} DynamicBuffer
 */

/** @type {WebGLRenderingContext} */
let curGl = null
/** @type {DynamicBuffer[]} */
let arrayBuffers = []
/** @type {DynamicBuffer} */
let elementBuffer = null

/**
 * @param {WebGLRenderingContext} gl
 */
function setCurGl(gl) {
	if (gl != curGl) {
		curGl = gl
		arrayBuffers = []
		elementBuffer = null
	}
}

/**
 * @param {WebGLRenderingContext} gl
 * @returns {DynamicBuffer}
 */
function makeDynamicBuffer(gl) {
	return {buffer: gl.createBuffer(), size: 0}
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {DynamicBuffer} dbuf
 * @param {GLenum} target
 * @param {AllowSharedBufferSource} data
 * @param {GLenum} usage
 */
export function dynamicBufferData(gl, dbuf, target, data, usage = gl.STREAM_DRAW) {
	gl.bindBuffer(target, dbuf.buffer)
	if (data.byteLength > dbuf.size) {
		dbuf.size = 1 << (32 - Math.clz32(data.byteLength))
		gl.bufferData(target, dbuf.size, usage)
	}
	gl.bufferSubData(target, 0, data)
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {GLuint} index
 * @param {AllowSharedBufferSource} data
 * @param {number} size Must be 1, 2, 3, or 4
 * @param {GLenum} type
 * @param {boolean} normalized
 */
export function vertexAttribData(gl, index, data, size, type, normalized = false) {
	setCurGl(gl)

	let dbuf = arrayBuffers[index]
	if (!dbuf) {
		dbuf = makeDynamicBuffer(gl)
		arrayBuffers[index] = dbuf
	}
	dynamicBufferData(gl, dbuf, gl.ARRAY_BUFFER, data)
	gl.vertexAttribPointer(index, size, type, normalized, 0, 0)
}

/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {GLenum} mode
 * @param {Uint16Array} indices
 */
export function drawElements(gl, mode, indices) {
	setCurGl(gl)

	if (!elementBuffer) {
		elementBuffer = makeDynamicBuffer(gl)
	}
	dynamicBufferData(gl, elementBuffer, gl.ELEMENT_ARRAY_BUFFER, indices)
	gl.drawElements(mode, indices.length, gl.UNSIGNED_SHORT, 0)
}
