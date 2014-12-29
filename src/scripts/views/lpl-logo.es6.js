import 'requestanimationframe';
import PIXI from '../lib/pixi.js';
import Backbone from 'backbone';
import CoreEvents from '../core/core-events.es6.js';


//TODO: set background image on the canvas to use as a fallback


export default class LPLLogo extends CoreEvents {

	constructor(selector, size = 512){

		super();
		// window.logo = this;

		this._size = size;
		var halfSize = this._halfSize = size * .5;

		this.stage = new PIXI.Stage(0x000000);
		this.renderer = PIXI.autoDetectRenderer(size, size);
		this.renderer.view.style.position = 'absolute';
		this.renderer.view.style.top = 0;

		this.accumulationTextures = [
			new PIXI.RenderTexture(size, size),
			new PIXI.RenderTexture(size, size)
		];

		// thing to add particles to
		this.accumulatorGraphics = new PIXI.Graphics();
		this.stage.addChild(this.accumulatorGraphics);

		// handles drawing rendertextures
		this.accumulatorSprite = new PIXI.Sprite(this.accumulationTextures[0]);
		this.accumulatorSprite.anchor.set(.5, .5);
		this.stage.addChild(this.accumulatorSprite);
		
		this.createCircles();

		this.faderGraphic = new PIXI.Graphics();
		this.faderGraphic.beginFill(0x000000, .03);
		this.accumulatorGraphics.addChild(this.faderGraphic);

		this.onResize();

		var parentEl = selector != undefined ? $(selector)[0] : document.body;

		parentEl.appendChild(this.renderer.view);
	    this.onFrame();

	}

	get size(){
		return this._size;
	}

	set size(newSize){
		this._size = newSize;
		this._halfSize = newSize * .5;
		this.onResize();
	}

	createCircles(){
		if(this.whiteCircle != undefined){
			this.stage.removeChild(this.whiteCircle);
			this.stage.removeChild(this.blackCircle);
		}

		this.whiteCircle = new PIXI.Graphics();
		this.whiteCircle.beginFill(0xffffff);
		this.stage.addChild(this.whiteCircle);

		var blur = new PIXI.BlurFilter();
		blur.blur = 10;
		this.whiteCircle.filters = [blur];

		this.blackCircle = new PIXI.Graphics();
		this.blackCircle.beginFill(0x000000);
		this.stage.addChild(this.blackCircle);

	}

	onResize(){

		this.renderer.resize(this._size, this._size);
		// this.renderer.view.style.width = this._halfSize + 'px';
		// this.renderer.view.style.height = this._halfSize + 'px';

		this.accumulationTextures[0].resize(this._size, this._size);
		this.accumulationTextures[1].resize(this._size, this._size);
		this.accumulatorSprite.position.set(this._halfSize, this._halfSize);

		this.whiteCircle.drawCircle(this._halfSize, this._halfSize, this._size*.26, this._size*.26); // TODO: clear?
		this.blackCircle.drawCircle(this._halfSize, this._halfSize, this._size*.25, this._size*.25);
		this.faderGraphic.drawRect(0, 0, this._size, this._size);

		this.trigger('resize');

	}

	addChild(child){
		this.accumulatorGraphics.addChild(child);
	}

	removeChild(child){
		this.accumulatorGraphics.removeChild(child);
	}

	onFrame(time = 0) {

		this.accumulationTextures.reverse();
		var [rt1, rt2] = this.accumulationTextures;
		rt1.render(this.accumulatorGraphics, true);
		this.accumulatorSprite.setTexture(rt1);
		rt2.render(this.accumulatorGraphics, false);

	    this.renderer.render(this.stage);
	    this.trigger('frame', time);

	    requestAnimationFrame( (time)=>this.onFrame(time) );

	}

};

