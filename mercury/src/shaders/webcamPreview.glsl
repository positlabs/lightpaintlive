//#name webcamPreview
//#author josh

//#include CommonFilterInclude

//#vertex
//#include BasicFilterVertex

//#fragment
uniform sampler2D uNewTexture;

// TODO change this name so it will work with Postprocess

varying vec2 vTextureCoord;

void main(void) {
  vec4 n = texture2D(uNewTexture, vTextureCoord);

  gl_FragColor = vec4(n.rgb, 1.0);

}