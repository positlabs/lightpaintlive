window.onload = init;

var engine, post, userStream;
var renderFunction = {};
var gui;
var $window;

function init() {
	$window = $(window);

	if (!J3D.Capabilities.webgl) alert("WebGL isn't supported! Update Chrome to the latest version.");
		engine = new J3D.Engine(undefined, undefined, {preserveDrawingBuffer:true});



		var setup = function(p) {
			J3D.UserStream(function(stream) {

				var ctex = new J3D.Texture(stream);

				p.colorOffset = [0.0, 0.0, 0.0];

				post = new J3D.Postprocess(engine);
				post.filter = p;
				post.render = function() {
					J3D.Time.tick();
					ctex.update();
					this.renderEffect(ctex.tex);
				}

			});
		}

		J3D.Loader.loadGLSL("shaders/webcamPreview.glsl", setup);


}
