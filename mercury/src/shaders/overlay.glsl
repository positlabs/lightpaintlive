//#name overlay
//#author josh

//#include CommonFilterInclude

//#vertex
//#include BasicFilterVertex

//#fragment
uniform sampler2D uNewTexture;
uniform sampler2D uOldTexture;

uniform float exposure;

varying vec2 vTextureCoord;

void main(void) {
  vec4 v1 = texture2D(uNewTexture, vTextureCoord);
  vec4 v2 = texture2D(uOldTexture, vTextureCoord);

  vec3 one = vec3(1.0);

  // 0.21 R + 0.71 G + 0.07 B
  //float v2Lum = v2.r * 0.21 + v2.g * 0.71 + v2.b * 0.07;
  float v2Lum = (v2.r + v2.g + v2.b)/3.0;

  vec3 overlay = v2Lum > 0.5 ? vec3(2.0) * v1.rgb * v2.rgb : one - vec3(2.0) * (one - v1.rgb) * (one - v2.rgb);

  gl_FragColor = vec4(mix(v2.rgb, overlay.rgb, exposure*0.1), 1.0);

}