import * as $dom from '../lib/dom.js'
import * as $gl from '../lib/gl.js'
import * as $glShader from '../lib/glShader.js'
import * as $async from '../lib/async.js'
import * as $canvas from '../lib/canvas.js'

const width = 1024
const height = 1024

function initialPattern() {
    let canvas = $dom.create('canvas', {width, height})
    let ctx = canvas.getContext('2d')
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = 'red'
    ctx.lineWidth = 3
    ctx.fill($canvas.circle(width/2, height/2, 1))
    return canvas
}

async function main() {
    let canvas = $dom.create('canvas', {width, height}, document.body)
    canvas.style.imageRendering = 'pixelated'
    let gl = $gl.init(canvas)

    let screenVao = $gl.createScreenRectVAO(gl)
    let shaderSrc = await fetch(import.meta.resolve('./starwars.frag')).then(r => r.text())
    let prog = $gl.createProgram(gl, [
        $gl.createShader(gl, shaderSrc),
        $glShader.basicVert(gl),
    ])

    $gl.createTexture(gl, initialPattern())
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)

    while (true) {
        await $async.nextFrame()
        $gl.checkError(gl)
        gl.useProgram(prog.program)
        gl.bindVertexArray(screenVao)
        gl.drawArrays(gl.TRIANGLES, 0, 6)
        gl.bindVertexArray(null)

        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, canvas)
    }
}
main()
