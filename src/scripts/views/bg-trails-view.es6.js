import CoreView from '../core/core-view.es6.js';
import 'requestanimationframe';
import PIXI from '../lib/pixi.js';
// import SimplexNoise from 'simplex-noise';

// class Ribbon extends PIXI.Rope {
	
// 	constructor(){
	
// 		var length = 918 / 20;
// 		this.points = [];
// 		for (var i = 0; i < 20; i++) {
// 			var segSize = length;
// 			this.points.push(new PIXI.Point(i * length, 0));
// 		};

// 		super(PIXI.Texture.fromImage("assets/images/space-dust.jpg"), this.points);
// 		this.x = 200;

// 		this.noise = new SimplexNoise();
// 	}

// 	update(t){
// 		var time = t * .1;
// 		var length = 918 / 20;
// 		for (var i = 0; i < this.points.length; i++) {
// 			this.points[i].y = Math.sin(i * 0.2  + time) * 30;
// 			this.points[i].x = i * length + Math.cos(i * 0.05  + time) * 20;
// 		}
// 	}

// }

class Floater extends PIXI.Sprite {
	constructor(){
		var texture = PIXI.Texture.fromImage("assets/images/rainbow-dots.png");
		super(texture);
		this.anchor.set(.5, .5);
		this.position.set(Math.random()*window.innerWidth, Math.random()*window.innerHeight);
		this.blendMode = PIXI.blendModes.ADD;
		this.vector = {
			x: Math.max(.1, Math.random()-.5), 
			y: Math.max(Math.random()-.5)
		};
		this.speed = 5;
		this.rotationSpeed = (Math.random()-.5)*.05;
	}
	update(t){
		this.rotation += this.rotationSpeed;
		this.position.x += this.vector.x * this.speed;
		this.position.y += this.vector.y * this.speed;
		if(this.position.x > window.innerWidth || this.position.x < 0) this.vector.x *= -1;  
		if(this.position.y > window.innerHeight || this.position.y < 0) this.vector.y *= -1;  
	}
}

export default class BGTrailsView extends CoreView {
	initialize(){
		this.setElement($('#bg-trails'));

		var w = window.innerWidth;
		var h = window.innerHeight;

		this.props = {
			width: w,
			height: h,
			currentFrame: 0,
			stage: new PIXI.Stage(0x000000),
			renderer: new PIXI.autoDetectRenderer(w, h),
			accumulationTextures: [
				new PIXI.RenderTexture(w, h),
				new PIXI.RenderTexture(w, h)
			],
			autonomousChildren: []
		};

		this.accumulatorSprite = new PIXI.Sprite(this.accumulationTextures[0]);
		this.accumulatorSprite.anchor.set(.5, .5);
		this.stage.addChild(this.accumulatorSprite);

		this.faderGraphic = new PIXI.Graphics();
		this.faderGraphic.beginFill(0x000000, .05);
		this.faderGraphic.drawRect(-w*.5, -h*.5, w, h);
		this.accumulatorSprite.addChild(this.faderGraphic);

		this.floater = new Floater(); 
		this.stage.addChild(this.floater);
		this.autonomousChildren.push(this.floater);
		
		this.el.appendChild(this.renderer.view);

	    window.addEventListener('resize', ()=> this.onResize());
	    this.onResize();

	    this.onFrame();

	}

	onResize(){
		var w = window.innerWidth, 
			h = window.innerHeight;
		this.props = {
			width: w,
			height: h,
		};

		this.accumulationTextures[0].width = this.accumulationTextures[1].width = w;
		this.accumulationTextures[0].height = this.accumulationTextures[1].height = h;
		this.accumulatorSprite.position.set(w*.5, h*.5);
	}

	onFrame() {

		// this.ribbon.update(this.currentFrame);
		_.each(this.autonomousChildren, (child)=> child.update(this.currentFrame));

		this.accumulationTextures.reverse();
		var [rt1, rt2] = this.accumulationTextures;
		rt1.render(this.stage, true);
		this.accumulatorSprite.setTexture(rt1);
		rt2.render(this.stage, false);

	    this.renderer.render(this.stage);

		this.currentFrame++;
	    requestAnimationFrame( ()=>this.onFrame() );

	}
}