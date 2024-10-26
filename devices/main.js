import * as $fetch from '../lib/fetch.js'
import * as $ram from './ram.js'
import * as $console from './console.js'
import * as $text from './text.js'

const progSizeLimit = 2 ** 16

/** @type {WebAssembly.Imports} */
const importObj = {
    console: $console.imports,
    text: $text.imports,
    ram: $ram.imports,
}

async function main() {
    $text.init(document.body)

    let path = new URLSearchParams(window.location.search).get('file')
    let progBuf = await $fetch.arrayBuffer(path)
    console.log(`Loaded program (size: ${progBuf.byteLength} bytes)`)
    if (progBuf.byteLength >= progSizeLimit) {
        throw Error('Program is too large!')
    }
    let src = await WebAssembly.instantiate(progBuf, importObj)
    // @ts-ignore
    src.instance.exports.main()
}

main()
