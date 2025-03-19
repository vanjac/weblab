/**
 * @param {HTMLCanvasElement} canvas
 * @param {MouseEvent} event
 */
export function mousePos(canvas, event) {
	let rect = canvas.getBoundingClientRect()
	return [
		(event.clientX - rect.left) * canvas.width / rect.width,
		(event.clientY - rect.top) * canvas.height / rect.height,
	]
}
