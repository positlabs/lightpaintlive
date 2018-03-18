
import MercurySection from './views/mercury-section.es6.js'
import FooterView from './views/footer-view.es6.js'
import HeaderView from './views/header-view.es6.js'
import './analytics.js'
import checkAutoplaySupport from './lib/is-autoplay-supported.js'
import '../../node_modules/zepto/zepto.min.js' // zepto's package.json is not working...
import _ from 'lodash'; window._ = _
import Backbone from 'backbone'
Backbone.$ = $

export default class App {

	constructor(){
		this.headerView = new HeaderView()
		this.headerView.on('resize', ()=>this.onResize)

		new MercurySection()
		new FooterView()

		this.$header = $('header')
		this.$footer = $('footer')
		this.$scrollableContent = $('.scrollable-content')

		window.addEventListener('resize', (e)=>this.onResize(e))
		this.onResize()
	}

	onResize(){
		this.$scrollableContent.css({
			height: window.innerHeight - this.$footer.height() - this.$header.height(),
			top: this.$header.height()
		})
	}
}
