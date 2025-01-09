import * as $html from '../lib/html.js'

/**
 * @param {string} css
 */
export function addCss(css) {
	return document.head.appendChild($html.style({}, [css]))
}

/** @template State */
export class Container extends HTMLElement {
	/**
	 * @param {State} [state]
	 * @param {string | Partial<CSSStyleDeclaration>} [classOrStyle]
	 * @param {(Node | string)[]} [children]
	 */
	constructor(state, classOrStyle, children) {
		super()
		this.state = state
		if (typeof classOrStyle == 'string') {
			this.className = classOrStyle
		} else {
			Object.assign(this.style, classOrStyle)
		}
		if (children) {
			this.append(...children)
		}
	}

	connectedCallback() {
		this.dispatchEvent(new CustomEvent('connected', {detail: this.state}))
	}

	disconnectedCallback() {
		this.dispatchEvent(new CustomEvent('disconnected', {detail: this.state}))
	}

	adoptedCallback() {
		this.dispatchEvent(new CustomEvent('adopted', {detail: this.state}))
	}
}
customElements.define('x-container', Container)
