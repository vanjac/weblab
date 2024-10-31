// Date: 2024-10-20

import * as $dom from '../lib/dom.js'
import * as $async from '../lib/async.js'
import * as $math from '../lib/math.js'

const width = 768
const height = 768

export const c = {
    xScroll: -.04,
    yScroll: -.03,
    bgCol: '#d03',
    bgAlpha: .05,
    sqSpin: .0002,
    sqScale: .5,
    sqAlpha: .5,
    hueRot: -15,
}

async function main() {
    let canvas = $dom.create('canvas', {width, height}, document.body)
    let ctx = canvas.getContext('2d')

    let bgCanvas = $dom.create('canvas', {width, height})
    let bgCtx = bgCanvas.getContext('2d')

    while (true) {
        let time = await $async.nextFrame()

        ctx.filter = `hue-rotate(${c.hueRot}deg)`
        ctx.globalAlpha = c.bgAlpha
        ctx.fillStyle = c.bgCol
        ctx.fillRect(0, 0, width, height)

        let xOff = time * c.xScroll
        let yOff = time * c.yScroll

        ctx.globalAlpha = c.sqAlpha
        for (let i = 0; i < 2; i++) {
            for (let x = -1; x < 4; x++) {
                for (let y = -1; y < 4; y++) {
                    let trX = width * (.25 + x / 2) + (xOff % (width / 2))
                    let trY = height * (.25 + y / 2) + (yOff % (height / 2))
                    ctx.translate(trX, trY)
                    let checker = x + y
                        + Math.floor(xOff / width * 2) + Math.floor(yOff / width * 2)
                    ctx.rotate(time * c.sqSpin + $math.mod(checker, 2) * Math.PI / 4)
                    ctx.scale(c.sqScale, c.sqScale)
                    ctx.translate(-width/2, -height/2)
                    ctx.drawImage(bgCanvas, 0, 0)
                    ctx.setTransform(1, 0, 0, 1, 0, 0)
                }
            }
        }

        bgCtx.drawImage(canvas, 0, 0)
    }
}

main()
