import PIXI from '../lib/pixi.js';
import _ from 'underscore';

export default class OrbitParticles extends PIXI.Graphics {

	constructor(logo){
		// console.log('OrbitParticles.constructor');

		super();

		this.logo = logo;
		logo.addChild(this);

		this.center = new PIXI.Vector();

	    logo.on('frame', (e)=>this.onFrame(e));
	    logo.on('resize', (e)=>this.onResize(e));
	    this.onResize();

		this.spawnParticles(400);

	}

	spawnParticles(numParticles){
		// console.log('spawnParticles', numParticles);
		for (var i = numParticles-1; i >= 0; i--) {
			var rng = 100;
			var position = this.center.clone().add(new PIXI.Vector(Math.random()*rng-rng*.5, Math.random()*rng-rng*.5));
			var p = new OrbitParticle(position);
			this.addChild(p);
		}
	}

	onResize(){
		this.center.set(this.logo.size*.5, this.logo.size*.5);
	}

	onFrame(time) {
		// console.log('OrbitParticles.onFrame', time);
		_.each(this.children, (p)=>this.updateParticle(p, time));
	}

	updateParticle(p, time){
		var gravVector = p.position.clone().sub(this.center);
		var gravStrength = 300/gravVector.length();
		gravVector.scale(gravStrength);
		p.acceleration = gravVector.scale(-.002);
		p.onFrame(time);
	}

};

class OrbitParticle extends PIXI.Graphics {

	constructor(position = new PIXI.Vector()){
		// console.log('OrbitParticle.constructor', position.x, position.y);
		super();
		this.beginFill(0x33FFFF, .5);
		var size = 40;
		this.drawCircle(0, 0, size, size);
		this.blendMode = PIXI.blendModes.ADD;
		this.position = position;
		var rng = 30;
		this.velocity = new PIXI.Vector(Math.random()*rng-rng*.5, Math.random()*rng-rng*.5);
		this.acceleration = new PIXI.Vector();

		//TODO: draw line from last position to current
	}

	onFrame(time){
		this.velocity.add(this.acceleration);
		this.position.add(this.velocity);
	}

}