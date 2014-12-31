import LPLLogo from './views/lpl-logo.es6.js';
// import DustParticles from './views/dust-particles.es6.js';
// import OrbitParticles from './views/orbit-particles.es6.js';
import EdgeParticles from './views/edge-particles.es6.js';

import MercurySection from './views/mercury-section.es6.js';
import FooterView from './views/footer-view.es6.js';
import BGTrailsView from './views/bg-trails-view.es6.js';
import './analytics.js';

import PIXI from './lib/pixi.js'; window.PIXI = PIXI;
import Vector from './lib/vector.es6.js';

// init backbone
import '../../node_modules/zepto/zepto.min.js'; // zepto's package.json is not working...
import _ from 'lodash'; window._ = _;
import Backbone from 'backbone';
Backbone.$ = $;

export default class App {

	// https://github.com/thlorenz/es6ify#supported-es6-features

	constructor(){
		// console.log('app.constructor');

		// PIXI setup
		PIXI.Vector = Vector;
		PIXI.Point = Vector;

		var logo = new LPLLogo('#lpl-logo');
		new EdgeParticles(logo);
		// var dust = new DustParticles(logo);
		// new OrbitParticles(logo);

		new MercurySection();
		new FooterView();
		// new BGTrailsView(); // FIXME: https://github.com/GoodBoyDigital/pixi.js/issues/1299

		this.$header = $('header');
		this.$footer = $('footer');
		this.$scrollableContent = $('.scrollable-content');

		window.addEventListener('resize', (e)=>this.onResize(e));
		this.onResize();

	}

	onResize(){
		this.$scrollableContent.css({
			height: window.innerHeight - this.$footer.height() - this.$header.height(),
			top: this.$header.height()
		});
	}

};