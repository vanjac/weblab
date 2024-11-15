// Date: 2024-11-14

import * as $async from '../lib/async.js'
import * as $dom from '../lib/dom.js'
import * as $gl from '../lib/gl.js'
import * as $glShader from '../lib/glShader.js'
import * as $mat4 from '../lib/mat4.js'
import * as $math from '../lib/math.js'
import * as $colArr from '../lib/colArr.js'
import * as $fetch from '../lib/fetch.js'

const width = 1024
const height = 768

export const c = {
    modelMat: $mat4.translate($mat4.ident, [0, 0, -1]),
    texMat: Float32Array.of(1, 0, 0, 0, 1, 0, 0, 0, 1),
    world: true,
    rotateSpeed: 1.5,
    viewDist: 3,
}

async function main() {
    let canvas = $dom.create('canvas', {width, height}, document.body)

    let modelMatDiv = $dom.create('div', {style: 'display: inline-block;'}, document.body)
    for (let row = 0; row < 4; row++) {
        let div = $dom.create('div', {}, modelMatDiv)
        for (let col = 0; col < 4; col++) {
            let idx = row + col * 4
            let input = $dom.create(
                'input', {type: 'number', min: '-99', max: '99', step: '.1'}, div)
            input.valueAsNumber = c.modelMat[idx]
            if (col == 2) {
                input.disabled = true
            } else {
                input.oninput = () => c.modelMat[idx] = input.valueAsNumber
            }
        }
    }

    $dom.create('span', {style: 'display: inline-block; width: 20pt'}, document.body)

    let texMatDiv = $dom.create('div', {style: 'display: inline-block'}, document.body)
    for (let row = 0; row < 3; row++) {
        let div = $dom.create('div', {}, texMatDiv)
        for (let col = 0; col < 3; col++) {
            let idx = row + col * 3
            let input = $dom.create(
                'input', {type: 'number', min: '-99', max: '99', step: '.1'}, div)
            input.valueAsNumber = c.texMat[idx]
            input.oninput = () => c.texMat[idx] = input.valueAsNumber
        }
    }

    let worldCheck = $dom.create('input', {type: 'checkbox', checked: c.world}, document.body)
    worldCheck.oninput = () => c.world = worldCheck.checked

    let gl = canvas.getContext('webgl2')
    gl.enable(gl.DEPTH_TEST)
    let glAniso = gl.getExtension('EXT_texture_filter_anisotropic')

    let prog = $gl.createProgram(gl, [
        $glShader.basicVert(gl, {transform: true, texMat: true}),
        $glShader.basicFrag(gl, {texture: true}),
    ])

    gl.useProgram(prog.program)

    let proj = $mat4.perspective($math.radians(90), width/height, 0.03)

    let planeVao = $gl.createScreenRectVAO(gl)

    let img = await $fetch.imageBitmap(import.meta.resolve('./five.png'))
    $gl.createTexture(gl, img)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
    let anisotropy = gl.getParameter(glAniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT)
    gl.texParameterf(gl.TEXTURE_2D, glAniso.TEXTURE_MAX_ANISOTROPY_EXT, anisotropy)
    gl.generateMipmap(gl.TEXTURE_2D)

    gl.clearColor(...$colArr.rgba(127, 127, 127, 1))
    gl.vertexAttrib4fv($gl.boundAttr.aColor, $colArr.rgba(255, 255, 255, 1))

    while (true) {
        let time = await $async.frame()
        $gl.checkError(gl)

        gl.uniformMatrix4fv(prog.uniforms.uModelMat, false, c.modelMat)
        gl.uniformMatrix3fv(prog.uniforms.uTexMat0, false, c.texMat)
        if (c.world) {
            gl.uniformMatrix4fv(prog.uniforms.uProjMat, false, proj)
            let viewMat = $mat4.ident
            viewMat = $mat4.translate(viewMat, [0, c.viewDist, 0])
            viewMat = $mat4.rotate(viewMat, time / 1000 * c.rotateSpeed, [0, 0, 1])
            gl.uniformMatrix4fv(prog.uniforms.uViewMat, false, viewMat)
        } else {
            gl.uniformMatrix4fv(prog.uniforms.uProjMat, false, $mat4.ident)
            gl.uniformMatrix4fv(prog.uniforms.uViewMat, false, $mat4.ident)

        }

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        gl.bindVertexArray(planeVao)
        gl.drawArrays(gl.TRIANGLES, 0, 6)
        gl.bindVertexArray(null)
    }
}

main()
