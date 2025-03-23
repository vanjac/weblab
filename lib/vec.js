/**
 * @param {readonly number[]} a
 * @param {readonly number[]} b
 * @returns {boolean}
 */
export function eq(a, b) {
	return a.reduce((a, v, i) => a && v == b[i], true)
}

/**
 * @template {number[]} T
 * @param {(a: number, b?: number) => number} op
 * @param {number | Readonly<T>} a
 * @param {number | Readonly<T>} [b]
 * @returns {T}
 */
export function apply(op, a, b) {
	if (typeof a == 'object') {
		if (typeof b == 'object') {
			return /** @type {T} */(a.map((e,i) => op(e, b[i])))
		} else {
			return /** @type {T} */(a.map(e => op(e, b)))
		}
	} else {
		if (typeof b == 'object') {
			return /** @type {T} */(b.map(e => op(a, e)))
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
 * @template {number[]} T
 * @param {number | Readonly<T>} a
 * @param {number | Readonly<T>} b
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
 * @template {number[]} T
 * @param {number | Readonly<T>} a
 * @param {number | Readonly<T>} b
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
 * @template {number[]} T
 * @param {number | Readonly<T>} a
 * @param {number | Readonly<T>} b
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
 * @template {number[]} T
 * @param {number | Readonly<T>} a
 * @param {number | Readonly<T>} b
 */
export function div(a, b) {
	return apply(opDiv, a, b)
}

/**
 * @template {number[]} T
 * @param {number | Readonly<T>} v
 */
export function neg(v) {
	return sub(0, v)
}

/**
 * @param {readonly number[]} a
 * @param {readonly number[]} b
 * @returns {number}
 */
export function dot(a, b) {
	return a.reduce((a, v, i) => a + v * b[i], 0)
}

/**
 * @param {readonly number[]} v
 * @returns {number}
 */
export function mag(v) {
	return Math.hypot(...v)
}

/**
 * @template {number[]} T
 * @param {Readonly<T>} v
 */
export function normalize(v) {
	let m = mag(v)
	return m ? div(v, m) : v
}

/**
 * @template {number[]} T
 * @param {number} dim
 * @param {number} axis
 * @param {number} value
 * @returns {T}
 */
export function axis(dim, axis, value = 1) {
	let vec = /** @type {T} */(Array(dim).fill(0))
	vec[((axis % dim) + dim) % dim] = value
	return vec
}
