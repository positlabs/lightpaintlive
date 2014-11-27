
require('requestanimationframe');
var PIXI = require('../lib/pixi.js'); window.PIXI = PIXI;
var _ = require('underscore');

var size = 500;
var halfSize = size*.5;

var LPLLogo = {

	init: function(){

		this.stage = new PIXI.Stage(0x000000, true);
		this.renderer = PIXI.autoDetectRenderer(size, size);

		this.accumulationTextures = [
			new PIXI.RenderTexture(size, size),
			new PIXI.RenderTexture(size, size)
		];

		this.accumulatorSprite = new PIXI.Sprite(this.accumulationTextures[0]);
		this.accumulatorSprite.position.x = halfSize;
		this.accumulatorSprite.position.y = halfSize;
		this.accumulatorSprite.anchor.x = 0.5;
		this.accumulatorSprite.anchor.y = 0.5;
		this.stage.addChild(this.accumulatorSprite);
		
		this.dust = PIXI.Sprite.fromImage("assets/images/space-dust.jpg");
		this.dust.anchor = new PIXI.Point(.5, .5);
		this.dust.scale.x = this.dust.scale.y = .225;
		this.dust.position = new PIXI.Point(halfSize, halfSize);
		this.dust.blendMode = PIXI.blendModes.SCREEN;
		this.stage.addChild(this.dust);

		var whiteCircle = PIXI.Sprite.fromImage("assets/images/circle-white.svg");
		whiteCircle.anchor = new PIXI.Point(.5, .5);
		whiteCircle.scale.x = whiteCircle.scale.y = .25;
		whiteCircle.position = new PIXI.Point(halfSize, halfSize);
		whiteCircle.alpha = .5;
		whiteCircle.blendMode = PIXI.blendModes.SCREEN;
		this.stage.addChild(whiteCircle);
		
		var blackCircle = PIXI.Sprite.fromImage("assets/images/circle-black.svg");
		blackCircle.anchor = new PIXI.Point(.5, .5);
		blackCircle.scale.x = blackCircle.scale.y = .25;
		blackCircle.position = new PIXI.Point(halfSize, halfSize);
		this.stage.addChild(blackCircle);

		this.faderGraphic = new PIXI.Graphics();
		this.faderGraphic.beginFill(0x000000, .03);
		this.faderGraphic.drawRect(-halfSize, -halfSize, size, size);
		this.accumulatorSprite.addChild(this.faderGraphic);

		document.body.appendChild(this.renderer.view);
		this.currentFrame = 0;
		this.onFrame = _.bind(this.onFrame, this);
	    this.onFrame();

	},

	onRezie: function(){

	},

	onFrame: function() {

	    this.dust.rotation += 0.01;
	    this.dust.scale.x = this.dust.scale.y = Math.sin(this.currentFrame*.005)*.025 + .2;

	    this.accumulationTextures.reverse();
	    var rt1 = this.accumulationTextures[0];
	    var rt2 = this.accumulationTextures[1];
	    rt1.render(this.stage, true);
		this.accumulatorSprite.setTexture(rt1);
		rt2.render(this.stage, false);

	    this.renderer.render(this.stage);

		this.currentFrame++;
	    requestAnimationFrame( this.onFrame );

	}

};

module.exports = LPLLogo;

