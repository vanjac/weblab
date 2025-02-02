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

export const a = createFn('a')
export const abbr = createFn('abbr')
export const address = createFn('address')
export const area = createFn('area')
export const article = createFn('article')
export const aside = createFn('aside')
export const audio = createFn('audio')
export const b = createFn('b')
export const base = createFn('base')
export const bdi = createFn('bdi')
export const bdo = createFn('bdo')
export const blockquote = createFn('blockquote')
export const body = createFn('body')
export const br = createFn('br')
export const button = createFn('button')
export const canvas = createFn('canvas')
export const caption = createFn('caption')
export const cite = createFn('cite')
export const code = createFn('code')
export const col = createFn('col')
export const colgroup = createFn('colgroup')
export const data = createFn('data')
export const datalist = createFn('datalist')
export const dd = createFn('dd')
export const del = createFn('del')
export const details = createFn('details')
export const dfn = createFn('dfn')
export const dialog = createFn('dialog')
export const div = createFn('div')
export const dl = createFn('dl')
export const dt = createFn('dt')
export const em = createFn('em')
export const embed = createFn('embed')
export const fieldset = createFn('fieldset')
export const figcaption = createFn('figcaption')
export const figure = createFn('figure')
export const footer = createFn('footer')
export const form = createFn('form')
export const h1 = createFn('h1')
export const h2 = createFn('h2')
export const h3 = createFn('h3')
export const h4 = createFn('h4')
export const h5 = createFn('h5')
export const h6 = createFn('h6')
export const head = createFn('head')
export const header = createFn('header')
export const hgroup = createFn('hgroup')
export const hr = createFn('hr')
export const html = createFn('html')
export const i = createFn('i')
export const iframe = createFn('iframe')
export const img = createFn('img')
export const input = createFn('input')
export const ins = createFn('ins')
export const kbd = createFn('kbd')
export const label = createFn('label')
export const legend = createFn('legend')
export const li = createFn('li')
export const link = createFn('link')
export const main = createFn('main')
export const map = createFn('map')
export const mark = createFn('mark')
export const menu = createFn('menu')
export const meta = createFn('meta')
export const meter = createFn('meter')
export const nav = createFn('nav')
export const noscript = createFn('noscript')
export const object = createFn('object')
export const ol = createFn('ol')
export const optgroup = createFn('optgroup')
export const option = createFn('option')
export const output = createFn('output')
export const p = createFn('p')
export const picture = createFn('picture')
export const pre = createFn('pre')
export const progress = createFn('progress')
export const q = createFn('q')
export const rp = createFn('rp')
export const rt = createFn('rt')
export const ruby = createFn('ruby')
export const s = createFn('s')
export const samp = createFn('samp')
export const script = createFn('script')
export const search = createFn('search')
export const section = createFn('section')
export const select = createFn('select')
export const slot = createFn('slot')
export const small = createFn('small')
export const source = createFn('source')
export const span = createFn('span')
export const strong = createFn('strong')
export const style = createFn('style')
export const sub = createFn('sub')
export const summary = createFn('summary')
export const sup = createFn('sup')
export const table = createFn('table')
export const tbody = createFn('tbody')
export const td = createFn('td')
export const template = createFn('template')
export const textarea = createFn('textarea')
export const tfoot = createFn('tfoot')
export const th = createFn('th')
export const thead = createFn('thead')
export const time = createFn('time')
export const title = createFn('title')
export const tr = createFn('tr')
export const track = createFn('track')
export const u = createFn('u')
export const ul = createFn('ul')
export const var_ = createFn('var')
export const video = createFn('video')
export const wbr = createFn('wbr')
