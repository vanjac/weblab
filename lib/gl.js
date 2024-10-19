/**
 * @typedef {{
 *      program: WebGLProgram
 *      attributes: Record<string, number>
 *      uniforms: Record<string, WebGLUniformLocation>
 *      textures: Record<string, number>
 * }} ProgramInfo
 */

export const boundAttributes = Object.freeze({
    aPosition: 0,
    aNormal: 1,
    aColor: 2,
    aTexCoord0: 3,
})

const glConst = WebGLRenderingContext

/**
 * @param {HTMLCanvasElement} canvas
 * @param {WebGLContextAttributes} [attributes]
 * @returns {WebGL2RenderingContext}
 */
export function init(canvas, attributes) {
    let gl = canvas.getContext('webgl2', attributes)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    return gl
}

/**
 * @param {WebGLRenderingContext} gl
 */
export function checkError(gl) {
    let error = gl.getError()
    if (error) {
        throw Error('GL error ' + error)
    }
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {TexImageSource} [image]
 * @param {GLenum} format
 * @param {GLenum} type
 */
export function createTexture(gl, image, format = glConst.RGBA, type = glConst.UNSIGNED_BYTE) {
    let texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    // these settings are required for non power-of-2 textures
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    if (image) {
        gl.texImage2D(gl.TEXTURE_2D, 0, format, format, type, image)
    }
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {string} source
 * @param {GLenum} type
 * @returns {WebGLShader}
 */
export function createShader(gl, source, type = glConst.FRAGMENT_SHADER) {
    let shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw Error(gl.getShaderInfoLog(shader) ?? 'Unknown shader compile error')
    }
    return shader
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {WebGLShader[]} shaders
 * @returns {ProgramInfo}
 */
export function createProgram(gl, shaders) {
    let program = gl.createProgram()
    for (let shader of shaders) {
        gl.attachShader(program, shader)
    }

    for (let [name, index] of Object.entries(boundAttributes)) {
        gl.bindAttribLocation(program, index, name)
    }

    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw Error(gl.getProgramInfoLog(program) ?? 'Unknown program link error')
    }

    let attributes = Object.create(null)
    let uniforms = Object.create(null)
    let textures = Object.create(null)

    let numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)
    for (let i = 0; i < numAttribs; i++) {
        let info = gl.getActiveAttrib(program, i)
        attributes[info.name] = gl.getAttribLocation(program, info.name)
    }

    gl.useProgram(program)
    let numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
    let texNum = 0
    for (let i = 0; i < numUniforms; i++) {
        let info = gl.getActiveUniform(program, i)
        let loc = gl.getUniformLocation(program, info.name)
        uniforms[info.name] = loc
        if (info.type == gl.SAMPLER_2D) {
            gl.uniform1i(loc, texNum)
            textures[info.name] = texNum++
        }
    }
    gl.useProgram(null)

    return {
        program,
        attributes,
        uniforms,
        textures,
    }
}

/**
 * @param {WebGL2RenderingContext} gl
 * @returns {WebGLVertexArrayObject}
 */
export function createScreenRectVAO(gl) {
    let vao = gl.createVertexArray()
    gl.bindVertexArray(vao)

    let posBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(
        [-1, -1,
          1, -1,
         -1,  1,
         -1,  1,
          1, -1,
          1,  1]), gl.STATIC_DRAW)

    gl.enableVertexAttribArray(boundAttributes.aPosition)
    gl.vertexAttribPointer(boundAttributes.aPosition, 2, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    gl.bindVertexArray(null)
    return vao
}
