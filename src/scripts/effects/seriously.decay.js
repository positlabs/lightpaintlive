/*
  forked to fix the 90deg rotation
  TODO...
*/
Seriously.plugin('decay', {
  commonShader: true,
  shader: function (inputs, shaderSource) {
    shaderSource.fragment = `
      precision highp float;
      varying vec2 vTexCoord;
      uniform sampler2D source;
      uniform float decay;

      void main(void) {
        gl_FragColor = texture2D(source, vTexCoord);
      }
    `
    return shaderSource
  },
  inPlace: true,
  inputs: {
    source: {
      type: 'image',
      uniform: 'source',
      shaderDirty: false
    },
    segments: {
      type: 'number',
      uniform: 'decay',
      defaultValue: 0
    },
  },
  title: 'Decay'
})
