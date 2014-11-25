var app = {

	// https://github.com/lukehoban/es6features

	init: function(){
		console.log('app.init');

		// Testing 6to5 compiler
		var name = "Bob", time = "today";
		var string = `
			Hello ${name}, how are you ${time}?
		`;
		console.log(string);
	}

};

module.exports = app;