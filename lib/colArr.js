// VS Code will show a color picker for these functions.

/**
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {[number, number, number]}
 */
export function rgb(r, g, b) {
    return [r / 255, g / 255, b / 255]
}

/**
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @param {number} a
 * @returns {[number, number, number, number]}
 */
export function rgba(r, g, b, a = 1) {
    return [r / 255, g / 255, b / 255, a]
}
