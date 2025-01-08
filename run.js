export default null
let path = new URLSearchParams(window.location.search).get('load')
if (path) {
	import(`./${path}.js`).catch(e => document.body.append(String(e)))
}
