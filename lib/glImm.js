/**
 * @typedef {{
 *		buffer: WebGLBuffer
 *		size: number
 * }} CachedBuffer
 */

/** @type {WebGLRenderingContext} */
let curGl = null
/** @type {CachedBuffer[]} */
let arrayBuffers = []
/** @type {CachedBuffer} */
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
 * @param {CachedBuffer} cached
 * @param {GLenum} target
 * @param {AllowSharedBufferSource} data
 */
function cachedBufferData(gl, cached, target, data) {
	gl.bindBuffer(target, cached.buffer)
	if (data.byteLength > cached.size) {
		cached.size = 1 << (32 - Math.clz32(data.byteLength))
		gl.bufferData(target, cached.size, gl.STREAM_DRAW)
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

	let cached = arrayBuffers[index]
	if (!cached) {
		cached = {buffer: gl.createBuffer(), size: 0}
		arrayBuffers[index] = cached
	}
	cachedBufferData(gl, cached, gl.ARRAY_BUFFER, data)
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
		elementBuffer = {buffer: gl.createBuffer(), size: 0}
	}
	cachedBufferData(gl, elementBuffer, gl.ELEMENT_ARRAY_BUFFER, indices)
	gl.drawElements(mode, indices.length, gl.UNSIGNED_SHORT, 0)
}
