
import CoreView from '../core/core-view.es6.js'

export default class FooterView extends CoreView {

	constructor(){
		// console.log('FooterView.constructor')
		this.setElement($('footer'))
		super()
	}

	initialize(){
		// console.log('FooterView.initialize');
		// fb like button
		(function(d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0]
			if(d.getElementById(id)) return
			js = d.createElement(s)
			js.id = id
			js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=331545326882067";
			fjs.parentNode.insertBefore(js, fjs)
		}(document, 'script', 'facebook-jssdk'))
	}
}
		