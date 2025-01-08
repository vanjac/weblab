// Based on https://github.com/jamesdiacono/ui.js

/**
 * @template T
 * @typedef {HTMLElement & {
 *		state: T
 * }} Elem
 */

/**
 * @template State
 * @template {unknown[]} ArgType
 * @param {string} tag
 * @param {(elem: HTMLElement, ...args: ArgType) => State} createFn
 * @param {{
 *		connected?: (obj: State, elem: Elem<State>) => void
 *		disconnected?: (obj: State, elem: Elem<State>) => void
 *		adopted?: (obj: State, elem: Elem<State>) => void
 * }} callbacks
 * @returns {(...args: ArgType) => Elem<State>}
 */
export function define(tag, createFn, {connected, disconnected, adopted}) {
	let constructor = /** @type {{ new (...args: ArgType): Elem<State> }} */(
		customElements.get(tag)
	)

	if (!constructor) {
		constructor = class extends HTMLElement {
			/**
			 * @param {ArgType} args
			 */
			constructor(...args) {
				super()
				this.state = createFn(this, ...args)
			}

			connectedCallback() {
				connected?.(this.state, this)
			}

			disconnectedCallback() {
				disconnected?.(this.state, this)
			}

			adoptedCallback() {
				adopted?.(this.state, this)
			}
		}
		customElements.define(tag, constructor)
	}

	return (...args) => new constructor(...args)
}
