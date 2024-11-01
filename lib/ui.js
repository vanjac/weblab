import * as $dom from './dom.js'

/**
 * @param {number} value
 * @param {object} param1
 * @param {number} [param1.min]
 * @param {number} [param1.max]
 * @param {number} [param1.step]
 * @param {number} [param1.rangeMin]
 * @param {number} [param1.rangeMax]
 * @param {boolean} [param1.log]
 * @param {(number) => void} callback
 */
export function rangeSpinner(
        value,
        {min = -999999, max = 999999, step, rangeMin = min, rangeMax = max, log = false} = {},
        callback) {
    /** @type {(v: number) => number} */
    let toRange = log ? Math.log : (n => n)
    /** @type {(v: number) => number} */
    let fromRange = log ? Math.exp : (n => n)

    let div = $dom.create('div', {style: 'display: flex'})

    let range = $dom.create('input', {
        type: 'range',
        step: step?.toString() ?? 'any',
    }, div)
    if (rangeMin != null) {
        range.min = toRange(rangeMin).toString()
    }
    if (rangeMax != null) {
        range.max = toRange(rangeMax).toString()
    }
    range.style.flexGrow = '1'

    let num = $dom.create('input', {
        type: 'number',
        min: min?.toString() ?? '',
        max: max?.toString() ?? '',
        step: step?.toString() ?? null,
    }, div)

    range.valueAsNumber = toRange(value)
    num.valueAsNumber = value

    range.addEventListener('input', () => {
        let value = fromRange(range.valueAsNumber)
        if (!Number.isNaN(value)) {
            num.valueAsNumber = value
            callback(value)
        }
    })
    num.addEventListener('input', () => {
        let value = num.valueAsNumber
        if (!Number.isNaN(value)) {
            range.valueAsNumber = toRange(value)
            callback(value)
        }
    })
    return div
}
