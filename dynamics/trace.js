// Date: 2024-10-30

import * as $dom from '../lib/dom.js'
import * as $async from '../lib/async.js'
import * as $input from '../lib/input.js'
import * as $canvas from '../lib/canvas.js'
import * as $vec from '../lib/vec.js'

const width = 512
const height = 512

export const c = {
    bgCol: 'black',
    traceColLight: 60,
    traceHueRate: .01,
    traceWidth: 4,
    tail: 1,
    fadeAlpha: 0.04,
    velRate: 0.5,
    accelRate: 0.05,
    repelRate: 0.8,
    feedbackScale: 1.005,
    feedbackBlur: 1,
    feedbackHue: 5,
    feedbackBright: 103,
    feedbackSat: 101,
}

/**
 * @typedef {{
 *      x: number
 *      y: number
 *      velX: number
 *      velY: number
 * }} Trace
 */

/** @type {Trace[]} */
let traces = [
    {x: 0, y: 0, velX: 0, velY: 0},
    {x: width, y: 0, velX: 0, velY: 0},
    {x: width, y: height, velX: 0, velY: 0},
]

async function main() {
    let canvas = $dom.create('canvas', {width, height}, document.body)
    let ctx = canvas.getContext('2d')

    ctx.fillStyle = c.bgCol
    ctx.fillRect(0, 0, width, height)

    while (true) {
        let time = await $async.nextFrame()
        let mouseDown = $input.mouse.buttons & 1

        let filter = `brightness(${c.feedbackBright}%) saturate(${c.feedbackSat}%)`
        filter += ` blur(${c.feedbackBlur}px) hue-rotate(${c.feedbackHue}deg)`
        ctx.filter = filter
        ctx.translate(width / 2, height / 2)
        ctx.scale(c.feedbackScale, c.feedbackScale)
        ctx.translate(-width / 2, -height / 2)
        ctx.drawImage(canvas, 0, 0)
        ctx.filter = ''
        ctx.resetTransform()

        ctx.globalAlpha = mouseDown ? c.fadeAlpha * 2 : c.fadeAlpha
        ctx.fillStyle = c.bgCol
        ctx.fillRect(0, 0, width, height)

        ctx.globalAlpha = 1

        let [mouseX, mouseY] = $canvas.mousePos(canvas, $input.mouse)
        let traceI = 0
        for (let trace of traces) {
            let ptraceX = trace.x, ptraceY = trace.y

            let tarVelX = (mouseX - trace.x) * (mouseDown ? 1 : c.velRate)
            let tarVelY = (mouseY - trace.y) * (mouseDown ? 1 : c.velRate)
            for (let other of traces) {
                if (other != trace) {
                    let [dx, dy] = $vec.normalize([trace.x - other.x, trace.y - other.y])
                    ;[dx, dy] = $vec.mul([dx, dy], $vec.mag([trace.velX, trace.velY]))
                    tarVelX += dx * c.repelRate
                    tarVelY += dy * c.repelRate
                }
            }
            trace.velX += (tarVelX - trace.velX) * c.accelRate
            trace.velY += (tarVelY - trace.velY) * c.accelRate

            trace.x += trace.velX
            trace.y += trace.velY

            ctx.strokeStyle = `hsl(${time * c.traceHueRate + traceI * 60} 100% ${c.traceColLight}%)`
            ctx.lineWidth = c.traceWidth
            ctx.beginPath()
            ctx.moveTo(ptraceX + (ptraceX - trace.x) * c.tail, ptraceY + (ptraceY - trace.y) * c.tail)
            ctx.lineTo(trace.x, trace.y)
            ctx.stroke()
            traceI++
        }
    }
}

main()
