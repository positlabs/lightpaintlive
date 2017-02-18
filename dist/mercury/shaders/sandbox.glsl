//#name sandbox
//#author josh

//#include CommonFilterInclude

//#vertex
//#include BasicFilterVertex

//#fragment
uniform sampler2D uNewTexture;
uniform sampler2D uOldTexture;

uniform float exposure;

// argument for number of sides
uniform float arg1;

varying vec2 vTextureCoord;

void main(void) {
  // normalize to the center
  vec2 p = vTextureCoord - 0.5;

  // cartesian to polar coordinates
  float r = length(p);
  float a = atan(p.y, p.x);

  // kaleidoscope
  float sides = arg1;
  float tau = 2. * 3.1416;
  a = mod(a, tau/sides);
  a = abs(a - tau/sides/2.);

  // polar to cartesian coordinates
  p = r * vec2(cos(a), sin(a));

  // sample the webcam
  //vec4 color = texture2D(uNewTexture, p + 0.5);


  vec4 n = texture2D(uNewTexture, p + 0.5);
  vec4 o = texture2D(uOldTexture, p + 0.5);

  vec3 screen = n.rgb + o.rgb - n.rgb * o.rgb;

  gl_FragColor = vec4(mix(o.rgb, screen.rgb, exposure*0.1), 1.0);

}