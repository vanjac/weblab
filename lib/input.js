/** @type {Record<string, DOMHighResTimeStamp>} */
export const pressed = Object.create(null)

document.addEventListener('keydown', e => {
    if (!e.repeat) {
        pressed[e.code] = performance.now()
    }
})
document.addEventListener('keyup', e => {
    delete pressed[e.code]
})
document.addEventListener('pointerdown', e => {
    pressed[e.button] = performance.now()
})
document.addEventListener('pointerup', e => {
    delete pressed[e.button]
})
