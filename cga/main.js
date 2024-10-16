import * as $array from '../lib/array.js'

const width = 80
const height = 25

// https://en.wikipedia.org/wiki/Color_Graphics_Adapter#Color_palette
const palette = Object.freeze([
    '#000000', '#0000AA', '#00AA00', '#00AAAA',
    '#AA0000', '#AA00AA', '#AA5500', '#AAAAAA',
    '#555555', '#5555FF', '#55FF55', '#55FFFF',
    '#FF5555', '#FF55FF', '#FFFF55', '#FFFFFF',
])

export class TerminalDisplay extends HTMLElement {
    constructor() {
        super()
        /** @private */
        this._chars = $array.repeat(height, ' '.repeat(width))
        /** @private */
        this._fgCols = $array.seq(height, () => $array.repeat(width, 15))
        /** @private */
        this._bgCols = $array.seq(height, () => $array.repeat(width, 0))
    }

    /**
     * @param {number} col
     * @param {number} row
     * @param {string} char
     * @param {number} fg
     * @param {number} bg
     */
    _setAttr(col, row, char, fg = null, bg = null) {
        if (char != null) {
            let line = this._chars[col]
            this._chars[col] = line.slice(0, row) + char + line.slice(row + 1)
        }
        if (fg != null) {
            this._fgCols[col][row] = fg
        }
        if (bg != null) {
            this._bgCols[col][row] = bg
        }
    }

    connectedCallback() {
        this._refresh()
    }

    /**
     * @private
     * @param {string} text
     * @param {number} fg
     * @param {number} bg
     */
    _createSpan(text, fg, bg) {
        let span = document.createElement('span')
        span.textContent = text
        span.style.color = palette[fg]
        span.style.backgroundColor = palette[bg]
        return span
    }

    _refresh() {
        let pre = document.createElement('pre')
        for (let col = 0; col < height; col++) {
            let curFg = -1
            let curBg = -1
            let curText = ''
            for (let row = 0; row < width; row++) {
                let fg = this._fgCols[col][row]
                let bg = this._bgCols[col][row]
                if (fg != curFg || bg != curBg) {
                    if (curText.length) {
                        pre.appendChild(this._createSpan(curText, curFg, curBg))
                        curText = ''
                    }
                    curFg = fg
                    curBg = bg
                }
                curText += this._chars[col][row]
            }
            if (curText.length) {
                pre.appendChild(this._createSpan(curText, curFg, curBg))
                pre.append('\n')
            }
        }

        this.textContent = ''
        this.appendChild(pre)
    }
}
window.customElements.define('terminal-display', TerminalDisplay)
