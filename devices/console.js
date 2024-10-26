import * as $ram from './ram.js'

let lineBuf = ''

/**
 * @param {number} c
 */
export function put(c) {
    if (c == 10) {
        console.log(lineBuf)
        lineBuf = ''
    } else {
        lineBuf += String.fromCodePoint(c)
    }
}

/**
 * @param {number} ptr
 */
export function write(ptr) {
    while (true) {
        let c = $ram.dataView.getUint8(ptr)
        if (c == 0) {
            break
        }
        put(c)
        ptr++
    }
}
