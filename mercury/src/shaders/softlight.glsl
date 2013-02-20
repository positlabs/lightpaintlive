//#name softlight
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
  vec3 onehalf = vec3(0.5);
  float v1Lum = (v1.r + v1.g + v1.b )/3.0;

  vec3 softlight;
      if ( v1Lum > 0.5 ){
         softlight = v2.rgb + (one - v2.rgb) * ((v1.rgb - onehalf) / onehalf) * (0.5 - abs(v2.rgb - onehalf));
      }else{
         softlight = v2.rgb - v2.rgb * ((onehalf - v1.rgb) / onehalf) * (0.5 - abs(v2.rgb-onehalf));
      }

   softlight = mix(v2.rgb, softlight, exposure);

  gl_FragColor = vec4(softlight, 1.0);

}