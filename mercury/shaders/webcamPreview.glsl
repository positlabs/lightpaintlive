//#name webcamPreview
//#author josh

//#include CommonFilterInclude

//#vertex
//#include BasicFilterVertex

//#fragment
uniform sampler2D uNewTexture;
//uniform sampler2D uOldTexture;

//uniform float exposure;

varying vec2 vTextureCoord;

void main(void) {
  vec4 n = texture2D(uNewTexture, vTextureCoord);
  //uOldTexture;

  gl_FragColor = vec4(n.rgb, 1.0);

}