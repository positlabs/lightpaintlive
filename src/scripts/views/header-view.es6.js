import CoreView from '../core/core-view.es6.js';

export default class HeaderView extends CoreView {

	constructor(){
		this.setElement($('header'));
		this.$scroller = $('.scrollable-content');
		super();
	}

	initialize(){

		// var isLarge = false;
		// setInterval(()=>{

		// 	if(this.$scroller.scrollTop() <= 60 && isLarge == false){

		// 		isLarge = true;
		// 		this.el.classList.add('large');
		// 		document.body.classList.add('header-large');
		// 		this.trigger('resize');
			
		// 	}else if(this.$scroller.scrollTop() > 60 && isLarge == true){

		// 		isLarge = false;
		// 		this.el.classList.remove('large');
		// 		document.body.classList.remove('header-large');
		// 		this.trigger('resize');
		// 	}

		// }, 300);
	}

}