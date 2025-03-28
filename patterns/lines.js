// Date: 2023-10-05

'use strict'

let canvas = document.querySelector('canvas')
let {width, height} = canvas

async function main() {
	let ctx = canvas.getContext('2d')
	ctx.filter = 'blur(1px) brightness(200%)'

	while (true) {
		/** @type {number} */
		let time = await new Promise(r => requestAnimationFrame(r))

		ctx.fillStyle = '#011'
		ctx.fillRect(0, 0, width, height)

		ctx.strokeStyle = '#55f'
		ctx.lineWidth = 2
		for (let x = (time / 30) % 20 - 20; x < 2000; x += 20) {
			ctx.beginPath()
			ctx.moveTo(x, 0)
			ctx.lineTo(x * 0.3, 400)
			ctx.moveTo(0, x)
			ctx.lineTo(400, x * 0.3)
			ctx.stroke()
		}
	}
}

main()
