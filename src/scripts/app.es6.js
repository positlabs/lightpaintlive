import LPLLogo from './views/lpl-logo.es6.js';
import EdgeParticles from './views/edge-particles.es6.js';

import MercurySection from './views/mercury-section.es6.js';
import FooterView from './views/footer-view.es6.js';
import HeaderView from './views/header-view.es6.js';
import './analytics.js';

import checkAutoplaySupport from './lib/is-autoplay-supported.js';

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

		this.headerView = new HeaderView();
		this.headerView.on('resize', ()=>this.onResize);

		new MercurySection();
		new FooterView();

		this.$header = $('header');
		this.$footer = $('footer');
		this.$scrollableContent = $('.scrollable-content');

		checkAutoplaySupport();

		window.addEventListener('resize', (e)=>this.onResize(e));
		this.onResize();

	}

	onResize(){
		console.log('app.onResize');
		this.$scrollableContent.css({
			height: window.innerHeight - this.$footer.height() - this.$header.height(),
			top: this.$header.height()
		});
	}

};