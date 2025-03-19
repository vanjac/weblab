// Date: 2016-04-16
// Ported to JS: 2024-10-18

import {$html, $gl, $glShader, $glImm, $mat4, $colArr} from '../lib/index-3d.js'
import * as $array from '../lib/array.js'
import * as $input from '../lib/input.js'
/** @typedef {[number, number, number]} Color */

const width = 960
const height = 640

const OTHER = 0
const HORIZ = 1
const VERT = 2


const wallHeight = 256
//player pos is negative
let playerX = -100
let playerY = -100
let xVel = 0, yVel = 0
let playerRot = Math.PI

const walkSpeed = 100
const playerWidth = 24

let gameStarted = false


const mazeXLen = 12
const mazeYLen = 12
const spaces = $array.seq(mazeXLen, () => Array(mazeYLen).fill(false))
let filledSpaces = 0
const mazeWallLen = 256

class Wall {
	/**
	 * @param {number} x1
	 * @param {number} y1
	 * @param {number} x2
	 * @param {number} y2
	 * @param {Color} c
	 */
	constructor(x1, y1, x2, y2, c) {
		this.x1 = x1
		this.y1 = y1
		this.x2 = x2
		this.y2 = y2
		this.direction = OTHER
		if(x1 == x2) {
			this.direction = VERT
		}
		if(y1 == y2) {
			this.direction = HORIZ
		}
		this.c = c
	}

	/**
	 * @param {number} x
	 * @param {number} y
	 * @returns {boolean}
	 */
	collision(x, y) {
		x = -x
		y = -y
		if(this.direction == HORIZ) {
			return Math.abs(y - this.y1) < playerWidth && inRange(x, this.x1, this.x2, playerWidth)
		}
		if(this.direction == VERT) {
			return Math.abs(x - this.x1) < playerWidth && inRange(y, this.y1, this.y2, playerWidth)
		}
		return false
	}

}

/** @type {Wall[]} */
let walls

/** @type {HTMLCanvasElement} */
let canvas
/** @type {WebGL2RenderingContext} */
let gl
/** @type {$gl.ProgramInfo} */
let prog

function setup() {
	canvas = $html.canvas({width, height})
	document.body.append(
		canvas,
		$html.button({onclick: () => canvas.requestFullscreen()}, ['Fullscreen'])
	)

	gl = canvas.getContext('webgl2')
	gl.enable(gl.DEPTH_TEST)
	prog = $gl.createProgram(gl, [
		$glShader.basicVert(gl, {transform: true}),
		$glShader.basicFrag(gl),
	])
	gl.uniformMatrix4fv(prog.uniforms.uModelMat, false, $mat4.ident)
	gl.uniformMatrix4fv(prog.uniforms.uViewMat, false, $mat4.ident)
	gl.uniformMatrix4fv(prog.uniforms.uProjMat, false, $mat4.ident)
	gl.enableVertexAttribArray($gl.boundAttr.aPosition)

	walls = []
	makeMaze()
}

/**
 * @param {number} dx
 * @param {number} dy
 */
function mouseMove(dx, dy) {
	if ($input.mouse.buttons & 1) {
		playerRot += dx * Math.PI / 360
	}
}

function draw() {
	window.requestAnimationFrame(draw)

	gl.clearColor(...$colArr.rgba(95, 191, 255, 1))
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
	for(let i = 0; i < 1000; i++) {
		mazeStep()
	}

	if($input.mouse.buttons & 1) {
		gameStarted = true
		xVel = 0
		yVel = 0
	}
	else {
		xVel = Math.cos(playerRot)*walkSpeed/60
		yVel = Math.sin(playerRot)*walkSpeed/60
	}

	if(gameStarted) {
		playerX += xVel
		playerY += yVel

		for(let i = 0; i < walls.length; i++) {
			let w = walls[i]
			if(w.collision(playerX, playerY)) {
				playerX -= xVel
				playerY -= yVel
				break
			}
		}
	}

	cameraPoint(playerX, playerY, playerRot)
	for(let i = 0; i < walls.length; i++) {
		let w = walls[i]
		wall(w.x1, w.y1, w.x2, w.y2, w.c)
	}

	gl.vertexAttrib3fv($gl.boundAttr.aColor, $colArr.rgb(255, 127, 0))
	let xMax = mazeWallLen*mazeXLen
	let yMax = mazeWallLen*mazeYLen

	let vertices = new Float32Array([
		0, 0, wallHeight/2,
		xMax, 0, wallHeight/2,
		xMax, yMax, wallHeight/2,
		0, yMax, wallHeight/2,
	])
	$glImm.vertexAttribData(gl, $gl.boundAttr.aPosition, vertices, 3, gl.FLOAT)
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
}

/**
 * @param {number} x
 * @param {number} y
 * @param {number} rotation
 */
function cameraPoint(x, y, rotation) {
	let cameraY = height/2.0
	let fov = 95 * Math.PI / 180
	let cameraZ = cameraY / Math.tan(fov / 2.0)
	let aspect = width / height

	gl.uniformMatrix4fv(prog.uniforms.uProjMat, false, $mat4.perspective(fov, aspect, cameraZ/50.0))
	let view = $mat4.ident.slice()
	$mat4.rotate(view, -rotation + Math.PI/2, [0,0,1], view)
	$mat4.translate(view, [-x,-y,0], view)
	$mat4.scale(view, [-1,-1,-1], view)
	gl.uniformMatrix4fv(prog.uniforms.uViewMat, false, view)
}

/**
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {Color} c
 */
function wall(x1, y1, x2, y2, c) {
	gl.vertexAttrib3fv($gl.boundAttr.aColor, c)
	let vertices = new Float32Array([
		x1, y1, -wallHeight/2,
		x1, y1, wallHeight/2,
		x2, y2, wallHeight/2,
		x2, y2, -wallHeight/2,
	])
	$glImm.vertexAttribData(gl, $gl.boundAttr.aPosition, vertices, 3, gl.FLOAT)
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
	gl.vertexAttrib3fv($gl.boundAttr.aColor, $colArr.rgb(0, 0, 0))
	gl.drawArrays(gl.LINE_LOOP, 0, 4)
}

/**
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {Color} c
 */
function addWall(x1, y1, x2, y2, c = $colArr.rgb(255, 255, 255)) {
	walls.push(new Wall(x1, y1, x2, y2, c))
}

/**
 * @param {number} n
 * @param {number} r1
 * @param {number} r2
 * @param {number} maxDist
 * @returns {boolean}
 */
function inRange(n, r1, r2, maxDist) {
	if(r1 > r2) {
		let temp = r1
		r1 = r2
		r2 = temp
	}
	return n > r1-maxDist && n < r2+maxDist
}



function makeMaze() {
	for(let y = 0; y < mazeYLen; y++) {
		for(let x = 0; x < mazeXLen; x++) {
			spaces[x][y] = false
		}
	}

	for(let x = 0; x < mazeXLen; x++) {
		spaces[x][0] = true
		spaces[x][mazeYLen-1] = true
		filledSpaces+=2
	}
	for(let y = 1; y < mazeYLen-1; y++) {
		spaces[0][y] = true
		spaces[mazeXLen-1][y] = true
		filledSpaces+=2
	}
	let xWallLoc = (mazeXLen-1)*mazeWallLen
	let yWallLoc = (mazeYLen-1)*mazeWallLen
	addWall(0,0,xWallLoc,0,$colArr.rgb(255,0,0))
	addWall(0,0,0,yWallLoc,$colArr.rgb(255,255,0))
	addWall(xWallLoc,yWallLoc,xWallLoc,0,$colArr.rgb(0,255,0))
	addWall(xWallLoc,yWallLoc,0,yWallLoc,$colArr.rgb(0,0,255))
}

function mazeStep() {
	if(filledSpaces == mazeXLen*mazeYLen) {
		return
	}
	let x
	let y
	while(true) {
		x = Math.floor(Math.random() * mazeXLen)
		y = Math.floor(Math.random() * mazeYLen)
		if(spaces[x][y]) {
			break
		}
	}

	let direction = Math.floor(Math.random() * 4)
	let xMove=0, yMove=0
	if(direction == 0) {
		xMove = 1
		yMove = 0
	}
	if(direction == 1) {
		xMove = 0
		yMove = 1
	}
	if(direction == 2) {
		xMove = -1
		yMove = 0
	}
	if(direction == 3) {
		xMove = 0
		yMove = -1
	}
	if(x+xMove >= mazeXLen || y+yMove >= mazeYLen || x+xMove < 0 || y+yMove < 0) {
		return
	}
	if(!spaces[x+xMove][y+yMove]) {
		spaces[x+xMove][y+yMove] = true
		filledSpaces++
		addWall(x*mazeWallLen,y*mazeWallLen,(x+xMove)*mazeWallLen,(y+yMove)*mazeWallLen)
	}

}

setup()
$input.capturePointerMove(canvas, mouseMove)
window.requestAnimationFrame(draw)
