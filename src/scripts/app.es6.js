
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

		checkAutoplaySupport()
		setTimeout(()=>{ // waiting for other higher priority stuff to load

			var bgvid = `
				<video id="bg-video" autoplay loop muted>
					<source src="assets/grinder.webm" type="video/webm">
					<source src="assets/grinder.mp4" type="video/mp4">
				</video>
			`

			$('.video-container')[0].innerHTML += bgvid
			setTimeout(()=>{
				var vid = document.getElementById('bg-video')
				vid.addEventListener('play', ()=>{
					vid.playbackRate = .5
				})
			}, 1)

		}, 6000)

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
