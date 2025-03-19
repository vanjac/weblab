// https://macarthur.me/posts/navigating-the-event-loop/

/**
 * @returns {Promise<DOMHighResTimeStamp>}
 */
export function frame() {
	return new Promise(resolve => {
		window.requestAnimationFrame(resolve)
	})
}
