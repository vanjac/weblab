'use strict'
const $input = (() => {
	let $input = {}

	/** @type {Record<string, DOMHighResTimeStamp>} */
	$input.keys = Object.create(null)
	/** @type {Record<string, DOMHighResTimeStamp>} */
	$input.codes = Object.create(null)

	$input.mouse = new PointerEvent('pointermove')

	document.addEventListener('keydown', e => {
		if (!e.repeat) {
			let time = performance.now()
			$input.keys[e.key] = time
			$input.codes[e.code] = time
		}
	})
	document.addEventListener('keyup', e => {
		delete $input.keys[e.key]
		delete $input.codes[e.code]
	})

	/**
	 * @param {PointerEvent} e
	 */
	function updateMouse(e) {
		if (e.isPrimary) {
			$input.mouse = e
		}
	}
	document.addEventListener('pointerdown', updateMouse)
	document.addEventListener('pointermove', updateMouse)
	document.addEventListener('pointerup', updateMouse)

	/**
	 * @param {HTMLElement} elem
	 * @param {(dx: number, dy: number) => void} listener
	 */
	$input.capturePointerMove = function(elem, listener) {
		elem.style.touchAction = 'pinch-zoom'

		let screenX = 0, screenY = 0
		elem.addEventListener('pointerdown', e => {
			if (e.isPrimary) {
				;({screenX, screenY} = e)
				elem.setPointerCapture(e.pointerId)
			}
		})
		elem.addEventListener('pointermove', e => {
			if (e.isPrimary) {
				// movementX and movementY are inconsistent on mobile browsers
				let dx = e.screenX - screenX
				let dy = e.screenY - screenY
			;({screenX, screenY} = e)
				listener(dx, dy)
			}
		})
	}

	/**
	 * @param {HTMLCanvasElement} canvas
	 * @param {MouseEvent} event
	 */
	$input.canvasMousePos = function(canvas, event = $input.mouse) {
		let rect = canvas.getBoundingClientRect()
		return [
			(event.clientX - rect.left) * canvas.width / rect.width,
			(event.clientY - rect.top) * canvas.height / rect.height,
		]
	}

	return $input
})()
