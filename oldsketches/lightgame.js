// Date: 2013-12-07
// Ported to JS: 2024-10-16

'use strict'

let canvas = document.querySelector('canvas')
let {width, height} = canvas

let numSquares = 10
let squareSize = 30
let flipSelf = false
let litSquare = 'rgb(255, 255, 0)'
let cBackground = 'rgb(0, 0, 0)'
let cStroke = 'rgb(255, 255, 255)'

/** @type {LightSquare[][]} */
let grid = []

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
	ctx = canvas.getContext('2d')
	ctx.translate(.5, .5)
	ctx.fillStyle = cBackground
	ctx.fillRect(0, 0, width, height)
	for (let x = 0; x < numSquares; x++) {
		grid.push([])
		for (let y = 0; y < numSquares; y++) {
			grid[x].push(new LightSquare(x, y))
		}
	}
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
	let circle = new Path2D()
	circle.arc((x + 0.5) * squareSize, (y + 0.5) * squareSize, squareSize / 2, 0, 2 * Math.PI)
	ctx.fill(circle)
	ctx.stroke(circle)
}

/**
 * @param {MouseEvent} e
 */
function mouseClicked(e) {
	let [mouseX, mouseY] = $input.canvasMousePos(ctx.canvas, e)
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
