export const radToDeg = Math.PI / 180.0
export const degToRad = 180.0 / Math.PI

/**
 * @param {number} a
 * @param {number} b
 */
export function mod(a, b) {
    return ((a % b) + b) % b
}

/**
 * @param {number} n
 * @param {number} lo
 * @param {number} hi
 */
export function clamp(n, lo, hi) {
    return Math.max(Math.min(n, hi), lo)
}

/**
 * @param {number} n
 * @param {number} fromA
 * @param {number} fromB
 * @param {number} toA
 * @param {number} toB
 */
export function map(n, fromA, fromB, toA = 0, toB = 1) {
    return (n - fromA) / (fromB - fromA) * (toB - toA) + toA
}

/**
 * @param {number} start
 * @param {number} stop
 * @param {number} amt
 */
export function lerp(start, stop, amt) {
    return amt * (stop - start) + start
}

/**
 * @param {number} edge0
 * @param {number} edge1
 * @param {number} n
 */
export function smoothstep(edge0, edge1, n) {
    let t = clamp((n - edge0) / (edge1 - edge0), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)
}

/**
 * @param {number} angle
 */
export function degrees(angle) {
    return angle * radToDeg
}

/**
 * @param {number} angle
 */
export function radians(angle) {
    return angle * degToRad
}

/**
 * @param {number} lo
 * @param {number} hi
 */
export function random(lo = 0, hi = 1) {
    return Math.random() * (hi - lo) + lo
}
