import CoreView from '../core/core-view.es6.js'

export default class MercurySection extends CoreView {

	constructor(){
		this.setElement($('#mercury'));
		this.props = {
			events: {
				'click 		.mode-btn': 		'onClickModeBtn',
			}
		}
		super()
	}

	initialize(){
		this.$thumbs = this.$('.thumbs')
		this.$ytIframe = this.$('iframe')
		$(window).on('resize', this.onResize.bind(this))
		this.onResize()
	}

	onResize(e){
		// apply correct aspect ratio to youtube iframe
		this.$ytIframe.css({
			height: this.$el.width() * 9 / 16
		})
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

	onClickModeBtn(e){
		this.$('.modes .selected').removeClass('selected');
		var $targ = $(e.currentTarget).addClass('selected');
		var className = $targ.html();
		this.$('.modes .'+className).addClass('selected');
		this.$('.modes img')[0].src = `assets/images/${className}.gif`
	}
}