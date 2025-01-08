import * as $html from '../lib/html.js'

/**
 * @param {string} css
 */
export function addCss(css) {
	return document.head.appendChild($html.style({}, [css]))
}
