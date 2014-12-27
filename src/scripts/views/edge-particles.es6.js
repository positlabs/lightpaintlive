import PIXI from '../lib/pixi.js';
import _ from 'underscore';
import tinycolor from 'tinycolor2'; window.tinycolor = tinycolor;

export default class EdgeParticles extends PIXI.Graphics {

	constructor(logo){
		// console.log('EdgeParticles.constructor');

		super();

		this.logo = logo;
		logo.addChild(this);

		this.center = new PIXI.Vector();

	    logo.on('frame', (e)=>this.onFrame(e));
	    logo.on('resize', (e)=>this.onResize(e));
	    this.onResize();

		this.spawnParticles(200);

	}

	spawnParticles(numParticles){
		// console.log('spawnParticles', numParticles);
		var hueOffset = Math.random()*360;
		for (var i = numParticles-1; i >= 0; i--) {
			var p = new EdgeParticle(this.logo, hueOffset);
			this.addChild(p);
		};
	}

	onResize(){
		this.center.set(this.logo.size*.5, this.logo.size*.5);
		_.each(this.children, (p)=>{p.center = this.center.clone()});
	}

	onFrame(time) {
		_.each(this.children, (p)=>this.updateParticle(p, time));
	}

	updateParticle(p, time){
		p.onFrame(time);
	}

};

class EdgeParticle extends PIXI.Graphics {

	constructor(logo, hueOffset = 0){
		// console.log('EdgeParticle.constructor', position.x, position.y);
		super();

		this.center = new PIXI.Vector(logo.size*.5, logo.size*.5);
		this.direction = Math.random() > .5 ? 1 : -1;
		this.blendMode = PIXI.blendModes.SCREEN;

		var color = tinycolor({h: Math.random()*150 + hueOffset, s: 100, v: 50}).toHex();
		color = parseInt(color, 16);
		// console.log('%c'+color, 'color: #' + color);
		this.lineStyle(logo.size/1024*4, color, .2);

		var size = Math.random() * logo.size * .5 + logo.size * .1;
		this.moveTo(0, -size/2);
		this.lineTo(0, size/2);
		this.speed = Math.random() * .5 + .2;
		// this.speed = Math.random() * .5 + .05;
		this.angle = Math.random() * Math.PI * 2;
	}

	set angle(angle){
		this._angle = angle;
		this.updatePosition();
	}
	get angle(){
		return this._angle;
	}

	updatePosition(){
		var r = this.center.x * .51;
		var x = r * Math.cos(this.angle) + this.center.x;
		var y = r * Math.sin(this.angle) + this.center.y;
		this.position.set(x, y);
		this.rotation = Math.atan2(this.position.y-this.center.y, this.position.x-this.center.y);
	}

	onFrame(time){
		this.angle += .01 * this.direction * this.speed;
	}

}


