// https://macarthur.me/posts/navigating-the-event-loop/

/**
 * @param {number} ms
 */
export function sleep(ms) {
    return new Promise(resolve => {
        window.setTimeout(resolve, ms)
    })
}

/**
 * @returns {Promise<DOMHighResTimeStamp>}
 */
export function frame() {
    return new Promise(resolve => {
        window.requestAnimationFrame(resolve)
    })
}

/**
 * @param {IdleRequestOptions} [options]
 * @returns {Promise<IdleDeadline>}
 */
export function idle(options) {
    return new Promise(resolve => {
        window.requestIdleCallback(resolve, options)
    })
}
