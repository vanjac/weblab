/**
 * @template T
 * @template {unknown[]} ArgType
 * @param {(...args: ArgType) => T} fn
 * @returns {(...args: ArgType) => T}
 */
export function lazy(fn) {
    let called = false
    /** @type {T} */
    let value
    return (...args) => {
        if (!called) {
            value = fn(...args)
            called = true
        }
        return value
    }
}
