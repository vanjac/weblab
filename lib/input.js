/** @type {Record<string, DOMHighResTimeStamp>} */
export const pressed = Object.create(null)
export let mouseEvent = new PointerEvent('pointermove')

document.addEventListener('keydown', e => {
    if (!e.repeat) {
        pressed[e.code] = performance.now()
    }
})
document.addEventListener('keyup', e => {
    delete pressed[e.code]
})
document.addEventListener('pointerdown', e => {
    if (e.isPrimary) {
        mouseEvent = e
        pressed[e.button] = performance.now()
    }
})
document.addEventListener('pointermove', e => {
    if (e.isPrimary) {
        mouseEvent = e
    }
})
document.addEventListener('pointerup', e => {
    if (e.isPrimary) {
        mouseEvent = e
        delete pressed[e.button]
    }
})
