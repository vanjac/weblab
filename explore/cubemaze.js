// Date: 2024-11-05

import {$html, $gl, $glShader, $glImm, $mat4, $async, $vec, $colArr} from '../lib/index-3d.js'
import * as $array from '../lib/array.js'
import * as $input from '../lib/input.js'

let width = 1024
let height = 768

let mazeDim = 12

/** @type {[number, boolean][]} */
let directions = [[0, false], [0, true], [1, false], [1, true], [2, false], [2, true]]

let wallColors = [
	$colArr.rgb(255, 24, 105),
	$colArr.rgb(224, 0, 112),
	$colArr.rgb(207, 20, 182),
]

let lookSpeed = 0.01
let moveSpeed = 0.03

/**
 * @template T
 * @param {T[]} arr
 */
function shuffled(arr) {
	// https://stackoverflow.com/a/12646864
	arr = [...arr]
	for (let i = arr.length - 1; i >= 0; i--) {
		let j = Math.floor(Math.random() * (i + 1))
		;[arr[i], arr[j]] = [arr[j], arr[i]]
	}
	return arr
}

/**
 * @returns {[Float32Array, Float32Array, Float32Array]}
 */
function generateMaze() {
	let startTime = performance.now()

	let spaces = $array.seq(mazeDim, () => $array.seq(mazeDim, () => Array(mazeDim).fill(false)))
	for (let i = 0; i < mazeDim; i++) {
		for (let j = 0; j < mazeDim; j++) {
			spaces[i][j][0] = true
			spaces[i][j][mazeDim - 1] = true
			spaces[j][0][i] = true
			spaces[j][mazeDim - 1][i] = true
			spaces[0][i][j] = true
			spaces[mazeDim - 1][i][j] = true
		}
	}

	let trails = [[1, 1, 1]]
	spaces[1][1][1] = true

	/** @type {number[]} */
	let lines = []
	let tris = [
		mazeDim - 1, mazeDim - 1, mazeDim - 2,
		mazeDim - 1, mazeDim - 2, mazeDim - 1,
		mazeDim - 2, mazeDim - 1, mazeDim - 1,
	]
	let colors = Array(3).fill($colArr.rgb(255, 230, 120)).flat()
	while (trails.length) {
		let idx = Math.floor(Math.random() * trails.length)
		let pos = trails[idx]

		/** @type {number[]} */
		let movePos
		for (let [axis, dir] of shuffled(directions)) {
			let next = $vec.add(pos, $vec.axis(3, axis, dir ? 1 : -1))
			if (!spaces[next[0]][next[1]][next[2]]) {
				movePos = next
				break
			}
		}

		if (movePos) {
			trails.push(movePos) // leave previous pos as a branch
			spaces[movePos[0]][movePos[1]][movePos[2]] = true
			lines = lines.concat([...pos, ...movePos]) // TODO: add walls
			for (let axis = 0; axis < 3; axis++) {
				let adj = $vec.add(movePos, $vec.axis(3, axis))
				let uAxis = $vec.axis(3, axis + 1)
				let vAxis = $vec.axis(3, axis + 2)
				let color = wallColors[axis]
				if (!$vec.eq(adj, pos) && spaces[adj[0]][adj[1]][adj[2]]) {
					tris = tris.concat([
						...adj,
						...$vec.add(adj, uAxis),
						...$vec.add($vec.add(adj, uAxis), vAxis),
						...adj,
						...$vec.add($vec.add(adj, uAxis), vAxis),
						...$vec.add(adj, vAxis),
					])
					colors = colors.concat(Array(6).fill(color).flat())
				}
				adj = $vec.add(movePos, $vec.axis(3, axis, -1))
				if (!$vec.eq(adj, pos) && spaces[adj[0]][adj[1]][adj[2]]) {
					tris = tris.concat([
						...movePos,
						...$vec.add(movePos, uAxis),
						...$vec.add($vec.add(movePos, uAxis), vAxis),
						...movePos,
						...$vec.add($vec.add(movePos, uAxis), vAxis),
						...$vec.add(movePos, vAxis),
					])
					colors = colors.concat(Array(6).fill(color).flat())
				}
			}
		} else {
			trails.splice(idx, 1)
		}
	}
	console.log(`Generating maze took ${performance.now() - startTime} ms`)
	return [new Float32Array(lines), new Float32Array(tris), new Float32Array(colors)]
}

/**
 * @param {[number, number, number]} camPos
 * @param {DOMMatrixReadOnly} invLookMat
 * @param {number[]} vec
 */
function moveCamera(camPos, invLookMat, vec) {
	let point = new DOMPoint(...$vec.mul(vec, moveSpeed), 0)
	let {x, y, z} = invLookMat.transformPoint(point)
	return $vec.add(camPos, [x, y, z])
}

async function main() {
	let canvas = $html.canvas({width, height})
	document.body.append(
		canvas,
		$html.button({onclick: () => canvas.requestFullscreen()}, ['Fullscreen']),
	)

	let gl = canvas.getContext('webgl2')
	gl.enable(gl.DEPTH_TEST)
	let prog = $gl.createProgram(gl, [
		$glShader.basicVert(gl, {transform: true}),
		$glShader.basicFrag(gl),
	])
	gl.uniformMatrix4fv(prog.uniforms.uModelMat, false, $mat4.ident)

	let proj = $mat4.perspective(Math.PI / 2, width/height, 0.03)
	gl.uniformMatrix4fv(prog.uniforms.uProjMat, false, proj)

	gl.enableVertexAttribArray($gl.boundAttr.aPosition)
	gl.enableVertexAttribArray($gl.boundAttr.aColor)

	let [lines, tris, colors] = generateMaze()

	/** @type {[number, number, number]} */
	let camPos = [1.5, 1.5, 1.5]
	let camPitch = 0
	let camYaw = 0

	$input.capturePointerMove(canvas, (dx, dy) => {
		if ($input.mouse.buttons & 1) {
			camYaw -= dx * lookSpeed
			camPitch -= dy * lookSpeed
		}
	})

	while (true) {
		await $async.frame()
		$gl.checkError(gl)

		let lookMat = DOMMatrix.fromFloat32Array($mat4.ident)
		lookMat.rotateAxisAngleSelf(1, 0, 0, -camPitch * 180 / Math.PI)
		lookMat.rotateAxisAngleSelf(0, 0, 1, -camYaw * 180 / Math.PI)
		let invLookMat = lookMat.inverse()

		if ($input.codes['KeyD']) {
			camPos = moveCamera(camPos, invLookMat, [1, 0, 0])
		}
		if ($input.codes['KeyA']) {
			camPos = moveCamera(camPos, invLookMat, [-1, 0, 0])
		}
		if ($input.codes['KeyW']) {
			camPos = moveCamera(camPos, invLookMat, [0, 1, 0])
		}
		if ($input.codes['KeyS']) {
			camPos = moveCamera(camPos, invLookMat, [0, -1, 0])
		}
		if ($input.codes['KeyE']) {
			camPos = moveCamera(camPos, invLookMat, [0, 0, 1])
		}
		if ($input.codes['KeyQ']) {
			camPos = moveCamera(camPos, invLookMat, [0, 0, -1])
		}

		let viewMat = lookMat.translate(...$vec.neg(camPos))
		gl.uniformMatrix4fv(prog.uniforms.uViewMat, false, viewMat.toFloat32Array())

		gl.clearColor(...$colArr.rgba(45, 0, 90, 1))
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

		// gl.vertexAttrib3f($gl.boundAttr.aColor, 1, 0, 0)
		// $glImm.vertexAttribData(gl, $gl.boundAttr.aPosition, lines, 3, gl.FLOAT)
		// gl.drawArrays(gl.LINES, 0, lines.length / 3)
		$glImm.vertexAttribData(gl, $gl.boundAttr.aPosition, tris, 3, gl.FLOAT)
		$glImm.vertexAttribData(gl, $gl.boundAttr.aColor, colors, 3, gl.FLOAT)
		gl.drawArrays(gl.TRIANGLES, 0, tris.length / 3)
	}
}

main()
