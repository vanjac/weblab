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
