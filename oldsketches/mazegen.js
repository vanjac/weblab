// Date: 2016-03-05
// Ported to JS: 2024-10-16

import * as $html from '../lib/html.js'
import * as $array from '../lib/array.js'

const width = 640
const height = 640

/** @type {CanvasRenderingContext2D} */
let ctx

function setup() {
	let canvas = document.body.appendChild($html.canvas({width, height}))
	ctx = canvas.getContext('2d')
	ctx.fillStyle = 'black'
	ctx.fillRect(0, 0, width, height)
	ctx.lineWidth = 2
	makeMaze()
}

function draw() {
	window.requestAnimationFrame(draw)
	for(let i = 0; i < 1000; i++) {
		mazeStep()
	}
}

const mazeXLen = 53
const mazeYLen = 53
const spaces = $array.seq(mazeXLen, () => Array(mazeYLen).fill(false))
let filledSpaces = 0
const mazeWallLen = 12


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
	addWall(0,0,xWallLoc,0)
	addWall(0,0,0,yWallLoc)
	addWall(xWallLoc,yWallLoc,xWallLoc,0)
	addWall(xWallLoc,yWallLoc,0,yWallLoc)
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
	let xMove = 0, yMove = 0
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

/**
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 */
function addWall(x1, y1, x2, y2) {
	ctx.strokeStyle = `hsl(${(x1 / width + y1 / height) * 180} 100% 50%)`
	ctx.beginPath()
	ctx.moveTo(x1, y1)
	ctx.lineTo(x2, y2)
	ctx.stroke()
}

setup()
window.requestAnimationFrame(draw)
