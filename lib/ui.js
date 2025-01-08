import * as $html from './html.js'

/**
 * @param {object} param0
 * @param {number} [param0.value]
 * @param {number} [param0.min]
 * @param {number} [param0.max]
 * @param {number} [param0.step]
 * @param {number} [param0.rangeMin]
 * @param {number} [param0.rangeMax]
 * @param {boolean} [param0.logScale]
 * @param {(v: number) => void} [param0.callback]
 */
export function rangeSpinner({
	value,
	min = -999999,
	max = 999999,
	step,
	rangeMin = min,
	rangeMax = max,
	logScale = false,
	callback,
} = {}) {
	/** @type {(v: number) => number} */
	let toRange = logScale ? Math.log : (n => n)
	/** @type {(v: number) => number} */
	let fromRange = logScale ? Math.exp : (n => n)

	let range = $html.input({
		type: 'range',
		step: step?.toString() ?? 'any',
	})
	if (rangeMin != null) {
		range.min = toRange(rangeMin).toString()
	}
	if (rangeMax != null) {
		range.max = toRange(rangeMax).toString()
	}
	range.style.flexGrow = '1'

	let num = $html.input({
		type: 'number',
		min: min?.toString() ?? '',
		max: max?.toString() ?? '',
		step: step?.toString() ?? null,
	})

	range.valueAsNumber = toRange(value)
	num.valueAsNumber = value

	range.addEventListener('input', () => {
		let value = fromRange(range.valueAsNumber)
		if (!Number.isNaN(value)) {
			num.valueAsNumber = value
			callback?.(value)
		}
	})
	num.addEventListener('input', () => {
		let value = num.valueAsNumber
		if (!Number.isNaN(value)) {
			range.valueAsNumber = toRange(value)
			callback?.(value)
		}
	})
	return $html.div({style: 'display: flex'}, [range, num])
}
