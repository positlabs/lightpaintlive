var post;
var userStream;

window.onload = function(){setup(startRender)};

function setup(callback) {
	console.log("setup()");
	engine = new J3D.Engine(undefined, undefined, {preserveDrawingBuffer:true});
	engine.setClearColor(J3D.Color.black);

	var setup = function (p) {
		J3D.UserStream(function (stream) {
			userStream = stream;

			var ctex = new J3D.Texture(stream);

			p.colorOffset = [0.0, 0.0, 0.0];

			post = new J3D.Postprocess(engine);
			post.filter = p;
			post.render = function () {
				J3D.Time.tick();
				ctex.update();
				post.renderEffect(ctex.tex);
			};

			callback();
		});
	};

	J3D.Loader.loadGLSL("test/VideoEffect.glsl", setup);
}

function render(interactor) {
	console.log('render');

//	post.filter.colorOffset = [interactor.centerX * -0.02, 0.0, interactor.centerY * 0.02];
//	post.filter.mousePos = [interactor.centerX * 2, interactor.centerY * 2];
	post.render();
}

var renderTimer;
function startRender(){
	changeResolution("800x600");
	renderTimer = setInterval(post.render, 1000/24);
}




function changeResolution(resolution) {
	console.log("changeResolution", resolution);
	var $window = $(window);
	var width = resolution.split("x")[0];
	var height = resolution.split("x")[1];

	engine.resize(width, height);
	engine.resize = function () {
	};

	$canvas = $("#mercury canvas");
	$canvas.css("margin-left", -width / 2 + "px");
	$canvas.css("margin-top", -height / 2 + "px");
	$window.trigger("resize");
}