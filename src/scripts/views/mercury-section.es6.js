import CoreView from '../core/core-view.es6.js'

export default class MercurySection extends CoreView {

	constructor(){
		this.setElement($('#mercury'))
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

	onClickModeBtn(e){
		this.$('.modes .selected').removeClass('selected')
		var $targ = $(e.currentTarget).addClass('selected')
		var className = $targ.html()
		this.$('.modes .'+className).addClass('selected')
		this.$('.modes img')[0].src = `assets/images/${className}.gif`
	}
}