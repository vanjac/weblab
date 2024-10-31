// Date: 2024-10-25

import * as $dom from '../lib/dom.js'
import * as $gl from '../lib/gl.js'
import * as $glShader from '../lib/glShader.js'
import * as $fetch from '../lib/fetch.js'
import * as $async from '../lib/async.js'
import * as $array from '../lib/array.js'

const width = 512
const height = 512

const texWidth = 32
const texHeight = 64
const sampleSize = texWidth * texHeight

const numChannels = 2

async function main() {
    let input = $dom.create('input', {type: 'file', accept: 'audio/*'}, document.body)

    let src = new URLSearchParams(window.location.search).get('file')
    let audio = $dom.create('audio', {controls: true, src}, document.body)
    audio.style.display = 'block'
    audio.style.width = '100%'

    input.addEventListener('change', () => {
        audio.src = URL.createObjectURL(input.files[0])
    })

    let canvas = $dom.create('canvas', {width, height}, document.body)
    let gl = canvas.getContext('webgl2')

    let screenVao = $gl.createScreenRectVAO(gl)
    let shaderSrc = await $fetch.text(import.meta.resolve('./scanlines.frag'))
    let prog = $gl.createProgram(gl, [$gl.createShader(gl, shaderSrc), $glShader.basicVert(gl)])

    let audioCtx = new AudioContext()
    let splitter = audioCtx.createChannelSplitter(numChannels)
    let source = audioCtx.createMediaElementSource(audio)
    source.connect(splitter)
    source.connect(audioCtx.destination)
    let analysers = $array.seq(numChannels, c => {
        let analyser = audioCtx.createAnalyser()
        analyser.fftSize = sampleSize
        splitter.connect(analyser, c)
        return analyser
    })

    audio.addEventListener('play', () => {
        audioCtx.resume()
    })

    let dataArrays = $array.seq(numChannels, () => new Uint8Array(sampleSize))
    for (let c = 0; c < numChannels; c++) {
        gl.activeTexture(gl.TEXTURE0 + c)
        $gl.createTexture(gl)
        gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.R8, texWidth, texHeight, 0, gl.RED, gl.UNSIGNED_BYTE, null)
    }

    while (true) {
        await $async.frame()
        $gl.checkError(gl)

        for (let c = 0; c < numChannels; c++) {
            analysers[c].getByteTimeDomainData(dataArrays[c])
        }
        for (let c = 0; c < numChannels; c++) {
            gl.activeTexture(gl.TEXTURE0 + c)
            gl.texSubImage2D(
                gl.TEXTURE_2D, 0, 0, 0, texWidth, texHeight,
                gl.RED, gl.UNSIGNED_BYTE, dataArrays[c])
        }

        gl.useProgram(prog.program)
        gl.bindVertexArray(screenVao)
        gl.drawArrays(gl.TRIANGLES, 0, 6)
        gl.bindVertexArray(null)
    }
}

main()
