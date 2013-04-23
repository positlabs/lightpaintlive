var LPL = {};
LPL.Mercury = function () {

	var post, // effect used for webcam preview
		userStream,
		engine,
		persistence, // effect used for painting
		renderTimer,
		userStreamTx, // webcam feed texture
		currentShader,
		resizer, // holder for the engine resizer function
		shaders = {}, // collection of loaded shaders
		shaderSpecificGUI = [], // array of temporary gui elements to be removed when mode changes
		gui,
		me = this;

	// shader-specific variables
	this.kaleidoSplit = 2;

	this.state = "notPainting";
	this.exposure = 20;
	this.resolution = "800x600";
	this.fps = 30;
	this.mode = "screen";

	this.init = function () {
		console.log("Mercury." + "init()", arguments);

		engine = new J3D.Engine(undefined, undefined, {preserveDrawingBuffer:true});
		engine.setClearColor(J3D.Color.black);

		function setup(shader) {
			shaders["WebcamShader"] = shader;
			J3D.UserStream(function (stream) {
				userStream = stream;

				userStreamTx = new J3D.Texture(stream);

				persistence = new J3D.Persistence(engine);
				persistence.vTexture = userStreamTx;
				persistence.fboN = new J3D.FrameBuffer();
				persistence.fboA = new J3D.FrameBuffer();
				persistence.fboB = new J3D.FrameBuffer();

				makeGUI();
				loadShaders(makeShaderControls);

				post = new J3D.Postprocess(engine);
				post.filter = shader;
				post.render = function () {
					J3D.Time.tick();
					userStreamTx.update();
					post.renderEffect(userStreamTx.tex);
				};

				resizer = engine.resize;
				engine.resize = {};
				me.changeResolution(me.resolution);
				me.new();
			});
		}

		J3D.Loader.loadGLSL("shaders/WebcamShader.glsl", setup);

		window.addEventListener("resize", onResize);
	};

	function loadShaders(callback) {
		console.log("loadShaders." + "loadShaders()", arguments);
		for (var i = 0, max = LPL.Mercury.MODES.length; i < max; i++) {
			J3D.Loader.loadGLSL("shaders/" + LPL.Mercury.MODES[i] + ".glsl", loaded);
		}

		var loadCount = 0;

		function loaded(shader) {
			console.log("loaded." + "loaded()", arguments);

			var modeName = LPL.Mercury.MODES[loadCount];
			shaders[modeName] = shader;
			loadCount++;
			checkDone();

		}

		function checkDone() {
			if (loadCount == LPL.Mercury.MODES.length) {
				currentShader = shaders["screen"];
				persistence.blendFilter = currentShader;
				callback();
			}
		}
	}

	//TODO - make shader-specific controls
	function makeShaderControls() {
		shaders["kaleido"].controls = {
			create:function (datgui) {
				persistence.blendFilter.arg1 = me.kaleidoSplit;
				var kaleidoNum = datgui.add(me, "kaleidoSplit", 2, 8);
				kaleidoNum.step(1);
				kaleidoNum.onChange(function () {
					persistence.blendFilter.arg1 = me.kaleidoSplit * .25;
				});
				shaderSpecificGUI.push(kaleidoNum);
			}
		}
	}

	this.changeResolution = function (resolution) {
		console.log("changeResolution", resolution);

		var width = resolution.split("x")[0];
		var height = resolution.split("x")[1];

		// have to keep reference to engine.resize so we can use it,
		// but also need to disable so it doesn't automatically fire when the window resizes
		engine.resize = resizer;
		engine.resize(width, height);
		engine.resize = function () {
		};

		onResize();
	};

	function onResize() {
		var width = me.resolution.split("x")[0],
			height = me.resolution.split("x")[1],
			scale = Math.min(window.innerWidth / width, window.innerHeight / height);

		var canvas = document.getElementsByTagName("canvas")[0];
		canvas.style.width = width * scale + "px";
		canvas.style.height = height * scale + "px";
		canvas.style.marginLeft = -width / 2 * scale + "px";
		canvas.style.marginTop = -height / 2 * scale + "px";
	}

	this.start = function () {
//		console.log("Mercury." + "start()", arguments);

		me.state = "painting";

		persistence.blendFilter = currentShader;
		persistence.blendFilter.exposure = me.exposure * .01;

		clearTimeout(renderTimer);
		renderTimer = setInterval(function () {
			persistence.render();
		}, 1000 / me.fps);

	};

	this.stop = function () {
//		console.log("Mercury." + "stop()", arguments);
		me.state = "notPainting";
		clearTimeout(renderTimer);
	};

	this["start / stop"] = function () {
		me.state == "painting" ? me.stop() : me.start();
	};

	this.new = function () {
//		console.log("Mercury."+"new()", arguments);
		me.stop();
		persistence.fboN = new J3D.FrameBuffer();
		persistence.fboA = new J3D.FrameBuffer();
		persistence.fboB = new J3D.FrameBuffer();

		renderTimer = setInterval(function () {
			post.render();
		}, 1000 / me.fps);
	};

	/**
	 *  changes the shader to use during painting
	 */
	this.changeMode = function (mode) {
		console.log("Mercury." + "changeMode()", arguments);
		currentShader = shaders[mode];

		if (shaderSpecificGUI.length > 0) {
			for (var i = 0, max = shaderSpecificGUI.length; i < max; i++) {
				gui.remove(shaderSpecificGUI[i]);
			}
			shaderSpecificGUI = [];
		}

		if (currentShader.controls) {
			currentShader.controls.create(gui);
		}
	};

	function makeGUI() {

		//TODO - move controls outside of this class

		gui = new dat.GUI();
		gui.remember(me);

		var res = gui.add(me, "resolution", LPL.Mercury.RESOLUTIONS);
		res.onChange(me.changeResolution);

		var bmodes = gui.add(me, "mode", LPL.Mercury.MODES);
		bmodes.onChange(me.changeMode);

		var xposur = gui.add(me, 'exposure', 1, 100);
		xposur.onFinishChange(function () {
			persistence.blendFilter.exposure = me.exposure * .01;
		});

		var framerate = gui.add(me, 'fps', 1, 120);
		framerate.onFinishChange(function () {
			if (me.state != "painting")
				me.new();
		});
//		gui.add(me, 'save');
		gui.add(me, 'new');

		gui.add(me, "start / stop");

	}

};

LPL.Mercury.MODES = ["screen", "add", "overlay", "softlight", "kaleido"];
LPL.Mercury.RESOLUTIONS = ["320x240", "640x480", "800x600", "1024x768", "1280x720"];
