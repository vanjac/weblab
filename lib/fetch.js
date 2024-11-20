/**
 * @template T
 * @param {(value: Response) => Promise<T>} requestPromise
 * @returns {(input: RequestInfo | URL, init?: RequestInit) => Promise<T>}
 */
function fetchFunc(requestPromise) {
	return (input, init) => fetch(input, init).then(requestPromise)
}

export const blob = fetchFunc(r => r.blob())
export const text = fetchFunc(r => r.text())
export const json = fetchFunc(r => r.json())
export const arrayBuffer = fetchFunc(r => r.arrayBuffer())

/**
 * @param {RequestInfo | URL} input
 * @param {RequestInit} [init]
 * @param {ImageBitmapOptions} [options]
 */
export function imageBitmap(input, init, options) {
	return fetch(input, init).then(r => r.blob()).then(b => window.createImageBitmap(b, options))
}
