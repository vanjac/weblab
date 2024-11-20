/** @typedef {Float32Array} Mat4 */

const VecType = Float32Array

// Based on code from gl-matrix: https://github.com/toji/gl-matrix
// Copyright (c) 2015-2021, Brandon Jones, Colin MacKenzie IV.

export function create() {
    return new VecType(16)
}

/**
 * @type {Mat4}
 */
export const zero = create()

/**
 * @type {Mat4}
 */
export const ident = VecType.of(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
)

/**
 * @param {Mat4} a
 * @param {Mat4} b
 * @param {Mat4} out
 */
export function mult(a, b, out = create()) {
    let a00 = a[0], a10 = a[4], a20 = a[8],  a30 = a[12]
    let a01 = a[1], a11 = a[5], a21 = a[9],  a31 = a[13]
    let a02 = a[2], a12 = a[6], a22 = a[10], a32 = a[14]
    let a03 = a[3], a13 = a[7], a23 = a[11], a33 = a[15]

    let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3]
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7]
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11]
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15]
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33

    return out
}

/**
 * @param {Mat4} a
 */
export function determinant(a) {
    let a00 = a[0], a10 = a[4], a20 = a[8],  a30 = a[12]
    let a01 = a[1], a11 = a[5], a21 = a[9],  a31 = a[13]
    let a02 = a[2], a12 = a[6], a22 = a[10], a32 = a[14]
    let a03 = a[3], a13 = a[7], a23 = a[11], a33 = a[15]

    let b0 = a00 * a11 - a01 * a10
    let b1 = a00 * a12 - a02 * a10
    let b2 = a01 * a12 - a02 * a11
    let b3 = a20 * a31 - a21 * a30
    let b4 = a20 * a32 - a22 * a30
    let b5 = a21 * a32 - a22 * a31
    let b6 = a00 * b5 - a01 * b4 + a02 * b3
    let b7 = a10 * b5 - a11 * b4 + a12 * b3
    let b8 = a20 * b2 - a21 * b1 + a22 * b0
    let b9 = a30 * b2 - a31 * b1 + a32 * b0

    return a13 * b6 - a03 * b7 + a33 * b8 - a23 * b9
}

/**
 * @param {Mat4} a
 * @param {Mat4} out
 */
export function invert(a, out = create()) {
    let a00 = a[0], a10 = a[4], a20 = a[8],  a30 = a[12]
    let a01 = a[1], a11 = a[5], a21 = a[9],  a31 = a[13]
    let a02 = a[2], a12 = a[6], a22 = a[10], a32 = a[14]
    let a03 = a[3], a13 = a[7], a23 = a[11], a33 = a[15]

    let b00 = a00 * a11 - a01 * a10
    let b01 = a00 * a12 - a02 * a10
    let b02 = a00 * a13 - a03 * a10
    let b03 = a01 * a12 - a02 * a11
    let b04 = a01 * a13 - a03 * a11
    let b05 = a02 * a13 - a03 * a12
    let b06 = a20 * a31 - a21 * a30
    let b07 = a20 * a32 - a22 * a30
    let b08 = a20 * a33 - a23 * a30
    let b09 = a21 * a32 - a22 * a31
    let b10 = a21 * a33 - a23 * a31
    let b11 = a22 * a33 - a23 * a32

    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06
    let idet = det ? 1 / det : det

    out[0]  = (a11 * b11 - a12 * b10 + a13 * b09) * idet
    out[1]  = (a02 * b10 - a01 * b11 - a03 * b09) * idet
    out[2]  = (a31 * b05 - a32 * b04 + a33 * b03) * idet
    out[3]  = (a22 * b04 - a21 * b05 - a23 * b03) * idet
    out[4]  = (a12 * b08 - a10 * b11 - a13 * b07) * idet
    out[5]  = (a00 * b11 - a02 * b08 + a03 * b07) * idet
    out[6]  = (a32 * b02 - a30 * b05 - a33 * b01) * idet
    out[7]  = (a20 * b05 - a22 * b02 + a23 * b01) * idet
    out[8]  = (a10 * b10 - a11 * b08 + a13 * b06) * idet
    out[9]  = (a01 * b08 - a00 * b10 - a03 * b06) * idet
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * idet
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * idet
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * idet
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * idet
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * idet
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * idet

    return out
}

/**
 * @param {Mat4} a
 * @param {Mat4} out
 */
export function transpose(a, out = create()) {
    if (out == a) {
        let a01 = a[1], a02 = a[2], a03 = a[3], a12 = a[6], a13 = a[7], a23 = a[11]

        /*          */  out[4] = a01;   out[8] = a02;   out[12] = a03
        out[1] = a[4];                  out[9] = a12;   out[13] = a13
        out[2] = a[8];  out[6] = a[9];                  out[14] = a23
        out[3] = a[12]; out[7] = a[13]; out[11] = a[14]
    } else {
        out[0] = a[0];  out[4] = a[1];  out[8] = a[2];   out[12] = a[3]
        out[1] = a[4];  out[5] = a[5];  out[9] = a[6];   out[13] = a[7]
        out[2] = a[8];  out[6] = a[9];  out[10] = a[10]; out[14] = a[11]
        out[3] = a[12]; out[7] = a[13]; out[11] = a[14]; out[15] = a[15]
    }
    return out
}

/**
 * @param {Mat4} a
 * @param {[number, number, number]} v
 * @param {Mat4} out
 * @returns {Mat4}
 */
export function translate(a, v, out = create()) {
    let x = v[0], y = v[1], z = v[2]

    let a00 = a[0], a10 = a[4], a20 = a[8]
    let a01 = a[1], a11 = a[5], a21 = a[9]
    let a02 = a[2], a12 = a[6], a22 = a[10]
    let a03 = a[3], a13 = a[7], a23 = a[11]

    if (a != out) {
        out[0] = a00; out[4] = a10; out[8] = a20
        out[1] = a01; out[5] = a11; out[9] = a21
        out[2] = a02; out[6] = a12; out[10] = a22
        out[3] = a03; out[7] = a13; out[11] = a23
    }

    out[12] = a00 * x + a10 * y + a20 * z + a[12]
    out[13] = a01 * x + a11 * y + a21 * z + a[13]
    out[14] = a02 * x + a12 * y + a22 * z + a[14]
    out[15] = a03 * x + a13 * y + a23 * z + a[15]

    return out
}

/**
 * @param {Mat4} a
 * @param {number} angle
 * @param {[number, number, number]} axis
 * @param {Mat4} out
 */
export function rotate(a, angle, axis, out = create()) {
    let x = axis[0], y = axis[1], z = axis[2]
    let iLen = 1 / Math.hypot(x, y, z)
    x *= iLen; y *= iLen; z *= iLen

    let a00 = a[0]; let a10 = a[4]; let a20 = a[8]
    let a01 = a[1]; let a11 = a[5]; let a21 = a[9]
    let a02 = a[2]; let a12 = a[6]; let a22 = a[10]
    let a03 = a[3]; let a13 = a[7]; let a23 = a[11]

    let s = Math.sin(angle)
    let c = Math.cos(angle)
    let t = 1 - c
    let b00 = x * x * t + c,     b10 = x * y * t - z * s, b20 = x * z * t + y * s
    let b01 = y * x * t + z * s, b11 = y * y * t + c,     b21 = y * z * t - x * s
    let b02 = z * x * t - y * s, b12 = z * y * t + x * s, b22 = z * z * t + c

    out[0] = a00 * b00 + a10 * b01 + a20 * b02
    out[1] = a01 * b00 + a11 * b01 + a21 * b02
    out[2] = a02 * b00 + a12 * b01 + a22 * b02
    out[3] = a03 * b00 + a13 * b01 + a23 * b02

    out[4] = a00 * b10 + a10 * b11 + a20 * b12
    out[5] = a01 * b10 + a11 * b11 + a21 * b12
    out[6] = a02 * b10 + a12 * b11 + a22 * b12
    out[7] = a03 * b10 + a13 * b11 + a23 * b12

    out[8] = a00 * b20 + a10 * b21 + a20 * b22
    out[9] = a01 * b20 + a11 * b21 + a21 * b22
    out[10] = a02 * b20 + a12 * b21 + a22 * b22
    out[11] = a03 * b20 + a13 * b21 + a23 * b22

    if (a != out) {
        out[12] = a[12]
        out[13] = a[13]
        out[14] = a[14]
        out[15] = a[15]
    }
    return out
}

/**
 * @param {Mat4} a
 * @param {[number, number, number]} v
 * @param {Mat4} out
 */
export function scale(a, v, out = create()) {
    let x = v[0], y = v[1], z = v[2]

    out[0] = a[0] * x; out[4] = a[4] * y; out[8] = a[8] * z;   out[12] = a[12]
    out[1] = a[1] * x; out[5] = a[5] * y; out[9] = a[9] * z;   out[13] = a[13]
    out[2] = a[2] * x; out[6] = a[6] * y; out[10] = a[10] * z; out[14] = a[14]
    out[3] = a[3] * x; out[7] = a[7] * y; out[11] = a[11] * z; out[15] = a[15]

    return out
}

/**
 * Write a (Z-up, right-handed) perspective matrix with infinite far plane.
 * @param {number} fovy
 * @param {number} aspect
 * @param {number} near
 * @param {Mat4} out
 * @returns {Mat4}
 */
export function perspective(fovy, aspect, near, out = create()) {
    // https://developer.nvidia.com/content/depth-precision-visualized
    let fy = 1.0 / Math.tan(fovy / 2)
    let fx = fy / aspect

    out[0] = fx; out[4] = 0; out[8] = 0;  out[12] = 0
    out[1] = 0;  out[5] = 0; out[9] = fy; out[13] = 0
    out[2] = 0;  out[6] = 1; out[10] = 0; out[14] = -2 * near
    out[3] = 0;  out[7] = 1; out[11] = 0; out[15] = 0
    return out
}

/**
 * @param {Mat4} m
 * @param {number[]} v
 * @returns {[number, number, number, number]}
 */
export function transform(m, v) {
    let x = v[0], y = v[1], z = v[2], w = v[3] ?? 1
    return [
        m[0] * x + m[4] * y + m[8] * z + m[12] * w,
        m[1] * x + m[5] * y + m[9] * z + m[13] * w,
        m[2] * x + m[6] * y + m[10] * z + m[14] * w,
        m[3] * x + m[7] * y + m[11] * z + m[15] * w,
    ]
}
