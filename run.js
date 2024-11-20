export default null
let path = new URLSearchParams(window.location.search).get('load')
if (path) {
	import(`./${path}.js`).then(m => {
		// @ts-ignore
		window.mod = m
	}).catch(e => document.body.append(String(e)))
}
