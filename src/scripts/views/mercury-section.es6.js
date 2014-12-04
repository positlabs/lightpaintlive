import CoreView from '../core/core-view.es6.js'

export default class MercurySection extends CoreView {

	constructor(){
		console.log('MercurySection.constructor');
		this.setElement($('#mercury'));
		this.props = {
			events: {
				'mousedown .install-btn': 	'onClickInstallBtn',
				'click .launch-btn': 		'onClickLaunchBtn'
			}
		};
		super();
	}

	initialize(){
		console.log('MercurySection.initialize');
		if (chrome.app.isInstalled) {
			this.$el.addClass('state-installed');
		}
	}

	onClickInstallBtn(){
		console.log('MercurySection.onClickInstallBtn');
		let appurl = "https://chrome.google.com/webstore/detail/bphfkpkoljdicakaokfbjiaamholpgjf";
		chrome.webstore.install(
			appurl, 
			()=> this.$el.addClass('state-installed'), 
			()=> console.log('failure')
		)	
	}

	onClickLaunchBtn(){
		console.log('MercurySection.onClickLaunchBtn');
		var w = window.open('http://lightpaintlive.com/mercury');
		setTimeout(w.close(), 100);
	}

}