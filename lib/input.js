'use strict'
const $input = (() => {
	let self = {}

	/** @type {Record<string, DOMHighResTimeStamp>} */
	self.keys = Object.create(null)
	/** @type {Record<string, DOMHighResTimeStamp>} */
	self.codes = Object.create(null)

	self.mouse = new PointerEvent('pointermove')

	document.addEventListener('keydown', e => {
		if (!e.repeat) {
			let time = performance.now()
			self.keys[e.key] = time
			self.codes[e.code] = time
		}
	})
	document.addEventListener('keyup', e => {
		delete self.keys[e.key]
		delete self.codes[e.code]
	})

	/**
	 * @param {PointerEvent} e
	 */
	function updateMouse(e) {
		if (e.isPrimary) {
			self.mouse = e
		}
	}
	document.addEventListener('pointerdown', updateMouse)
	document.addEventListener('pointermove', updateMouse)
	document.addEventListener('pointerup', updateMouse)

	/**
	 * @param {HTMLElement} elem
	 * @param {(dx: number, dy: number) => void} listener
	 */
	self.capturePointerMove = function(elem, listener) {
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
	self.canvasMousePos = function(canvas, event = self.mouse) {
		let rect = canvas.getBoundingClientRect()
		return [
			(event.clientX - rect.left) * canvas.width / rect.width,
			(event.clientY - rect.top) * canvas.height / rect.height,
		]
	}

	return self
})()
