/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} tag
 * @returns {(
 *		attributes?: Partial<HTMLElementTagNameMap[K]> | {style?: string},
 *		children?: (Node | string)[],
 * ) => HTMLElementTagNameMap[K]}
 */
function createFn(tag) {
	return (attributes, children) => {
		let elem = document.createElement(tag)
		Object.assign(elem, attributes)
		if (children) {
			elem.append(...children)
		}
		return elem
	}
}

export const button = createFn('button')
export const canvas = createFn('canvas')
export const input = createFn('input')
export const span = createFn('span')
