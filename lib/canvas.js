/**
 * @param {number} x
 * @param {number} y
 * @param {number} radius
 * @returns {Path2D}
 */
export function circle(x, y, radius) {
	let path = new Path2D()
	path.arc(x, y, radius, 0, 2 * Math.PI)
	return path
}

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
