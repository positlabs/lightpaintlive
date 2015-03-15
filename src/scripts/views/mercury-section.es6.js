import CoreView from '../core/core-view.es6.js'

export default class MercurySection extends CoreView {

	constructor(){
		// console.log('MercurySection.constructor');
		this.setElement($('#mercury'));
		this.props = {
			events: {
				'mousedown 	.install-btn': 		'onClickInstallBtn',
				'click 		.launch-btn': 		'onClickLaunchBtn',
				'click 		.mode-btn': 		'onClickModeBtn',
			}
		};
		super();
	}

	initialize(){
		// console.log('MercurySection.initialize');
		if (chrome.app.isInstalled) {
			this.$el.addClass('state-installed');
		}
	}

	onClickInstallBtn(e){
		// console.log('MercurySection.onClickInstallBtn');

		//TODO: only do this on chrome. maybe show warning if other browser.
		e.preventDefault();
		let appurl = "https://chrome.google.com/webstore/detail/bphfkpkoljdicakaokfbjiaamholpgjf";
		chrome.webstore.install(
			appurl, 
			()=> this.$el.addClass('state-installed'), 
			()=> console.log('failure')
		);
	}

	onClickLaunchBtn(){
		// console.log('MercurySection.onClickLaunchBtn');
		// triggers a url handler that will open the app
		var w = window.open('http://lightpaintlive.com/mercury-app');
		setTimeout(w.close(), 100);
	}

	onClickModeBtn(e){
		console.log("onClickModeBtn");
		this.$('.modes .selected').removeClass('selected');
		var $targ = $(e.currentTarget).addClass('selected');
		var className = $targ.html();
		this.$('.modes .'+className).addClass('selected');
		this.$('.modes video source[type="video/mp4"]').attr('src', 'assets/' + className + '.mp4');
		this.$('.modes video source[type="video/webm"]').attr('src', 'assets/' + className + '.webm');
		this.$('.modes video')[0].outerHTML = `
			<video class="mode" autoplay muted loop>
				<source src="assets/${className}.webm" type="video/webm">
				<source src="assets/${className}.mp4" type="video/mp4">
			</video>
		`;
	}

}