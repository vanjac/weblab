/**
 * Write a (Z-up, right-handed) perspective matrix with infinite far plane.
 * @param {number} fovy
 * @param {number} aspect
 * @param {number} near
 * @param {Float32Array} out
 * @returns {Float32Array}
 */
export function perspective(fovy, aspect, near, out = new Float32Array(16)) {
	// https://developer.nvidia.com/content/depth-precision-visualized
	let fy = 1.0 / Math.tan(fovy / 2)
	let fx = fy / aspect

	out[0] = fx; out[4] = 0; out[8] = 0;  out[12] = 0
	out[1] = 0;  out[5] = 0; out[9] = fy; out[13] = 0
	out[2] = 0;  out[6] = 1; out[10] = 0; out[14] = -2 * near
	out[3] = 0;  out[7] = 1; out[11] = 0; out[15] = 0
	return out
}
