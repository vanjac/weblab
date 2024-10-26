precision mediump float;
varying vec2 vTexCoord0;
uniform sampler2D sLeft;
uniform sampler2D sRight;

void main() {
    float l = texture2D(sLeft, vTexCoord0).r;
    float r = texture2D(sRight, vTexCoord0).r;
    gl_FragColor = vec4(r, (l + r) / 2.0, l, 1.0);
}
