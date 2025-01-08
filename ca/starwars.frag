// https://conwaylife.com/wiki/OCA:Star_Wars

precision mediump float;
varying vec3 vTexCoord0;

uniform sampler2D uTexture;

float CELL = 1.0 / 768.0;

vec4 STATE0 = vec4(0, 0, 0, 1);
vec4 STATE1 = vec4(1, 0, 0, 1);
vec4 STATE2 = vec4(1, 0.5, 0, 1);
vec4 STATE3 = vec4(1, 1, 0, 1);

int colorToState(vec4 color) {
	int rStep = int(step(0.5, color.r));
	int gStep = int(step(0.25, color.g) + step(0.75, color.g));
	return rStep + rStep * gStep;
}

int getState(vec2 pos) {
	return colorToState(texture2D(uTexture, pos));
}

vec4 nextState(vec2 pos) {
	int myState = getState(pos);
	int neighborCount = 0;
	for (int x = -1; x <= 1; x++) {
		for (int y = -1; y <= 1; y++) {
			int neighborState = getState(pos + vec2(float(x) * CELL, float(y) * CELL));
			neighborCount += (neighborState == 1) ? 1 : 0;
		}
	}
	if (myState == 0) {
		return (neighborCount == 2) ? STATE1 : STATE0;
	} else if (myState == 1) {
		return (neighborCount >= 4 && neighborCount <= 6) ? STATE1 : STATE2;
	} else if (myState == 2) {
		return STATE3;
	} else {
		return STATE0;
	}
}

void main() {
	gl_FragColor = nextState(vTexCoord0.xy);
}
