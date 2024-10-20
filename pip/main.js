import * as $dom from '../lib/dom.js'
import * as $async from '../lib/async.js'

const width = 768
const height = 768

async function main() {
    let canvas = $dom.create('canvas', {width, height}, document.body)
    let ctx = canvas.getContext('2d')

    let bgCanvas = $dom.create('canvas', {width, height})
    let bgCtx = bgCanvas.getContext('2d')


    ctx.filter = 'hue-rotate(-30deg)'
    while (true) {
        let time = await $async.nextFrame()

        ctx.fillStyle = `hsl(${0} 100 50)`
        ctx.fillRect(0, 0, width, height)

        ctx.globalAlpha = 0.5
        for (let i = 0; i < 2; i++) {
            for (let x = 0; x < 2; x++) {
                for (let y = 0; y < 2; y++) {
                    ctx.translate(width * (.25 + x / 2), height * (.25 + y / 2))
                    ctx.rotate(time * .0003)
                    ctx.scale(0.6, 0.6)
                    ctx.translate(-width/2, -height/2)
                    ctx.drawImage(bgCanvas, 0, 0)
                    ctx.setTransform(1, 0, 0, 1, 0, 0)
                }
            }
        }
        ctx.globalAlpha = 1

        bgCtx.drawImage(canvas, 0, 0)
    }
}

main()
