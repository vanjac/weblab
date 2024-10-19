import * as $gl from './gl.js'

const glConst = WebGLRenderingContext

/**
 * @param {GLenum} type
 * @param {string} source
 * @returns {(gl: WebGLRenderingContext) => WebGLShader}
 */
function shaderFunc(type, source) {
    return gl => $gl.createShader(gl, source, type)
}

export const basicVert = shaderFunc(glConst.VERTEX_SHADER, `
    attribute vec4 aPosition;
    attribute vec3 aNormal;
    attribute vec4 aColor;
    attribute vec2 aTexCoord0;

    varying vec4 vPosition;
    varying vec3 vNormal;
    varying vec4 vColor;
    varying vec2 vTexCoord0;

    void main() {
        gl_Position = aPosition;
        vPosition = aPosition;
        vNormal = aNormal;
        vColor = aColor;
        vTexCoord0 = aTexCoord0;
    }
`)

export const screenVert = shaderFunc(glConst.VERTEX_SHADER, `
    attribute vec4 aPosition;

    varying vec2 vScreenCoord;

    void main() {
        gl_Position = aPosition;
        vScreenCoord = (aPosition.xy + 1.0) / 2.0;
    }
`)

export const pointVert = shaderFunc(glConst.VERTEX_SHADER, `
    uniform float uPointSize;

    attribute vec4 aPosition;
    attribute vec4 aColor;

    varying vec4 vPosition;
    varying vec4 vColor;

    void main() {
        gl_Position = aPosition;
        gl_PointSize = uPointSize;
        vPosition = aPosition;
        vColor = aColor;
    }
`)

export const colorFrag = shaderFunc(glConst.FRAGMENT_SHADER, `
    precision mediump float;

    varying vec4 vColor;

    void main() {
        gl_FragColor = vColor;
    }
`)
