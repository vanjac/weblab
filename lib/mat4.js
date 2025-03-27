/**
 * Write a (Z-up, right-handed) perspective matrix with infinite far plane.
 * @param {number} fovy
 * @param {number} aspect
 * @param {number} near
 */
export function perspective(fovy, aspect, near) {
	// https://developer.nvidia.com/content/depth-precision-visualized
	let fy = 1.0 / Math.tan(fovy / 2) // Eg. 1
	let fx = fy / aspect

	return DOMMatrix.fromMatrix(
		{m11: fx, m22: 0, m23: 1, m24: 1, m32: fy, m33: 0, m43: -2 * near, m44: 0}
	)
}
