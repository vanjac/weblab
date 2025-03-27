/**
 * Create a (Z-up, right-handed) perspective matrix with infinite far plane.
 * @param {number} aspect Aspect ratio (width / height)
 * @param {number} near Near clipping plane
 * @param {number} fy Focal length = 1/tan(fovy/2)
 */
export function perspective(aspect, near, fy = 1) {
	// https://developer.nvidia.com/content/depth-precision-visualized
	return DOMMatrix.fromMatrix(
		{m11: fy / aspect, m22: 0, m23: 1, m24: 1, m32: fy, m33: 0, m43: -2 * near, m44: 0}
	)
}
