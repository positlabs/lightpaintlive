Seriously.plugin('highlights-shadows', {
  commonShader: true,
  shader: function (inputs, shaderSource) {
    shaderSource.fragment = [
      'precision mediump float;',

      'varying vec2 vTexCoord;',

      'uniform sampler2D source;',
      'uniform float shadows;',
      'uniform float highlights;',

      // 'const vec3 luma = vec3(0.3, 0.3, 0.3);',
      'const vec3 luma = vec3(0.2125, 0.7154, 0.0721);',

      'void main(void) {',
      `   vec4 source = texture2D(source, vTexCoord);
				float luminance = dot(source.rgb, luma);

				//(shadows+1.0) changed to just shadows:
				float shadow = clamp((pow(luminance, 1.0 / shadows) + (-0.76) * pow(luminance, 2.0 / shadows)) - luminance, 0.0, 1.0);
				float highlight = clamp((1.0 - (pow(1.0 - luminance, 1.0 / (2.0 - highlights)) + (-0.8) * pow(1.0 - luminance, 2.0 / (2.0 - highlights)))) - luminance, -1.0, 0.0);
				vec3 result = vec3(0.0, 0.0, 0.0) + (luminance + shadow + highlight) * (source.rgb) / max(luminance, 0.004);

				// blend toward white if highlights is more than 1
				float contrastedLuminance = ((luminance - 0.5) * 1.5) + 0.5;
				float whiteInterp = contrastedLuminance * contrastedLuminance * contrastedLuminance;
				float whiteTarget = clamp(highlights, 1.0, 2.0) - 1.0;
				result = mix(result, vec3(1.0), whiteInterp * whiteTarget);

				// blend toward black if shadows is less than 1
				float invContrastedLuminance = 1.0 - contrastedLuminance;
				float blackInterp = invContrastedLuminance * invContrastedLuminance * invContrastedLuminance;
				float blackTarget = 1.0 - clamp(shadows, 0.0, 1.0);
				result = mix(result, vec3(0.0), blackInterp * blackTarget);

				// values are going negative on windows...
				result = max(result, 0.0);

				gl_FragColor = vec4(result, source.a);`,
      '}'
    ].join('\n');
    return shaderSource;
  },
  inPlace: true,
  inputs: {
    source: {
      type: 'image',
      uniform: 'source',
      shaderDirty: false
    },
    highlights: {
      type: 'number',
      uniform: 'highlights',
      min: 0,
      max: 1,
      defaultValue: 1
    },
    shadows: {
      type: 'number',
      uniform: 'shadows',
      min: 0,
      max: 1,
      defaultValue: 0
    }
  },
  title: 'Highlights/Shadows',
  description: 'Darken highlights, lighten shadows'
})
