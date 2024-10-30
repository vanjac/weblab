/**
 * @template {keyof HTMLElementTagNameMap} [K='b']
 * @param {string} selectors
 * @param {K} [type]
 * @returns {HTMLElementTagNameMap[K]}
 */
export function get(selectors, type) {
    return document.querySelector(selectors)
}

/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} type
 * @param {Partial<HTMLElementTagNameMap[K]> | {style?: string}} attributes
 * @param {Node} parent
 */
export function create(type, attributes = {}, parent = null) {
    let elem = document.createElement(type)
    Object.assign(elem, attributes)
    if (parent) {
        parent.appendChild(elem)
    }
    return elem
}

/**
 * @param  {...(
 *      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLOutputElement
 * )} inputs
 */
export function linkInputs(...inputs) {
    /**
     * @param {number} idx
     */
    let copyValue = (idx) => {
        let value = inputs[idx].value
        for (let j = 0; j < inputs.length; j++) {
            if (idx != j) {
                inputs[j].value = value
            }
        }
    }

    copyValue(0)
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('input', () => copyValue(i))
    }
}
