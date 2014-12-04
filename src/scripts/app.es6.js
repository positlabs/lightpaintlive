// import LPLLogo from './views/lpl-logo.es6.js';
import MercurySection from './views/mercury-section.es6.js';
require('../../node_modules/zepto/zepto.min.js'); // zepto's package.json is not working...

export default class App {

	// https://github.com/thlorenz/es6ify#supported-es6-features

	constructor(){
		// console.log('app.constructor');
		// new LPLLogo();

		new MercurySection();
	}

};

// asdfasdfasdf:;;;';;'';sdaf;f;!@#