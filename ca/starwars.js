// Date: 2024-10-19

'use strict'

let canvas = document.querySelector('canvas')
let {width, height} = canvas

function initialPattern() {
	let gfx = document.createElement('canvas')
	Object.assign(gfx, {width, height})
	let ctx = gfx.getContext('2d')
	ctx.fillStyle = 'black'
	ctx.fillRect(0, 0, width, height)
	ctx.fillStyle = 'red'
	ctx.fillRect(width/2 - 1, height/2 - 1, 2, 2)
	// ctx.fillRect(width/2 + 1, height/2 - 1, 1, 1)
	return gfx
}

async function main() {
	let gl = canvas.getContext('webgl2')

	let posData = new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1])
	let uvData = new Float32Array([0,0, 1,0, 0,1, 0,1, 1,0, 1,1])
	$gl.vertexAttribStatic(gl, $gl.boundAttr.aPosition, posData, 2, gl.FLOAT)
	$gl.vertexAttribStatic(gl, $gl.boundAttr.aTexCoord0, uvData, 2, gl.FLOAT)

	let shaderSrc = await fetch('./starwars.frag').then(r => r.text())
	let prog = $gl.createProgram(gl, [
		$gl.fragShader(gl, shaderSrc),
		$gl.vertShader(gl, $gl.basicVert),
	])

	gl.bindTexture(gl.TEXTURE_2D, gl.createTexture())
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, initialPattern())
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

	while (true) {
		await new Promise(r => requestAnimationFrame(r))
		$gl.checkError(gl)
		gl.useProgram(prog.program)
		gl.drawArrays(gl.TRIANGLES, 0, 6)

		gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, canvas)
	}
}
main()
