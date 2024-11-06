import * as $math from './math.js'

/**
 * @template T
 * @param {number} length
 * @param {T} value
 * @returns {T[]}
 */
export function repeat(length, value) {
    return [...Array(length)].fill(value)
}

/**
 * @template T
 * @param {number} length
 * @param {(index: number) => T} fn
 * @returns {T[]}
 */
export function seq(length, fn) {
    return [...Array(length)].map((v, i) => fn(i))
}

/**
 * @template T
 * @param {T[]} arr
 */
export function shuffle(arr) {
    // https://stackoverflow.com/a/12646864
    arr = [...arr]
    for (let i = arr.length - 1; i >= 0; i--) {
        let j = $math.randInt(0, i)
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
}

/**
 * @template T
 * @param {T[]} arr
 * @returns {T[]}
 */
export function shuffled(arr) {
    return shuffle([...arr])
}
