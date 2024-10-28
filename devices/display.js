import * as $dom from '../lib/dom.js'
import * as $ram from './ram.js'

const scrWidth = 256
const scrHeight = 224

export const imports = {
    refresh,
    setPalette,
    fillRect,
    blit,
    blit1bpp,
}

/** @type {CanvasRenderingContext2D} */
let ctx
/** @type {ImageData} */
let imageData

// https://en.wikipedia.org/wiki/Color_Graphics_Adapter#Color_palette
let paletteR = Uint8Array.from([
    0x00, 0x00, 0x00, 0x00, 0xAA, 0xAA, 0xAA, 0xAA,
    0x55, 0x55, 0x55, 0x55, 0xFF, 0xFF, 0xFF, 0xFF,
])
let paletteG = Uint8Array.from([ //     brown
    0x00, 0x00, 0xAA, 0xAA, 0x00, 0x00, 0x55, 0xAA,
    0x55, 0x55, 0xFF, 0xFF, 0x55, 0x55, 0xFF, 0xFF,
])
let paletteB = Uint8Array.from([
    0x00, 0xAA, 0x00, 0xAA, 0x00, 0xAA, 0x00, 0xAA,
    0x55, 0xFF, 0x55, 0xFF, 0x55, 0xFF, 0x55, 0xFF,
])

/**
 * @param {HTMLElement} parent
 */
export function init(parent) {
    let canvas = $dom.create('canvas', {width: scrWidth, height: scrHeight}, parent)
    canvas.style.imageRendering = 'pixelated'
    canvas.style.width = (scrWidth * 2) + 'px'
    canvas.style.height = (scrHeight * 2) + 'px'
    ctx = canvas.getContext('2d')
    imageData = ctx.createImageData(scrWidth, scrHeight)

    fillScreen(0)
    refresh()
}

export function refresh() {
    ctx.putImageData(imageData, 0, 0)
}

/**
 * @param {number} ptr
 */
function setPalette(ptr) {
    paletteR = $ram.u8Array.slice(ptr, ptr + 16)
    paletteG = $ram.u8Array.slice(ptr + 16, ptr + 32)
    paletteB = $ram.u8Array.slice(ptr + 32, ptr + 48)
    fillScreen(0)
}

/**
 * @param {number} colIdx
 */
function fillScreen(colIdx) {
    let r = paletteR[colIdx], g = paletteG[colIdx], b = paletteB[colIdx]

    for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i + 0] = r
        imageData.data[i + 1] = g
        imageData.data[i + 2] = b
        imageData.data[i + 3] = 255
    }
}

/**
 * @param {number} xMin
 * @param {number} yMin
 * @param {number} width
 * @param {number} height
 * @param {number} colIdx
 */
function fillRect(xMin, yMin, width, height, colIdx) {
    let r = paletteR[colIdx], g = paletteG[colIdx], b = paletteB[colIdx]

    let xMax = xMin + width
    let yMax = yMin + height
    for (let y = yMin; y < yMax; y++) {
        for (let x = xMin; x < xMax; x++) {
            let i = (y * scrWidth + x) * 4
            imageData.data[i + 0] = r
            imageData.data[i + 1] = g
            imageData.data[i + 2] = b
        }
    }
}

/**
 * @param {number} ptr Pointer to 4bpp image data
 * @param {number} xMin Target x position (pixels)
 * @param {number} yMin Target y position (pixels)
 * @param {number} width Image width (pixels)
 * @param {number} height Image height (pixels)
 * @param {number} stride Image stride (bytes, 0 = use width)
 */
function blit(ptr, xMin, yMin, width, height, stride) {
    if (stride == 0) {
        stride = Math.ceil(width / 2)
    }

    let yMax = yMin + height
    for (let y = yMin; y < yMax; y++, ptr += stride) {
        for (let pX = 0; pX < width; pX++) {
            let pixel = $ram.u8Array[ptr + ((pX / 2) | 0)]
            pixel = (pX % 2 == 0) ? (pixel >> 4) : (pixel & 0xf)
            if (pixel) {
                let r = paletteR[pixel], g = paletteG[pixel], b = paletteB[pixel]
                let i = (y * scrWidth + xMin + pX) * 4
                imageData.data[i + 0] = r
                imageData.data[i + 1] = g
                imageData.data[i + 2] = b
            }
        }
    }
}

/**
 * @param {number} ptr Pointer to 4bpp image data
 * @param {number} xMin Target x position (pixels)
 * @param {number} yMin Target y position (pixels)
 * @param {number} width Image width (pixels)
 * @param {number} height Image height (pixels)
 * @param {number} stride Image stride (bytes, 0 = use width)
 * @param {number} colIdx Color index
 */
function blit1bpp(ptr, xMin, yMin, width, height, stride, colIdx) {
    if (stride == 0) {
        stride = Math.ceil(width / 8)
    }
    let r = paletteR[colIdx], g = paletteG[colIdx], b = paletteB[colIdx]

    let yMax = yMin + height
    for (let y = yMin; y < yMax; y++, ptr += stride) {
        for (let pX = 0; pX < width; pX++) {
            let pixel = $ram.u8Array[ptr + ((pX / 8) | 0)]
            pixel = (pixel >> (7 - (pX % 8))) & 1
            if (pixel) {
                let i = (y * scrWidth + xMin + pX) * 4
                imageData.data[i + 0] = r
                imageData.data[i + 1] = g
                imageData.data[i + 2] = b
            }
        }
    }
}
