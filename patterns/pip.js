// Date: 2024-10-20

'use strict'

let canvas = document.querySelector('canvas')
let {width, height} = canvas

let xScroll = -.04
let yScroll = -.03
let bgCol = '#d03'
let bgAlpha = .05
let sqSpin = .0002
let sqScale = .5
let sqAlpha = .5
let hueRot = -15

/**
 * @param {number} a
 * @param {number} b
 */
function mod(a, b) {
	return ((a % b) + b) % b
}

async function main() {
	let ctx = canvas.getContext('2d')

	let bgCanvas = document.createElement('canvas')
	Object.assign(bgCanvas, {width, height})
	let bgCtx = bgCanvas.getContext('2d')

	while (true) {
		/** @type {number} */
		let time = await new Promise(r => requestAnimationFrame(r))

		ctx.filter = `hue-rotate(${hueRot}deg)`
		ctx.globalAlpha = bgAlpha
		ctx.fillStyle = bgCol
		ctx.fillRect(0, 0, width, height)

		let xOff = time * xScroll
		let yOff = time * yScroll

		ctx.globalAlpha = sqAlpha
		for (let i = 0; i < 2; i++) {
			for (let x = -1; x < 4; x++) {
				for (let y = -1; y < 4; y++) {
					let trX = width * (.25 + x / 2) + (xOff % (width / 2))
					let trY = height * (.25 + y / 2) + (yOff % (height / 2))
					ctx.translate(trX, trY)
					let checker = x + y + Math.floor(xOff / width * 2) + Math.floor(yOff / width * 2)
					ctx.rotate(time * sqSpin + mod(checker, 2) * Math.PI / 4)
					ctx.scale(sqScale, sqScale)
					ctx.translate(-width/2, -height/2)
					ctx.drawImage(bgCanvas, 0, 0)
					ctx.setTransform(1, 0, 0, 1, 0, 0)
				}
			}
		}

		bgCtx.drawImage(canvas, 0, 0)
	}
}

main()
