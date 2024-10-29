import * as $async from '../lib/async.js'
import * as $dom from '../lib/dom.js'
import * as $canvas from '../lib/canvas.js'

const width = 256
const height = 256

export const c = {
    spreadRatio: .7,
    fillRate: 10,
}

let materials = new Float32Array(width * (height + 1))
let densities = new Float32Array(width * (height + 1))
materials[idx(width/2, height/2)] = 1
densities.fill(1)
densities[idx(width/2, height/2)] = 10000

/**
 * @param {number} x
 * @param {number} y
 */
function idx(x, y) {
    return (x | 0) + (y | 0) * width
}

async function main() {
    let canvas = $dom.create('canvas', {width, height}, document.body)
    canvas.style.imageRendering = 'pixelated'
    canvas.style.width = (width * 3) + 'px'
    canvas.style.height = (height * 3) + 'px'
    let ctx = canvas.getContext('2d')
    let imageData = ctx.createImageData(width, height)

    /** @type {PointerEvent} */
    let mouseEv
    canvas.addEventListener('pointerdown', e => {
        canvas.setPointerCapture(e.pointerId)
        mouseEv = e
    })
    canvas.addEventListener('pointermove', e => {
        if (mouseEv) {
            mouseEv = e
        }
    })
    document.body.addEventListener('pointerup', e => {
        canvas.releasePointerCapture(e.pointerId)
        mouseEv = null
    })

    while (true) {
        await $async.nextFrame()

        if (mouseEv) {
            let [mx, my] = $canvas.mousePos(canvas, mouseEv)
            if (mx >= 0 && mx < width && my >= 0 && my < height) {
                let ix = idx(mx, my)
                let mat = 1
                if (materials[ix] != mat) {
                    materials[ix] = mat
                    densities[ix] = 0
                }
                densities[ix] += c.fillRate
            }
        }

        let xOff = (Math.random() * 2) | 0
        let yOff = (Math.random() * 2) | 0
        for (let y = yOff; y < height; y += 2) {
            for (let x = xOff; x < width; x += 2) {
                switch ((Math.random() * 4) | 0) {
                    case 0:
                        evalNeighbors(idx(x, y), idx(x + 1, y), idx(x, y + 1), idx(x + 1, y + 1))
                        break
                    case 1:
                        evalNeighbors(idx(x + 1, y), idx(x, y + 1), idx(x + 1, y + 1), idx(x, y))
                        break
                    case 2:
                        evalNeighbors(idx(x, y + 1), idx(x + 1, y + 1), idx(x, y), idx(x + 1, y))
                        break
                    default:
                        evalNeighbors(idx(x + 1, y + 1), idx(x, y), idx(x + 1, y), idx(x, y + 1))
                        break
                }
            }
        }

        for (let i = 0; i < materials.length; i++) {
            let mat = materials[i]
            let den = densities[i]
            let idx = i * 4
            imageData.data[idx + 0] = mat * 255
            imageData.data[idx + 1] = 0
            imageData.data[idx + 2] = den * 100
            imageData.data[idx + 3] = 255
        }
        ctx.putImageData(imageData, 0, 0)
    }
}

/**
 * @param {number} idx00
 * @param {number} idx01
 * @param {number} idx10
 * @param {number} idx11
 */
function evalNeighbors(idx00, idx01, idx10, idx11) {
    let m00 = materials[idx00]
    let m01 = materials[idx01]
    let m10 = materials[idx10]
    let m11 = materials[idx11]

    if (m00 == m01 && m01 == m10 && m10 == m11) {
        evalFour(idx00, idx01, idx10, idx11)
    } else if (m00 == m01 && m10 == m11) {
        evalTwoAndTwo(idx00, idx01, idx10, idx11, m00, m10)
    } else if (m00 == m10 && m01 == m11) {
        evalTwoAndTwo(idx00, idx10, idx01, idx11, m00, m01)
    } else if (m00 == m11 && m01 == m10) {
        evalTwoAndTwo(idx00, idx11, idx01, idx10, m00, m01)
    } else if (m00 == m01 && m01 == m10) {
        evalThreeAndOne(idx00, idx01, idx10, idx11, m11)
    } else if (m00 == m01 && m01 == m11) {
        evalThreeAndOne(idx00, idx01, idx11, idx10, m10)
    } else if (m00 == m10 && m10 == m11) {
        evalThreeAndOne(idx00, idx10, idx11, idx01, m01)
    } else if (m01 == m10 && m10 == m11) {
        evalThreeAndOne(idx01, idx10, idx11, idx00, m00)
    } else {
        console.log('help???')
    }
}

/**
 * @param {number} idxA1
 * @param {number} idxA2
 * @param {number} idxA3
 * @param {number} idxA4
 */
function evalFour(idxA1, idxA2, idxA3, idxA4) {
    let sum = densities[idxA1] + densities[idxA2] + densities[idxA3] + densities[idxA4]
    sum /= 4
    densities[idxA1] = sum
    densities[idxA2] = sum
    densities[idxA3] = sum
    densities[idxA4] = sum
}

/**
 * @param {number} idxA1 kitty corner
 * @param {number} idxA2
 * @param {number} idxA3
 * @param {number} idxB1
 * @param {number} matB
 */
function evalThreeAndOne(idxA1, idxA2, idxA3, idxB1, matB) {
    let sumA = densities[idxA1] + densities[idxA2] + densities[idxA3]
    let sumB = densities[idxB1]
    if (sumB / c.spreadRatio > sumA) {
        materials[idxA2] = matB
        materials[idxA3] = matB
        sumB /= 3
        densities[idxA1] = sumA
        densities[idxA2] = sumB
        densities[idxA3] = sumB
        densities[idxB1] = sumB
    } else if (sumB * c.spreadRatio > sumA) {
        materials[idxA3] = matB
        sumA /= 2
        sumB /= 2
        densities[idxA1] = sumA
        densities[idxA2] = sumA
        densities[idxA3] = sumB
        densities[idxB1] = sumB
    } else {
        sumA /= 3
        densities[idxA1] = sumA
        densities[idxA2] = sumA
        densities[idxA3] = sumA
    }
}

/**
 * @param {number} idxA1
 * @param {number} idxA2
 * @param {number} idxB1
 * @param {number} idxB2
 * @param {number} matA
 * @param {number} matB
 */
function evalTwoAndTwo(idxA1, idxA2, idxB1, idxB2, matA, matB) {
    let sumA = densities[idxA1] + densities[idxA2]
    let sumB = densities[idxB1] + densities[idxB2]
    if (sumB / c.spreadRatio > sumA) {
        materials[idxA2] = matB
        sumB /= 3
        densities[idxA1] = sumA
        densities[idxA2] = sumB
        densities[idxB1] = sumB
        densities[idxB2] = sumB
    } else if (sumB * c.spreadRatio > sumA) {
        sumA /= 2
        sumB /= 2
        densities[idxA1] = sumA
        densities[idxA2] = sumA
        densities[idxB1] = sumB
        densities[idxB2] = sumB
    } else {
        materials[idxB1] = matA
        sumA /= 3
        densities[idxA1] = sumA
        densities[idxA2] = sumA
        densities[idxB1] = sumA
        densities[idxB2] = sumB
    }
}

main()