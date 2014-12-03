import 'requestanimationframe';
import PIXI from '../lib/pixi.js';

export default class LPLLogo {

	constructor(size = 500){
		this.size = size;
		this.halfSize = size * .5;
		var halfSize = this.halfSize;

		this.stage = new PIXI.Stage(0x000000, true);
		this.renderer = PIXI.autoDetectRenderer(size, size);

		this.accumulationTextures = [
			new PIXI.RenderTexture(size, size),
			new PIXI.RenderTexture(size, size)
		];

		this.accumulatorSprite = new PIXI.Sprite(this.accumulationTextures[0]);
		this.accumulatorSprite.position.set(halfSize, halfSize);
		this.accumulatorSprite.anchor.set(.5, .5);
		this.stage.addChild(this.accumulatorSprite);
		
		this.dust = PIXI.Sprite.fromImage("assets/images/space-dust.jpg");
		this.dust.anchor.set(.5, .5);
		this.dust.scale.set(.225, .225);
		this.dust.position.set(halfSize, halfSize);
		this.dust.blendMode = PIXI.blendModes.SCREEN;
		this.stage.addChild(this.dust);

		var whiteCircle = PIXI.Sprite.fromImage("assets/images/circle-white.svg");
		whiteCircle.anchor.set(.5, .5);
		whiteCircle.scale.set(.25, .25)
		whiteCircle.position.set(halfSize, halfSize);
		whiteCircle.alpha = .5;
		whiteCircle.blendMode = PIXI.blendModes.SCREEN;
		this.stage.addChild(whiteCircle);
		
		var blackCircle = PIXI.Sprite.fromImage("assets/images/circle-black.svg");
		blackCircle.anchor.set(.5, .5);
		blackCircle.scale.set(.25, .25);
		blackCircle.position.set(halfSize, halfSize);
		this.stage.addChild(blackCircle);

		this.faderGraphic = new PIXI.Graphics();
		this.faderGraphic.beginFill(0x000000, .03);
		this.faderGraphic.drawRect(-halfSize, -halfSize, size, size);
		this.accumulatorSprite.addChild(this.faderGraphic);

		document.body.appendChild(this.renderer.view);
		this.currentFrame = 0;
	    this.onFrame();

	}

	onResize(){

	}

	onFrame() {

	    this.dust.rotation += 0.01;
	    var scale = Math.sin(this.currentFrame*.005)*.025 + .2;
	    this.dust.scale.set(scale, scale);

	    this.accumulationTextures.reverse();
	    var [rt1, rt2] = this.accumulationTextures;
	    rt1.render(this.stage, true);
		this.accumulatorSprite.setTexture(rt1);
		rt2.render(this.stage, false);

	    this.renderer.render(this.stage);

		this.currentFrame++;
	    requestAnimationFrame( ()=>this.onFrame() ); // easy scope binding

	}

};

