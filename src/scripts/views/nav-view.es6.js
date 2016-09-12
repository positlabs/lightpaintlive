import CoreView from '../core/core-view.es6.js'

export default class NavView extends CoreView {

	constructor(){
		this.setElement($('nav'))
		super()
	}

	initialize(){}
}