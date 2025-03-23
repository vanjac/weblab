/** @typedef {Float32Array} Mat4 */

export function create() {
	return new Float32Array(16)
}

/**
 * @type {Mat4}
 */
export const ident = Float32Array.of(
	1, 0, 0, 0,
	0, 1, 0, 0,
	0, 0, 1, 0,
	0, 0, 0, 1,
)

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
