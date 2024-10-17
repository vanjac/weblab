import * as $dom from './dom.js'

/**
 * @param {Blob} blob
 * @param {string} name
 */
export function download(blob, name = '') {
    let url = URL.createObjectURL(blob)
    let link = $dom.create('a', {href: url, download: name})
    link.click()
    URL.revokeObjectURL(url)
}

/**
 * Must be triggered by user action!
 * @param {string} accept
 * @returns {Promise<File[]>}
 */
export function pickFiles(accept, multiple = false) {
    return new Promise((resolve, reject) => {
        let input = $dom.create('input', {type: 'file', accept, multiple})
        input.addEventListener('change', () => {
            resolve(Array.from(input.files))
        })
        input.addEventListener('cancel', () => {
            reject()
        })
        input.click()
    })
}
