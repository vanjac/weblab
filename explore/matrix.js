// Date: 2024-11-14

import * as $html from '../lib/html.js'
import * as $gl from '../lib/gl.js'
import * as $glShader from '../lib/glShader.js'
import * as $mat4 from '../lib/mat4.js'

let width = 1024
let height = 768

let modelMat = DOMMatrix.fromFloat32Array($mat4.ident).translate(0, 0, -1).toFloat32Array()
let texMat = Float32Array.of(1, 0, 0, 0, 1, 0, 0, 0, 1)
let rotateSpeed = 1.5
let viewDist = 3

let world = true

async function main() {
	let canvas = $html.canvas({width, height})

	let modelMatDiv = document.createElement('div')
	modelMatDiv.style = 'display: inline-block;'
	for (let row = 0; row < 4; row++) {
		let div = modelMatDiv.appendChild(document.createElement('div'))
		for (let col = 0; col < 4; col++) {
			let idx = row + col * 4
			let input = $html.input({type: 'number', min: '-99', max: '99', step: '.1'})
			input.valueAsNumber = modelMat[idx]
			if (col == 2) {
				input.disabled = true
			} else {
				input.oninput = () => modelMat[idx] = input.valueAsNumber
			}
			div.appendChild(input)
		}
	}

	let texMatDiv = document.createElement('div')
	texMatDiv.style = 'display: inline-block'
	for (let row = 0; row < 3; row++) {
		let div = texMatDiv.appendChild(document.createElement('div'))
		for (let col = 0; col < 3; col++) {
			let idx = row + col * 3
			let input = $html.input({type: 'number', min: '-99', max: '99', step: '.1'})
			input.valueAsNumber = texMat[idx]
			input.oninput = () => texMat[idx] = input.valueAsNumber
			div.appendChild(input)
		}
	}

	let worldCheck = $html.input({type: 'checkbox', checked: world})
	worldCheck.oninput = () => world = worldCheck.checked

	document.body.append(
		canvas,
		modelMatDiv,
		$html.span({style: 'display: inline-block; width: 20pt'}),
		texMatDiv,
		worldCheck,
	)

	let gl = canvas.getContext('webgl2')
	gl.enable(gl.DEPTH_TEST)
	let glAniso = gl.getExtension('EXT_texture_filter_anisotropic')

	let prog = $gl.createProgram(gl, [
		$glShader.basicVert(gl, {transform: true, texMat: true}),
		$glShader.basicFrag(gl, {texture: true}),
	])

	gl.useProgram(prog.program)

	let proj = $mat4.perspective(Math.PI / 2, width/height, 0.03)

	let planePos = new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1])
	let planeUV = new Float32Array([0,0, 1,0, 0,1, 0,1, 1,0, 1,1])
	$gl.vertexAttribStatic(gl, $gl.boundAttr.aPosition, planePos, 2, gl.FLOAT)
	$gl.vertexAttribStatic(gl, $gl.boundAttr.aTexCoord0, planeUV, 2, gl.FLOAT)

	let request = await fetch(import.meta.resolve('./five.png'))
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
			gl.uniformMatrix4fv(prog.uniforms.uProjMat, false, proj)
			let viewMat = DOMMatrix.fromFloat32Array($mat4.ident)
			viewMat.translateSelf(0, viewDist, 0)
			viewMat.rotateAxisAngleSelf(0, 0, 1, time / 1000 * rotateSpeed * 180 / Math.PI)
			gl.uniformMatrix4fv(prog.uniforms.uViewMat, false, viewMat.toFloat32Array())
		} else {
			gl.uniformMatrix4fv(prog.uniforms.uProjMat, false, $mat4.ident)
			gl.uniformMatrix4fv(prog.uniforms.uViewMat, false, $mat4.ident)
		}

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
		gl.drawArrays(gl.TRIANGLES, 0, 6)
	}
}

main()
