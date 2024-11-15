import * as $gl from './gl.js'

const glConst = WebGLRenderingContext

/**
 * @template {Record<string, boolean>} [O={}]
 * @param {GLenum} type
 * @param {O} defaultOptions
 * @param {string} source
 * @returns {(gl: WebGLRenderingContext, options?: {[P in keyof O]?: boolean}) => WebGLShader}
 */
function shaderFunc(type, defaultOptions, source) {
    return (gl, options = {}) => {
        let defines = ''
        let combined = Object.assign({}, defaultOptions, options)
        for (let [key, value] of Object.entries(combined)) {
            if (value) {
                defines += '#define OPTION_' + key + '\n'
            }
        }
        return $gl.createShader(gl, defines + source, type)
    }
}

export const basicVert = shaderFunc(glConst.VERTEX_SHADER, {
    transform: false,
    texMat: false,
    pointSize: false,
},`
#ifdef OPTION_transform
    uniform mat4 uModelMat;
    uniform mat4 uViewMat;
    uniform mat4 uProjMat;
#endif
#ifdef OPTION_texMat
    uniform mat3 uTexMat0;
#endif
#ifdef OPTION_pointSize
    uniform float uPointSize;
#endif

    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec4 aColor;
    attribute vec2 aTexCoord0;

    varying vec4 vPosition;
    varying vec3 vNormal;
    varying vec4 vColor;
    varying vec3 vTexCoord0;

    void main() {
        vPosition = vec4(aPosition, 1);
#ifdef OPTION_transform
        vPosition = uModelMat * vPosition;
#endif
        vNormal = aNormal;
        vColor = aColor;
        vTexCoord0 = vec3(aTexCoord0, 1);
#ifdef OPTION_texMat
        vTexCoord0 = uTexMat0 * vTexCoord0;
#endif
        gl_Position = vPosition;
#ifdef OPTION_transform
        gl_Position = uProjMat * uViewMat * gl_Position;
#endif
#ifdef OPTION_pointSize
        gl_PointSize = uPointSize;
#endif
    }
`)

export const basicFrag = shaderFunc(glConst.FRAGMENT_SHADER, {
    texture: false,
}, `
    precision mediump float;

    varying vec4 vColor;

#ifdef OPTION_texture
    uniform sampler2D sColor;
    varying vec3 vTexCoord0;
#endif

    void main() {
        vec4 color = vColor;
#ifdef OPTION_texture
        vec2 uv = vTexCoord0.st / vTexCoord0.p;
        color *= texture2D(sColor, uv);
#endif
        gl_FragColor = color;
    }
`)
