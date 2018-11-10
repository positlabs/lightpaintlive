
import MercurySection from './views/mercury-section.es6.js'
import FooterView from './views/footer-view.es6.js'
import '../../node_modules/zepto/zepto.min.js' // zepto's package.json is not working...
import _ from 'lodash'
window._ = _
import Backbone from 'backbone'
Backbone.$ = $

export default class App {
	constructor(){
		new MercurySection()
		new FooterView()
	}
}
