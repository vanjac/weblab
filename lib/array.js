/**
 * @template T
 * @param {number} length
 * @param {(index: number) => T} fn
 * @returns {T[]}
 */
export function seq(length, fn) {
	return [...Array(length)].map((v, i) => fn(i))
}
