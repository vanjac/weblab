// Date: 2013-12-07
// Ported to JS: 2024-10-16

import * as $dom from '../lib/dom.js'
import * as $canvas from '../lib/canvas.js'
import * as $array from '../lib/array.js'

const width = 300
const height = 300

const numSquares = 10
const squareSize = 30
const flipSelf = false
const litSquare = 'rgb(255, 255, 0)'
const cBackground = 'rgb(0, 0, 0)'
const cStroke = 'rgb(255, 255, 255)'
/** @type {LightSquare[][]} */
let grid

/** @type {CanvasRenderingContext2D} */
let ctx

class LightSquare {
	/**
	 * @param {number} x
	 * @param {number} y
	 */
	constructor (x, y) {
		this.xPos = x
		this.yPos = y
		this.litState = false
		offSquare (this.xPos, this.yPos)
	}

	clicked() {
		if (this.xPos != 0) {
			grid[this.xPos - 1][this.yPos].flip()
		}
		if (this.yPos != 0) {
			grid[this.xPos][this.yPos - 1].flip()
		}
		if (this.xPos != numSquares - 1) {
			grid[this.xPos + 1][this.yPos].flip()
		}
		if (this.yPos != numSquares - 1) {
			grid[this.xPos][this.yPos + 1].flip()
		}
		if (flipSelf) {
			this.flip()
		}
	}

	flip() {
		if (this.litState) {
			this.litState = false
			offSquare (this.xPos, this.yPos)
		} else {
			this.litState = true
			onSquare (this.xPos, this.yPos)
		}
	}

	reset() {
		this.litState = false
		offSquare (this.xPos, this.yPos)
	}
}

function setup() {
	let canvas = $dom.create('canvas', {width, height}, document.body)
	ctx = canvas.getContext('2d')
	ctx.translate(.5, .5)
	ctx.fillStyle = cBackground
	ctx.fillRect(0, 0, width, height)
	grid = $array.seq(numSquares, x => $array.seq(numSquares, y => new LightSquare(x, y)))
}

/**
 * @param {number} x
 * @param {number} y
 */
function offSquare(x, y) {
	ctx.fillStyle = cBackground
	ctx.strokeStyle = cStroke
	ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize)
	ctx.strokeRect(x * squareSize, y * squareSize, squareSize, squareSize)
}

/**
 * @param {number} x
 * @param {number} y
 */
function onSquare(x, y) {
	ctx.fillStyle = litSquare
	ctx.strokeStyle = cStroke
	let circle = $canvas.circle((x + 0.5) * squareSize, (y + 0.5) * squareSize, squareSize / 2)
	ctx.fill(circle)
	ctx.stroke(circle)
}

/**
 * @param {MouseEvent} e
 */
function mouseClicked(e) {
	let [mouseX, mouseY] = $canvas.mousePos(ctx.canvas, e)
	grid[Math.floor(mouseX / squareSize)][Math.floor(mouseY / squareSize)].clicked()
}

/**
 * @param {KeyboardEvent} e
 */
function keyPressed(e) {
	if (e.key == 'r') {
		for (let x = 0; x < numSquares; x++) {
			for (let y = 0; y < numSquares; y++) {
				(grid[x][y]).reset()
			}
		}
	}
}

setup()
ctx.canvas.addEventListener('click', mouseClicked)
document.addEventListener('keydown', keyPressed)
