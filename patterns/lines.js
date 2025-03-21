// Date: 2023-10-05

import * as $html from '../lib/html.js'
import * as $async from '../lib/async.js'

let width = 400
let height = 400

async function main() {
	let canvas = document.body.appendChild($html.canvas({width, height}))
	let ctx = canvas.getContext('2d')
	ctx.filter = 'blur(1px) brightness(200%)'

	while (true) {
		let time = await $async.frame()

		ctx.fillStyle = '#011'
		ctx.fillRect(0, 0, canvas.width, canvas.height)

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
