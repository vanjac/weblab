/**
 * @typedef {{
 *		program: WebGLProgram
 *		attributes: Record<string, number>
 *		uniforms: Record<string, WebGLUniformLocation>
 *		textures: Record<string, number>
 * }} ProgramInfo
 */

/**
 * @typedef {{
 *		buffer: WebGLBuffer
 *		size: number
 * }} DynamicBuffer
 */

/**
 * @typedef {{
 *		gl: WebGLRenderingContext
 *		arrayBuffers: DynamicBuffer[]
 *		elementBuffer: DynamicBuffer
 * }} VertexBufferCache
 */

export const boundAttr = Object.freeze({
	aPosition: 0,
	aNormal: 1,
	aColor: 2,
	aTexCoord0: 3,
})

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
 * @param {GLenum} type
 * @param {string} source
 * @param {string[]} defines
 * @returns {WebGLShader}
 */
function createShader(gl, type, source, defines) {
	let shader = gl.createShader(type)
	let combined = defines.map(s => '#define ' + s + '\n').join('') + source
	gl.shaderSource(shader, combined)
	gl.compileShader(shader)
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		throw Error(gl.getShaderInfoLog(shader) ?? 'Unknown shader compile error')
	}
	return shader
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {string} source
 * @param {string[]} defines
 */
export function fragShader(gl, source, ...defines) {
	return createShader(gl, gl.FRAGMENT_SHADER, source, defines)
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {string} source
 * @param {string[]} defines
 */
export function vertShader(gl, source, ...defines) {
	return createShader(gl, gl.VERTEX_SHADER, source, defines)
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

	for (let [name, index] of Object.entries(boundAttr)) {
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

	return {
		program,
		attributes,
		uniforms,
		textures,
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
export function vertexAttribStatic(gl, index, data, size, type, normalized = false) {
	gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
	gl.enableVertexAttribArray(index)
	gl.vertexAttribPointer(index, size, type, normalized, 0, 0)
}

/**
 * @param {WebGLRenderingContext} gl
 * @returns {DynamicBuffer}
 */
export function makeDynamicBuffer(gl) {
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
 * @returns {VertexBufferCache}
 */
export function makeVertexBufferCache(gl) {
	return {gl, arrayBuffers: [], elementBuffer: null}
}

/**
 * @param {VertexBufferCache} cache
 * @param {GLuint} index
 * @param {AllowSharedBufferSource} data
 * @param {number} size Must be 1, 2, 3, or 4
 * @param {GLenum} type
 * @param {boolean} normalized
 */
export function vertexAttribData(cache, index, data, size, type, normalized = false) {
	let dbuf = cache.arrayBuffers[index]
	if (!dbuf) {
		dbuf = makeDynamicBuffer(cache.gl)
		cache.arrayBuffers[index] = dbuf
	}
	dynamicBufferData(cache.gl, dbuf, cache.gl.ARRAY_BUFFER, data)
	cache.gl.vertexAttribPointer(index, size, type, normalized, 0, 0)
}

/**
 *
 * @param {VertexBufferCache} cache
 * @param {GLenum} mode
 * @param {Uint16Array} indices
 */
export function drawElements(cache, mode, indices) {
	if (!cache.elementBuffer) {
		cache.elementBuffer = makeDynamicBuffer(cache.gl)
	}
	dynamicBufferData(cache.gl, cache.elementBuffer, cache.gl.ELEMENT_ARRAY_BUFFER, indices)
	cache.gl.drawElements(mode, indices.length, cache.gl.UNSIGNED_SHORT, 0)
}

/**
 * Create a (Z-up, right-handed) perspective matrix with infinite far plane.
 * @param {number} aspect Aspect ratio (width / height)
 * @param {number} near Near clipping plane
 * @param {number} fy Focal length = 1/tan(fovy/2)
 */
export function perspective(aspect, near, fy = 1) {
	// https://developer.nvidia.com/content/depth-precision-visualized
	return DOMMatrix.fromMatrix(
		{m11: fy / aspect, m22: 0, m23: 1, m24: 1, m32: fy, m33: 0, m43: -2 * near, m44: 0}
	)
}

// Shader source:

export const basicVert = `
#ifdef kTransform
	uniform mat4 uModelMat;
	uniform mat4 uViewMat;
	uniform mat4 uProjMat;
#endif
#ifdef kTexMat
	uniform mat3 uTexMat0;
#endif
#ifdef kPointSize
	uniform float uPointSize;
#endif

	attribute vec3 aPosition;
	attribute vec3 aNormal;
	attribute vec4 aColor;
	attribute vec2 aTexCoord0;

	varying vec4 vPosition;
	varying vec3 vNormal;
	varying vec4 vColor;
	varying vec3 vTexCoord0;

	void main() {
		vPosition = vec4(aPosition, 1);
#ifdef kTransform
		vPosition = uModelMat * vPosition;
#endif
		vNormal = aNormal;
		vColor = aColor;
		vTexCoord0 = vec3(aTexCoord0, 1);
#ifdef kTexMat
		vTexCoord0 = uTexMat0 * vTexCoord0;
#endif
		gl_Position = vPosition;
#ifdef kTransform
		gl_Position = uProjMat * uViewMat * gl_Position;
#endif
#ifdef kPointSize
		gl_PointSize = uPointSize;
#endif
	}
`

export const basicFrag = `
	precision mediump float;

	varying vec4 vColor;

#ifdef kTexture
	uniform sampler2D sColor;
	varying vec3 vTexCoord0;
#endif

	void main() {
		vec4 color = vColor;
#ifdef kTexture
		vec2 uv = vTexCoord0.st / vTexCoord0.p;
		color *= texture2D(sColor, uv);
#endif
		gl_FragColor = color;
	}
`
