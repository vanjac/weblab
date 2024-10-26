import * as $array from '../lib/array.js'
import * as $dom from '../lib/dom.js'

const cols = 80
const rows = 25

// https://en.wikipedia.org/wiki/Color_Graphics_Adapter#Color_palette
const palette = Object.freeze([
    '#000000', '#0000AA', '#00AA00', '#00AAAA',
    '#AA0000', '#AA00AA', '#AA5500', '#AAAAAA',
    '#555555', '#5555FF', '#55FF55', '#55FFFF',
    '#FF5555', '#FF55FF', '#FFFF55', '#FFFFFF',
])

/** @type {HTMLElement} */
let elem
/** @type {number[][]} */
let chars
/** @type {number[][]} */
let fgCols
/** @type {number[][]} */
let bgCols

function init() {
    elem = $dom.create('div', {}, document.body)
    elem.style.lineHeight = '1'
    clear(15, 0)
    refresh()
}

/**
 * @param {number} fg
 * @param {number} bg
 */
export function clear(fg, bg) {
    chars = $array.seq(rows, () => $array.repeat(cols, 32))
    fgCols = $array.seq(rows, () => $array.repeat(cols, fg))
    bgCols = $array.seq(rows, () => $array.repeat(cols, bg))
}

/**
 * @param {number} col
 * @param {number} row
 * @param {number} char
 */
export function setChar(col, row, char) {
    chars[col][row] = char
}

/**
 * @param {number} col
 * @param {number} row
 * @param {number} fg
 * @param {number} bg
 */
export function setCol(col, row, fg, bg) {
    fgCols[col][row] = fg
    bgCols[col][row] = bg
}

/**
 * @private
 * @param {string} text
 * @param {number} fg
 * @param {number} bg
 */
function createSpan(text, fg, bg) {
    let span = document.createElement('span')
    span.textContent = text
    span.style.color = palette[fg]
    span.style.backgroundColor = palette[bg]
    return span
}

export function refresh() {
    let pre = document.createElement('pre')
    for (let col = 0; col < rows; col++) {
        let curFg = -1
        let curBg = -1
        let curText = ''
        for (let row = 0; row < cols; row++) {
            let fg = fgCols[col][row]
            let bg = bgCols[col][row]
            if (fg != curFg || bg != curBg) {
                if (curText.length) {
                    pre.appendChild(createSpan(curText, curFg, curBg))
                    curText = ''
                }
                curFg = fg
                curBg = bg
            }
            curText += String.fromCodePoint(chars[col][row])
        }
        if (curText.length) {
            pre.appendChild(createSpan(curText, curFg, curBg))
            pre.append('\n')
        }
    }

    elem.textContent = ''
    elem.appendChild(pre)
}

init()
