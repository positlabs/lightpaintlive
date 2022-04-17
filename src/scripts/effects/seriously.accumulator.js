/*
Adapted from blend mode shader by Romain Dura
http://mouaif.wordpress.com/2009/01/05/photoshop-math-with-glsl-shaders/
*/

var blendModes = {
    normal: 'blend',
    lighten: 'max(blend, base)',
    average: '(base + blend / TWO)',
    add: 'min(base + blend, ONE)',
    screen: '(ONE - ((ONE - base) * (ONE - blend)))',
    lightercolor: 'BlendLighterColor(base, blend)',
  },

  /*
  All blend modes other than "normal" effectively act as adjustment layers,
  so the alpha channel of the resulting image is just a copy of the "bottom"
  or "destination" layer. The "top" or "source" alpha is only used to dampen
  the color effect.
  */
  mixAlpha = {
    normal: true
  };

Seriously.plugin('accumulator', function () {
  var drawOpts = {
      clear: false
    },
    frameBuffers,
    fbIndex = 0,
    me = this,
    width = this.width,
    height = this.height;

  function clear() {
    var gl = me.gl,
      width = me.width,
      height = me.height,
      color = me.inputs.startColor;

    if (gl && width && height) {
      gl.viewport(0, 0, width, height);
      gl.clearColor.apply(gl, color);

      gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffers[0].frameBuffer);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffers[1].frameBuffer);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
  }

  return {
    initialize: function (initialize, gl) {
      initialize();
      frameBuffers = [
        this.frameBuffer,
        new Seriously.util.FrameBuffer(gl, this.width, this.height)
      ];
      clear();
    },
    shader: function (inputs, shaderSource) {
      var mode = inputs.blendMode || 'normal';
      mode = mode.toLowerCase();

      shaderSource.fragment = [
        '#define SHADER_NAME seriously.accumulator.' + mode,
        'precision highp float;',

        'const vec3 ZERO = vec3(0.0);',
        'const vec3 ONE = vec3(1.0);',
        'const vec3 HALF = vec3(0.5);',
        'const vec3 TWO = vec3(2.0);',

        '#define BlendFunction(base, blend) ' + blendModes[mode],
        (mixAlpha[mode] ? '#define MIX_ALPHA' : ''),

        'varying vec2 vTexCoord;',

        'uniform sampler2D source;',
        'uniform sampler2D previous;',

        'uniform float opacity;',
        'uniform float decay;',
        'uniform float blendGamma;',

        'vec3 BlendOpacity(vec4 base, vec4 blend, float opacity) {',
        '	vec3 blendedColor = BlendFunction(base.rgb, blend.rgb);',
        '	return mix(base.rgb, blendedColor, opacity * blend.a);',
        '}',

        'vec4 linear(vec4 color, vec3 gamma) {',
        '	return vec4(pow(color.rgb, gamma), color.a);',
        '}',

        'void main(void) {',
        '	vec3 exp = vec3(blendGamma);',
        '	vec4 topPixel = linear(texture2D(source, vTexCoord), exp);',
        '	vec4 bottomPixel = texture2D(previous, vTexCoord);',

        '	if (topPixel.a == 0.0) {',
        '		gl_FragColor = bottomPixel;',
        '	} else {',
        '		float alpha;',
        '#ifdef MIX_ALPHA',
        '		alpha = topPixel.a * opacity;',
        '		alpha = alpha + bottomPixel.a * (1.0 - alpha);',
        '#else',
        '		alpha = bottomPixel.a;',
        '#endif',
        '		bottomPixel = linear(bottomPixel, exp);',
        '		gl_FragColor = vec4(pow(BlendOpacity(bottomPixel, topPixel, opacity), 1.0 / exp), alpha);',
        // '       vec4 maxCol = max(bottomPixel, topPixel);',
        '       gl_FragColor = mix(gl_FragColor, topPixel, decay);',
        '	}',
        '}'
      ].join('\n');

      return shaderSource;
    },
    resize: function () {
      if (frameBuffers && (this.width !== width || this.height !== height)) {
        width = this.width;
        height = this.height;
        frameBuffers[0].resize(width, height);
        frameBuffers[1].resize(width, height);
        clear();
      }
    },
    draw: function (shader, model, uniforms, frameBuffer, draw) {
      var fb;

      // ping-pong textures
      this.uniforms.previous = this.frameBuffer.texture;
      fbIndex = (fbIndex + 1) % 2;
      fb = frameBuffers[fbIndex];
      this.frameBuffer = fb;
      this.texture = fb.texture;

      if (this.inputs.clear) {
        clear();
        draw(this.baseShader, model, uniforms, fb.frameBuffer, null);
        return;
      }

      draw(shader, model, uniforms, fb.frameBuffer, null, drawOpts);
    },
    destroy: function () {
      if (frameBuffers) {
        frameBuffers[0].destroy();
        frameBuffers[1].destroy();
        frameBuffers.length = 0;
      }
    }
  };
}, {
  inPlace: false,
  title: 'Accumulator',
  description: 'Draw on top of previous frame',
  inputs: {
    source: {
      type: 'image',
      uniform: 'source'
    },
    clear: {
      type: 'boolean',
      defaultValue: false
    },
    startColor: {
      type: 'color',
      defaultValue: [0, 0, 0, 0]
    },
    opacity: {
      type: 'number',
      uniform: 'opacity',
      defaultValue: 1,
      min: 0,
      max: 1
    },
    decay: {
      type: 'number',
      uniform: 'decay',
      defaultValue: 0,
      min: 0,
      max: 1
    },
    blendGamma: {
      type: 'number',
      uniform: 'blendGamma',
      defaultValue: 2.2,
      min: 0,
      max: 4
    },
    blendMode: {
      type: 'enum',
      shaderDirty: true,
      defaultValue: 'normal',
      options: [
        ['normal', 'Normal'],
        ['lighten', 'Lighten'],
      ]
    }
  }
});
