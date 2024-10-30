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
