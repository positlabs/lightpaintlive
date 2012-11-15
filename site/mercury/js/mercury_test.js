window.onload = init;

var engine, post, userStream;
var renderFunction = {};
var gui, controls;
var $window;

function init() {
	$window = $(window);

	if (!J3D.Capabilities.webgl) alert("WebGL isn't supported! Update Chrome to the latest version.");

	J3D.UserStream(function (stream) {
		userStream = stream;

		engine = new J3D.Engine(undefined, undefined, {preserveDrawingBuffer:true});

		resize = engine.resize;
		engine.setClearColor(J3D.Color.black);

		post = new J3D.Persistence(engine);
		post.vTexture = new J3D.Texture(userStream);

		changeMode("webcamPreview");

	});
}

function changeMode(mode) {
	console.log("changeMode", mode);
	J3D.Loader.loadGLSL("./shaders/" + mode + ".glsl", function (s) {
		post.blendFilter = s;

		post.blendFilter.exposure = 20 / 100;

		renderFunction = draw;
		draw();
	});
}


function draw() {
	requestAnimationFrame(renderFunction);
//	post.blendFilter.exposure = controls.exposure / 100;

	post.render();
}