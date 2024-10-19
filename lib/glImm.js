/**
 * @typedef {{
 *      buffer: WebGLBuffer
 *      size: number
 * }} CachedBuffer
 */

/** @type {WebGLRenderingContext} */
let curGl = null
/** @type {CachedBuffer[]} */
let cachedBuffers = []

/**
 * @param {WebGLRenderingContext} gl
 */
function setCurGl(gl) {
    if (gl != curGl) {
        curGl = gl
        cachedBuffers = []
    }
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

    let cached = cachedBuffers[index]
    if (!cached) {
        cached = {buffer: gl.createBuffer(), size: 0}
        cachedBuffers[index] = cached
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, cached.buffer)
    if (data.byteLength > cached.size) {
        cached.size = 1 << (32 - Math.clz32(data.byteLength))
        gl.bufferData(gl.ARRAY_BUFFER, cached.size, gl.STREAM_DRAW)
    }
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, data)
    gl.vertexAttribPointer(index, size, type, normalized, 0, 0)
}
