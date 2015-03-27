import CoreView from '../core/core-view.es6.js'

export default class MercurySection extends CoreView {

	constructor(){
		// console.log('MercurySection.constructor');
		this.setElement($('#mercury'));
		this.props = {
			events: {
				'click 		.launch-btn': 		'onClickLaunchBtn',
				'click 		.mode-btn': 		'onClickModeBtn',
				'click 		.modes video': 		'onClickModesVideo'
			}
		};
		super();
	}

	initialize(){
		
	}

	onClickLaunchBtn(){
		console.log('MercurySection.onClickLaunchBtn');
		// triggers a url handler that will open the app
		var w = window.open('http://lightpaintlive.com/mercury-app/', '_blank');
		setTimeout(function(){
			try {
				console.log(w.location.href)
				if(w.location.href == "about:blank"){
					w.close();
				}
			}catch(e){
				// app isn't installed, do nothing
			}
		}, 100);
	}

	onClickModesVideo(){
		this.$('.modes video')[0].play();
	}

	onClickModeBtn(e){
		console.log("onClickModeBtn");
		this.$('.modes .selected').removeClass('selected');
		var $targ = $(e.currentTarget).addClass('selected');
		var className = $targ.html();
		this.$('.modes .'+className).addClass('selected');
		// this.$('.modes video source[type="video/mp4"]').attr('src', 'assets/' + className + '.mp4');
		// this.$('.modes video source[type="video/webm"]').attr('src', 'assets/' + className + '.webm');
		this.$('.modes video')[0].outerHTML = `
			<video class="mode" autoplay muted loop>
				<source src="assets/${className}.webm" type="video/webm">
				<source src="assets/${className}.mp4" type="video/mp4">
			</video>
		`;
		this.$('.modes video')[0].play();
	}

}