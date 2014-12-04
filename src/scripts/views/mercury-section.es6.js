
export default class MercurySection {

	constructor(){

		this.$el = $('#mercury');

		var $installBtn = this.$el.find('.install-btn');
		$installBtn.click(()=> 
			chrome.webstore.install("https://chrome.google.com/webstore/detail/bphfkpkoljdicakaokfbjiaamholpgjf", 
				function(){console.log('success')}, 
				function(){console.log('failure')})
			);

		if (chrome.app.isInstalled) {

			this.$el.addClass('state-installed');

			// TODO: show launch button
			// http://lightpaintlive.com/mercury
			// launch button will simply open this url, and it will be handled by the apps url handler if it is installed.
			// if not installed, and installation detection failed for some reason, it will just open mercury alpha
			
		}else{
			this.$el.addClass('state-not-installed');
		}
		
		//TODO: also listen for install state change

	}

}