/** @type {Record<string, DOMHighResTimeStamp>} */
export const keys = Object.create(null)
/** @type {Record<string, DOMHighResTimeStamp>} */
export const codes = Object.create(null)

export let mouse = new PointerEvent('pointermove')

document.addEventListener('keydown', e => {
	if (!e.repeat) {
		let time = performance.now()
		keys[e.key] = time
		codes[e.code] = time
	}
})
document.addEventListener('keyup', e => {
	delete keys[e.key]
	delete codes[e.code]
})

/**
 * @param {PointerEvent} e
 */
function updateMouse(e) {
	if (e.isPrimary) {
		mouse = e
	}
}
document.addEventListener('pointerdown', updateMouse)
document.addEventListener('pointermove', updateMouse)
document.addEventListener('pointerup', updateMouse)

/**
 * @param {HTMLElement} elem
 * @param {(dx: number, dy: number) => void} listener
 */
export function capturePointerMove(elem, listener) {
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
