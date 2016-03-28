import CoreView from '../core/core-view.es6.js'

export default class MercurySection extends CoreView {

	constructor(){
		// console.log('MercurySection.constructor');
		this.setElement($('#mercury'));
		this.props = {
			events: {
				'click 		.launch-btn': 		'onClickLaunchBtn',
				'click 		.launch-pro-btn': 	'onClickLaunchBtn',
				'click 		.mode-btn': 		'onClickModeBtn',
				'click 		.modes video': 		'onClickModesVideo',
				'click 		.gallery .button': 	'onClickGalleryNav',
				'click 		.gallery img': 		'onClickGalleryThumb',
			}
		};
		super();
	}

	initialize(){
		this.$thumbs = this.$('.thumbs');

		$('body').on('touchstart', e => {
			this.onClickModesVideo(e)
		})
	}

	onClickGalleryThumb(e){
		// console.log('onClickGalleryThumb');
		var src = "./assets/images/gallery/" + e.currentTarget.getAttribute('data-src') + ".jpg";

		window.open(src, '_blank');
	}

	onClickGalleryNav(e){
		// console.log('onClickGalleryButton', e);
		var btn = e.currentTarget;
		var currLeft = parseInt(this.$thumbs.css("left"));

		var direction = -1;
		if(e.currentTarget.classList.contains('left')){
			direction = 1;
		}

		var newLeft = direction * 276 + currLeft;
		newLeft = Math.max(-this.$thumbs.width()+this.$el.width(), newLeft);
		newLeft = Math.min(0, newLeft);
		this.$thumbs.css({left: newLeft + 'px' });

	}

	onClickLaunchBtn(e){
		console.log('MercurySection.onClickLaunchBtn');
		// triggers a url handler that will open the app
		var pro = '';
		if(e.currentTarget.classList.contains('launch-pro-btn')) pro = 'pro.html';
		var w = window.open(location.origin + location.pathname + 'mercury-app/' + pro, '_blank');

		// try closing original window if the app opens on desktop
		setTimeout(function(){
			try {
				console.log(w.location.href)
				if(w.location.href === "about:blank"){
					w.close();
				}
			}catch(e){
				// app isn't installed, do nothing
			}
		}, 2000);
	}

	onClickModesVideo(){
		// console.log('onClickModesVideo')
		this.$('.modes video')[0].play();
	}

	onClickModeBtn(e){
		console.log("onClickModeBtn");
		this.$('.modes .selected').removeClass('selected');
		var $targ = $(e.currentTarget).addClass('selected');
		var className = $targ.html();
		this.$('.modes .'+className).addClass('selected');
		this.$('.modes video')[0].outerHTML = `
			<video class="mode" autoplay muted loop>
				<source src="assets/${className}.webm" type="video/webm">
				<source src="assets/${className}.mp4" type="video/mp4">
			</video>
		`;
		this.$('.modes video')[0].play();
	}

}