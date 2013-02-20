var LPL = {};
LPL.Mercury = function () {

	var post,
		userStream,
		engine,
		renderTimer,
		currentShader,
		shaders = {}, // collection of loaded shaders
		me = this;

	this.exposure = 20;
	this.resolution = "800x600";
	this.fps = 30;
	this.mode = "screen";

	this.init = function () {
		console.log("setup()");

		engine = new J3D.Engine(undefined, undefined, {preserveDrawingBuffer:true});
		engine.setClearColor(J3D.Color.black);

		var setup = function (shader) {
			shaders["WebcamShader"] = shader;
			J3D.UserStream(function (stream) {
				userStream = stream;

				var ctex = new J3D.Texture(stream);

				post = new J3D.Postprocess(engine);
				post.filter = shader;
				post.render = function () {
					J3D.Time.tick();
					ctex.update();
					post.renderEffect(ctex.tex);
				};

				me.changeResolution(me.resolution);
				startRender();
			});
		};

		J3D.Loader.loadGLSL("test/WebcamShader.glsl", setup);
		makeGUI();
	};

	function startRender() {
		renderTimer = setInterval(post.render, 1000 / me.fps);
	}

	this.changeResolution = function (resolution) {
		console.log("changeResolution", resolution);

		var $window = $(window);
		var width = resolution.split("x")[0];
		var height = resolution.split("x")[1];

		//TODO - maybe do this on window resize, too.
		engine.resize(width, height);

		$canvas = $("#mercury canvas");
		$canvas.css("margin-left", -width / 2 + "px");
		$canvas.css("margin-top", -height / 2 + "px");
		$window.trigger("resize");
	};

	this.start = function () {
		console.log("Mercury."+"start()", arguments);

		engine = new J3D.Engine(undefined, undefined, {preserveDrawingBuffer:true});
		engine.setClearColor(J3D.Color.black);
		console.log("engine",engine);

		post = new J3D.Persistence(engine);
		post.vTexture = new J3D.Texture(userStream);
		post.blendFilter = currentShader;
		post.blendFilter.exposure = me.exposure;

		clearTimeout(renderTimer);
		renderTimer = setInterval(function(){
			post.render();
		}, 1000 / me.fps);

		startRender();
	};

	this.stop = function () {

	};

	/**
	 *  changes the shader to use during painting
	 */
	this.changeMode = function (mode) {
		console.log("Mercury."+"changeMode()", arguments);
		if (shaders[mode] == undefined) {
			J3D.Loader.loadGLSL("../src/shaders/" + mode + ".glsl", function (shader) {
				shaders[mode] = shader;
				doChange();
			});
		}else doChange();

		function doChange(){
			currentShader = shaders[mode];
		}
	};

	function makeGUI() {
		var resolutions = ["320x240", "640x480", "800x600", "1024x768", "1280x720"],
			modes = ["screen", "add"];

		//TODO - move controls outside of this class
		//TODO - make dat.gui controls

		//fps
		//exposure

		var gui = new dat.GUI();

		var res = gui.add(me, "resolution", resolutions);
		res.onChange(me.changeResolution);

		var bmodes = gui.add(me, "mode", modes);
		bmodes.onChange(me.changeMode);

		gui.add(me, "start");
		gui.add(me, "stop");

	}

};