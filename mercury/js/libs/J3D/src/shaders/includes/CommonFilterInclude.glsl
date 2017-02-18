//#name CommonFilterInclude
//#description Common uniforms and function for filters
precision mediump float;

uniform float uTime;

float whiteNoise(vec2 uv, float scale) {
	// from Three.js / film shader
	float x = (uv.x + 0.2) * (uv.y + 0.2) * (10000.0 + uTime);
	x = mod( x, 13.0 ) * mod( x, 123.0 );
	float dx = mod( x, 0.005 );
	return clamp( 0.1 + dx * 100.0, 0.0, 1.0 ) * scale;
}

float brightness(vec3 c) {
    return c.r * 0.2126 + c.g * 0.7152 + c.b * 0.0722;
}