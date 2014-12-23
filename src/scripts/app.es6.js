import LPLLogo from './views/lpl-logo.es6.js';
import DustParticles from './views/dust-particles.es6.js';
import MercurySection from './views/mercury-section.es6.js';
import FooterView from './views/footer-view.es6.js';
import BGTrailsView from './views/bg-trails-view.es6.js';
import './analytics.js';

// init backbone
import '../../node_modules/zepto/zepto.min.js'; // zepto's package.json is not working...
import _ from 'lodash'; window._ = _;
import Backbone from 'backbone';
Backbone.$ = $;

export default class App {

	// https://github.com/thlorenz/es6ify#supported-es6-features

	constructor(){
		// console.log('app.constructor');
		var logo = new LPLLogo();
		var dust = new DustParticles(logo);

		// new MercurySection();
		// new FooterView();
		// new BGTrailsView();
	}

};