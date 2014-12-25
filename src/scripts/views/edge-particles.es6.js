import PIXI from '../lib/pixi.js';
import _ from 'underscore';

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
		for (var i = numParticles-1; i >= 0; i--) {
			var center = new PIXI.Vector(this.logo.size*.5, this.logo.size*.5);
			var p = new EdgeParticle(center);
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

	constructor(center = new PIXI.Vector()){
		// console.log('EdgeParticle.constructor', position.x, position.y);
		super();

		this.center = center;
		this.direction = Math.random() > .5 ? 1 : -1;

		this.blendMode = PIXI.blendModes.SCREEN;

		var color = Math.random()*0xffffff;
		this.lineStyle(4, color, .2);
		var size = Math.random() * 500 + 100;
		this.moveTo(0, -size/2);
		this.lineTo(0, size/2);
		this.speed = Math.random() * .5 + .05
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


