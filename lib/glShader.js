export const basicVert = `
#ifdef kTransform
	uniform mat4 uModelMat;
	uniform mat4 uViewMat;
	uniform mat4 uProjMat;
#endif
#ifdef kTexMat
	uniform mat3 uTexMat0;
#endif
#ifdef kPointSize
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
#ifdef kTransform
		vPosition = uModelMat * vPosition;
#endif
		vNormal = aNormal;
		vColor = aColor;
		vTexCoord0 = vec3(aTexCoord0, 1);
#ifdef kTexMat
		vTexCoord0 = uTexMat0 * vTexCoord0;
#endif
		gl_Position = vPosition;
#ifdef kTransform
		gl_Position = uProjMat * uViewMat * gl_Position;
#endif
#ifdef kPointSize
		gl_PointSize = uPointSize;
#endif
	}
`

export const basicFrag = `
	precision mediump float;

	varying vec4 vColor;

#ifdef kTexture
	uniform sampler2D sColor;
	varying vec3 vTexCoord0;
#endif

	void main() {
		vec4 color = vColor;
#ifdef kTexture
		vec2 uv = vTexCoord0.st / vTexCoord0.p;
		color *= texture2D(sColor, uv);
#endif
		gl_FragColor = color;
	}
`
