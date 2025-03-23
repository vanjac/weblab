// Date: 2024-10-30

import * as $html from '../lib/html.js'
import * as $input from '../lib/input.js'
import * as $canvas from '../lib/canvas.js'
import * as $vec from '../lib/vec.js'

let width = 512
let height = 512

let bgCol = 'black'
let traceColLight = 60
let traceHueRate = .01
let traceWidth = 4
let tail = 1
let fadeAlpha = 0.04
let velRate = 0.5
let accelRate = 0.05
let repelRate = 0.8
let feedbackScale = 1.005
let feedbackBlur = 1
let feedbackHue = 5
let feedbackBright = 103
let feedbackSat = 101

/**
 * @typedef {{
 *		x: number
 *		y: number
 *		velX: number
 *		velY: number
 * }} Trace
 */

/** @type {Trace[]} */
let traces = [
	{x: 0, y: 0, velX: 0, velY: 0},
	{x: width, y: 0, velX: 0, velY: 0},
	{x: width, y: height, velX: 0, velY: 0},
]

async function main() {
	let canvas = document.body.appendChild($html.canvas({width, height}))
	canvas.style.touchAction = 'pinch-zoom'
	let ctx = canvas.getContext('2d')

	ctx.fillStyle = bgCol
	ctx.fillRect(0, 0, width, height)

	while (true) {
		/** @type {number} */
		let time = await new Promise(r => requestAnimationFrame(r))
		let mouseDown = $input.mouse.buttons & 1

		let filter = `brightness(${feedbackBright}%) saturate(${feedbackSat}%)`
		filter += ` blur(${feedbackBlur}px) hue-rotate(${feedbackHue}deg)`
		ctx.filter = filter
		ctx.translate(width / 2, height / 2)
		ctx.scale(feedbackScale, feedbackScale)
		ctx.translate(-width / 2, -height / 2)
		ctx.drawImage(canvas, 0, 0)
		ctx.filter = ''
		ctx.resetTransform()

		ctx.globalAlpha = mouseDown ? fadeAlpha * 2 : fadeAlpha
		ctx.fillStyle = bgCol
		ctx.fillRect(0, 0, width, height)

		ctx.globalAlpha = 1

		let [mouseX, mouseY] = $canvas.mousePos(canvas, $input.mouse)
		let traceI = 0
		for (let trace of traces) {
			let ptraceX = trace.x, ptraceY = trace.y

			let tarVelX = (mouseX - trace.x) * (mouseDown ? 1 : velRate)
			let tarVelY = (mouseY - trace.y) * (mouseDown ? 1 : velRate)
			for (let other of traces) {
				if (other != trace) {
					let [dx, dy] = $vec.normalize([trace.x - other.x, trace.y - other.y])
					;[dx, dy] = $vec.mul([dx, dy], $vec.mag([trace.velX, trace.velY]))
					tarVelX += dx * repelRate
					tarVelY += dy * repelRate
				}
			}
			trace.velX += (tarVelX - trace.velX) * accelRate
			trace.velY += (tarVelY - trace.velY) * accelRate

			trace.x += trace.velX
			trace.y += trace.velY

			ctx.strokeStyle = `hsl(${time * traceHueRate + traceI * 60} 100% ${traceColLight}%)`
			ctx.lineWidth = traceWidth
			ctx.beginPath()
			ctx.moveTo(ptraceX + (ptraceX - trace.x) * tail, ptraceY + (ptraceY - trace.y) * tail)
			ctx.lineTo(trace.x, trace.y)
			ctx.stroke()
			traceI++
		}
	}
}

main()
