import 'requestanimationframe';
import PIXI from '../lib/pixi.js';

export default class DustParticles extends PIXI.Graphics {

	constructor(logo){
		super();

		this.logo = logo;
		logo.addChild(this);

		this.dust = PIXI.Sprite.fromImage("assets/images/space-dust.jpg");
		this.dust.anchor.set(.5, .5);

		var halfLogoSize = logo.size * .5;
		this.dust.blendMode = PIXI.blendModes.SCREEN;
		this.addChild(this.dust);
		
		this.currentFrame = 0;
	    logo.on('frame', (e)=>this.onFrame(e));
	    logo.on('resize', (e)=>this.onResize(e));
	    this.onResize();
	}

	onResize(){
		this.position.set(this.logo.size*.5, this.logo.size*.5);
	}

	onFrame(time) {
	    this.dust.rotation += 0.01;
	    var scale = Math.sin(time*.002)*.1 + .5;
	    this.dust.scale.set(scale, scale);
	}

};

