/**
 * @param {(a: number, b?: number) => number} op
 * @param {number | number[]} a
 * @param {number | number[]} [b]
 * @returns {number[]}
 */
export function apply(op, a, b) {
    if (typeof a == 'object') {
        if (typeof b == 'object') {
            return a.map((e,i) => op(e, b[i]))
        } else {
            return a.map(e => op(e, b))
        }
    } else {
        if (typeof b == 'object') {
            return b.map(e => op(a, e))
        } else {
            throw new TypeError()
        }
    }
}

/**
 * @param {number} a
 * @param {number} b
 */
function opAdd(a, b) { return a + b }
/**
 * @param {number | number[]} a
 * @param {number | number[]} b
 * @returns {number[]}
 */
export function add(a, b) {
    return apply(opAdd, a, b)
}

/**
 * @param {number} a
 * @param {number} b
 */
function opSub(a, b) { return a - b }
/**
 * @param {number | number[]} a
 * @param {number | number[]} b
 * @returns {number[]}
 */
export function sub(a, b) {
    return apply(opSub, a, b)
}

/**
 * @param {number} a
 * @param {number} b
 */
function opMul(a, b) { return a * b }
/**
 * @param {number | number[]} a
 * @param {number | number[]} b
 * @returns {number[]}
 */
export function mul(a, b) {
    return apply(opMul, a, b)
}

/**
 * @param {number} a
 * @param {number} b
 */
function opDiv(a, b) { return a / b }
/**
 * @param {number | number[]} a
 * @param {number | number[]} b
 * @returns {number[]}
 */
export function div(a, b) {
    return apply(opDiv, a, b)
}

/**
 * @param {number[]} a
 * @param {number[]} b
 * @returns {number}
 */
export function dot(a, b) {
    return a.reduce((a, v, i) => a + v * b[i], 0)
}

/**
 * @param {number[]} v
 * @returns {number}
 */
export function mag(v) {
    return Math.hypot(...v)
}

/**
 * @param {number[]} v
 * @returns {number[]}
 */
export function normalize(v) {
    return div(v, mag(v))
}
