import Backbone from 'backbone';

export default class Router extends Backbone.Router {

	initialize(){
		Backbone.history.start();
	}

}