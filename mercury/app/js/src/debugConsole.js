var consoleHolder = console;
function debug(bool){
	if(!bool){
		consoleHolder = console;
		console = {};
		console.log = function(){};
	}else
		console = consoleHolder;
}

debug(false);