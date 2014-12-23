import Backbone from 'backbone';

export default class CoreEvents {
	constructor(){
		Object.assign(this, Backbone.Events);
	}
}