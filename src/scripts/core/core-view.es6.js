import Backbone from 'backbone';

export default class CoreView extends Backbone.View {

	/**
		used for setting per-instance properties in the constructor function

		this.props = {
			id: 'josh',
			events: {...}
			model: new Backbone.Model()
		}
	*/
	set props(newProps){
		// console.log('set CoreView.props', newProps);
		for(let p in newProps) this[p] = newProps[p];
	}

}

