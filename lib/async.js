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
export function nextFrame() {
    return new Promise(resolve => {
        window.requestAnimationFrame(resolve)
    })
}

/**
 * @returns {Promise<void>}
 */
export function microtask() {
    return new Promise(resolve => {
        window.queueMicrotask(resolve)
    })
}
