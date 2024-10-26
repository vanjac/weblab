import * as $dom from '../lib/dom.js'
import * as $gl from '../lib/gl.js'
import * as $glShader from '../lib/glShader.js'
import * as $async from '../lib/async.js'
import * as $fetch from '../lib/fetch.js'

const width = 768
const height = 768

function initialPattern() {
    let canvas = $dom.create('canvas', {width, height})
    let ctx = canvas.getContext('2d')
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = 'red'
    ctx.fillRect(width/2 - 1, height/2 - 1, 2, 2)
    // ctx.fillRect(width/2 + 1, height/2 - 1, 1, 1)
    return canvas
}

async function main() {
    let canvas = $dom.create('canvas', {width, height}, document.body)
    canvas.style.imageRendering = 'pixelated'
    let gl = canvas.getContext('webgl2')

    let screenVao = $gl.createScreenRectVAO(gl)
    let shaderSrc = await $fetch.text(import.meta.resolve('./starwars.frag'))
    let prog = $gl.createProgram(gl, [
        $gl.createShader(gl, shaderSrc),
        $glShader.basicVert(gl),
    ])

    $gl.createTexture(gl, initialPattern())
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

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
