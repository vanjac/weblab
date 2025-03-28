// Date: 2024-11-14

'use strict'

let canvas = document.querySelector('canvas')
let {width, height} = canvas

let modelMat = new DOMMatrix().translate(0, 0, -1).toFloat32Array()
let texMat = Float32Array.of(1, 0, 0, 0, 1, 0, 0, 0, 1)
let rotateSpeed = 1.5
let viewDist = 3

let world = true

async function main() {
	let modelMatDiv = document.querySelector('#modelMat')
	for (let row = 0; row < 4; row++) {
		let div = modelMatDiv.appendChild(document.createElement('div'))
		for (let col = 0; col < 4; col++) {
			let idx = row + col * 4
			let input = document.createElement('input')
			Object.assign(input, {type: 'number', min: '-99', max: '99', step: '.1'})
			input.valueAsNumber = modelMat[idx]
			if (col == 2) {
				input.disabled = true
			} else {
				input.oninput = () => modelMat[idx] = input.valueAsNumber
			}
			div.appendChild(input)
		}
	}

	let texMatDiv = document.querySelector('#texMat')
	for (let row = 0; row < 3; row++) {
		let div = texMatDiv.appendChild(document.createElement('div'))
		for (let col = 0; col < 3; col++) {
			let idx = row + col * 3
			let input = document.createElement('input')
			Object.assign(input, {type: 'number', min: '-99', max: '99', step: '.1'})
			input.valueAsNumber = texMat[idx]
			input.oninput = () => texMat[idx] = input.valueAsNumber
			div.appendChild(input)
		}
	}

	let gl = canvas.getContext('webgl2')
	gl.enable(gl.DEPTH_TEST)
	let glAniso = gl.getExtension('EXT_texture_filter_anisotropic')

	let prog = $gl.createProgram(gl, [
		$gl.vertShader(gl, $gl.basicVert, 'kTransform', 'kTexMat'),
		$gl.fragShader(gl, $gl.basicFrag, 'kTexture'),
	])

	gl.useProgram(prog.program)

	let proj = $gl.perspective(width/height, 0.03)

	let planePos = new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1])
	let planeUV = new Float32Array([0,0, 1,0, 0,1, 0,1, 1,0, 1,1])
	$gl.vertexAttribStatic(gl, $gl.boundAttr.aPosition, planePos, 2, gl.FLOAT)
	$gl.vertexAttribStatic(gl, $gl.boundAttr.aTexCoord0, planeUV, 2, gl.FLOAT)

	let request = await fetch('./five.png')
	let img = await request.blob().then(b => window.createImageBitmap(b))
	gl.bindTexture(gl.TEXTURE_2D, gl.createTexture())
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
	let anisotropy = gl.getParameter(glAniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT)
	gl.texParameterf(gl.TEXTURE_2D, glAniso.TEXTURE_MAX_ANISOTROPY_EXT, anisotropy)
	gl.generateMipmap(gl.TEXTURE_2D)

	gl.clearColor(0.5, 0.5, 0.5, 1)
	gl.vertexAttrib4fv($gl.boundAttr.aColor, [1, 1, 1, 1])

	while (true) {
		/** @type {number} */
		let time = await new Promise(r => requestAnimationFrame(r))
		$gl.checkError(gl)

		gl.uniformMatrix4fv(prog.uniforms.uModelMat, false, modelMat)
		gl.uniformMatrix3fv(prog.uniforms.uTexMat0, false, texMat)
		if (world) {
			gl.uniformMatrix4fv(prog.uniforms.uProjMat, false, proj.toFloat32Array())
			let viewMat = new DOMMatrix()
			viewMat.translateSelf(0, viewDist, 0)
			viewMat.rotateAxisAngleSelf(0, 0, 1, time / 1000 * rotateSpeed * 180 / Math.PI)
			gl.uniformMatrix4fv(prog.uniforms.uViewMat, false, viewMat.toFloat32Array())
		} else {
			let ident = new DOMMatrix().toFloat32Array()
			gl.uniformMatrix4fv(prog.uniforms.uProjMat, false, ident)
			gl.uniformMatrix4fv(prog.uniforms.uViewMat, false, ident)
		}

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
		gl.drawArrays(gl.TRIANGLES, 0, 6)
	}
}

main()
