window.onload = init;

var states = {
	"webcamPreview":"webcamPreview",
	"painting":"painting",
	"stopped":"stopped"
};
var state = states.webcamPreview;

var modes = {
	"screen":"screen",
	"add":"add",
	"overlay":"overlay",
	"softlight":"softlight",
	"kaleido2":"kaleido#0.5",
	"kaleido4":"kaleido#1",
	"kaleido6":"kaleido#3",
	"kaleido8":"kaleido#4",
	"sandbox":"sandbox"
};
var compositor = modes.screen;

var shaderArgs = [];

var engine, post, userStream;
var renderFunction = {};
var gui, controls;
var resize;
var resolutions = ["320x240", "640x480", "800x600", "1024x768", "1280x720"];
var $window, $canvas;

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

		$window.resize(function () {
			$canvas = $("#mercury canvas");

			if ($canvas[0] != undefined) {
				var scaleX = $window.width() / controls.resolution.split("x")[0];
				var scaleY = $window.height() / controls.resolution.split("x")[1];
				var scale = Math.min(scaleX, scaleY);
				$canvas.css("-webkit-transform", "scaleX(" + -scale + ") scaleY(" + scale + ")");
			}
		});

		createControls();
		changeMode(states.webcamPreview);

	});
}


function createControls() {

	var Controls = function () {
		this.resolution = resolutions[2];
		this.exposure = 20;
		this.save = savePainting;
		this.new = newPainting;
		this.mode = modes.screen;
		this["start / stop"] = togglePainting;
	};

	controls = new Controls();
	gui = new dat.GUI();
	gui.remember(controls);
	var res = gui.add(controls, "resolution", resolutions);
	res.onChange(changeResolution);
	var _mode = gui.add(controls, "mode", modes);
	_mode.onChange(changeCompositor);
	res.onChange(changeResolution);
	gui.add(controls, 'exposure', 0, 100);
	gui.add(controls, 'save');
	gui.add(controls, 'new');
	gui.add(controls, 'start / stop');

	// apply remembered settings
	changeCompositor(controls.mode);

	setTimeout(function () {
		changeResolution(controls.resolution);
	}, 3000);

	$(document).on("keydown", function (e) {
		var key = e.keyCode;
		if (key == 32) togglePainting();
		else if (key == 78) newPainting();
		else if (key == 83) savePainting();
	});

}


function changeCompositor(shaderName) {

	var args = shaderName.split("#");
	compositor = args[0];
	shaderArgs = args.splice(1, args.length);

}

function changeMode(mode) {
	console.log("changeMode", mode);
	J3D.Loader.loadGLSL("./shaders/" + mode + ".glsl", function (s) {
		post.blendFilter = s;

		post.blendFilter.exposure = controls.exposure / 100;

		for (var i = 0; i < shaderArgs.length; i++) {
			post.blendFilter["arg" + (i + 1).toString()] = shaderArgs[i];
		}

		renderFunction = draw;
		draw();
	});
}

function changeResolution(resolution) {
	console.log("changeResolution", resolution);
	var width = resolution.split("x")[0];
	var height = resolution.split("x")[1];

	engine.resize = resize;
	engine.resize(width, height);
	engine.resize = function () {
	};

	$canvas = $("#mercury canvas");
	$canvas.css("margin-left", -width / 2 + "px");
	$canvas.css("margin-top", -height / 2 + "px");

	newPainting();
	$window.trigger("resize");
}

function newPainting() {
	stopPainting();
	state = states.webcamPreview;

	post.blendFilter.exposure = 0;

	post.fboN = new J3D.FrameBuffer();
	post.fboA = new J3D.FrameBuffer();
	post.fboB = new J3D.FrameBuffer();

	post.render();
	post.blendFilter.exposure = controls.exposure / 100;

	changeMode(states.webcamPreview);
}

function startPainting() {
	console.log("startPainting");
	state = states.painting;
	changeMode(compositor);
}

function stopPainting() {
	console.log("stopPainting");
	if (state == states.painting) state = states.stopped;
	renderFunction = function () {
	};
}

function togglePainting() {
	console.log("togglePainting");
	state == states.painting ? stopPainting() : startPainting();
}

function draw() {
	requestAnimationFrame(renderFunction);
//	post.blendFilter.exposure = controls.exposure / 100;
//	post.blendFilter.arg1 = shaderArgs[0];

	post.render();
}

function savePainting() {
	if (state == states.painting) {
		stopPainting();
		setTimeout(save, 1000);
	} else save();
}


function save() {
	var canvas = $("canvas")[0];

	var width = canvas.width;
	var height = canvas.height;
	var pixelData = new Uint8Array(width * height * 4);
	gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixelData);

	var tempcanvas = document.createElement('canvas');
	tempcanvas.height = canvas.height;
	tempcanvas.width = canvas.width;
	var tempcontext = tempcanvas.getContext('2d');

	var imgdata = tempcontext.getImageData(0, 0, canvas.width, canvas.height);

	for (var i = 0; i < imgdata.data.length / 4; i++) {
		for (var j = 0; j < 4; j++) {
			imgdata.data[i * 4 + j] = pixelData[imgdata.data.length - i * 4 + j - 4];
		}
	}

	tempcontext.putImageData(imgdata, 0, 0);

	window.open(tempcanvas.toDataURL(), "LPL Mercury output", "width=400, height=300");
}
