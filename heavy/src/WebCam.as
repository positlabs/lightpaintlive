package{
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.BlendMode;
	import flash.display.Shader;
	import flash.display.ShaderJob;
	import flash.display.Sprite;
	import flash.events.ShaderEvent;
	import flash.events.TimerEvent;
	import flash.filters.ShaderFilter;
	import flash.geom.ColorTransform;
	import flash.media.Camera;
	import flash.media.Video;
	import flash.utils.ByteArray;
	import flash.utils.Timer;
	
	import utils.FPSCounter;
	import utils.FileSaver;
	
	public class WebCam extends Sprite{	
		
		[Bindable]
		public static var video : Video;
		private var camera : Camera;
		private var cameraBmd : BitmapData;
		private var bmp : Bitmap;
		
		public static var selectedCamIndex : int;
		
		/* The amount of light captured */
		private static var _intensity : Number = 50/600;
		
//		[Embed("pixelbender/lplExposureBrightLimit.pbj", mimeType="application/octet-stream")]
		[Embed("pixelbender/lplScreen.pbj", mimeType="application/octet-stream")]
		private var LPLFilter : Class;	
		
		private var shader : Shader;
		private var shaderfilter : ShaderFilter;
		private var shaderJob : ShaderJob;
		
		private var painting : Boolean;
		
		private var startingNewPainting : Boolean = true;
		private var initialUndo : Boolean = true;
		private var initialRedo : Boolean = true;
		private var undoStates : Vector.<BitmapData> = new Vector.<BitmapData>();
		private var redoStates : Vector.<BitmapData> = new Vector.<BitmapData>();
		
//		public static var record : Boolean;
		public var fs : FileSaver = FileSaver.getInstance();

//		public var videoChunksUndo : Vector.<Vector.<BitmapData>> = new Vector.<Vector.<BitmapData>>();
//		private var videoChunksRedo : Vector.<Vector.<BitmapData>> = new Vector.<Vector.<BitmapData>>();

		private static var _fps : Number = 24;
		private static var fpsCounter : FPSCounter = new FPSCounter();
//		private var saveTimer : Timer = new Timer(1000/_fps);
		private var updateTimer : Timer = new Timer(1000/_fps);
		
		/** boolean for the fade effect */
		public static var fade : Boolean = false;
		private static var _fadeStrength : Number = 4990;
		private static var fader : ColorTransform = new ColorTransform(_fadeStrength/5000,_fadeStrength/5000,_fadeStrength/5000,1,0,0,0,0);
		
		//** weather or not to show the underlayer video */
		private static var _underlayer : Boolean;

		/** value to feed to the pixel bender exposure algorithm */
		private static var _lowerLimit : Number = 0;
		
		/** value to feed to the pixel bender exposure algorithm */
//		private static var _upperLimit : Number = 1;

		/** value to feed to the pixel bender exposure algorithm */
		//private static var _brightnessLimit : Number = 0;

		
		public static var hueEnabled : Boolean;
		private static var hueShifter : ColorTransform = new ColorTransform(1,1,1,1,0,0,0,0);
		private static var hueR : int;
		private static var hueG : int;
		private static var hueB : int;

		public function WebCam(w : int, h : int, camIndex : int = -1):void {
			selectedCamIndex = Math.max(camIndex, 0);
			
			// get default camera if index isn't specified
			if(camIndex == -1)camera = Camera.getCamera();
			else camera = Camera.getCamera(camIndex.toString());
			
			if(camera != null){
				video = null;
				video = new Video(w, h);
				video.deblocking = 1; //deblocking off
				video.smoothing = false;
				camera.setMode(w, h, _fps, true);
				video.attachCamera(camera);

				// bitmap to draw to
				var bmd : BitmapData = new BitmapData(w, h, false, 0x000);
				bmp = new Bitmap(bmd);
				addChild(bmp);
				bmp.scaleX = -1;
				bmp.x = w;
				bmp.blendMode = BlendMode.LIGHTEN;
				
				video.scaleX = -1;
				video.x = video.width;
				addChild(video);
				
				if(_underlayer)underlayer(true);
				
				cameraBmd = bmd.clone();
				
//				videoChunksUndo = new Vector.<Vector.<BitmapData>>();
	
//				saveTimer.addEventListener(TimerEvent.TIMER, saveFrame);
				updateTimer.addEventListener(TimerEvent.TIMER, update);
				
				init();
			}else{
				// notify user
//				LightPaintLiveDesktop.notifyCamera();
				trace("CAMERA IS NULL!!!!!!!!");
			}
		}
		
		public function savePainting():void{
			fs.savePainting(bmp);
		}
//		public function saveVideo():void{
//			fs.saveVideo(videoChunksUndo);
//		}
//		protected function saveFrame(event:TimerEvent):void{
//			fs.saveFrame(bmp.bitmapData, videoChunksUndo);
//		}
		
		public static function fadeStrength(value : int):void{
			_fadeStrength = 5000-value;
			fader = new ColorTransform(_fadeStrength/5000,_fadeStrength/5000,_fadeStrength/5000,1,0,0,0,0);
		}
		public static function hueShift(r : Number, g : Number, b : Number):void{
			hueR = r;
			hueG = g;
			hueB = b;
			hueShifter = new ColorTransform(1,1,1,1,hueR,hueG,hueB,0);
		}
		
		/* sets up the shader */
		private function init():void{
			shader = new Shader(new LPLFilter() as ByteArray);
			shader.data.intensity.value = [_intensity];
			shader.data.lowerLimit.value = [_lowerLimit];
//			shader.data.upperLimit.value = [_upperLimit];
			//shader.data.brightLimit.value = [_brightnessLimit];
			shaderJob = new ShaderJob();
		}
		
		
		
		private function update(e:TimerEvent):void{
			if((fade) && updateTimer.currentCount % 2 == 0)
				bmp.bitmapData.colorTransform(bmp.bitmapData.rect, fader);
			
//			if(fs.saveToDisk)
//				fs.writeFrame(bmp.bitmapData);

			if(hueEnabled)
				cameraBmd.draw(video, null, hueShifter);
			else
				cameraBmd.draw(video);
			applyShader();
		}
		
		private function applyShader():void{
			bmp.bitmapData.lock();
			
			// supply canvas and camera
			shader.data.src.input = bmp.bitmapData;
			shader.data.src2.input = cameraBmd;

			//create a shader job
			shaderJob = new ShaderJob(shader, bmp.bitmapData);
				
			//add listener for job completion
			shaderJob.addEventListener(ShaderEvent.COMPLETE, unlock);
			
			//run job
			shaderJob.start();
		}

		private function unlock(e:ShaderEvent):void{
			bmp.bitmapData.unlock();
		}
		
		public function startPainting():void{
			// only save state here if starting a new painting
			if(startingNewPainting){
				undoStates.push(bmp.bitmapData.clone());
				startingNewPainting = false;
			}

//			if(record){
//				
//				if(fs.saveToDisk){
//					fs.makeNewFlvFile(bmp.bitmapData);
//				}else{
//					// add a new video chunk to record this segment to
////					videoChunksUndo.push(new Vector.<BitmapData>());
//					saveTimer.start();
//				}
//			}

			preview(false);
			
			painting = true;
			updateTimer.start();
			
			// clear redo states
			redoStates = new Vector.<BitmapData>();

		}
		public function stopPainting():void{
			painting = false;
			shaderJob.cancel();

			// save the state
			undoStates.push(bmp.bitmapData.clone());
			
			initialUndo = true;
			initialRedo = true;
			
//			if(record){
//				saveTimer.stop();
//				if(fs.saveToDisk)
//					fs.closeFile();
//			}
			updateTimer.stop();
		}
		
		/** @return true if more undo states are available */
		public function undo() : Boolean{
			
			// sets the image to the last saved state
			bmp.bitmapData = undoStates[undoStates.length-1];
		
			// pops the undo state into redo states
			redoStates.push(undoStates.pop());
			
			if(initialUndo){
				// pop two since current state is counted in undoStates
				initialUndo = false;
				initialRedo = true;
				undo();
				return undoStates.length > 0;
			}

//			videoChunksRedo.push(videoChunksUndo.pop());
			
			startingNewPainting = true;

			if(undoStates.length > 0){
				initialRedo = true;
				return true;
			}else return false;
		}
		
		/** @return true if more redo states are available */
		public function redo() : Boolean{
			// sets the image to the last saved state
			bmp.bitmapData = redoStates[redoStates.length-1];
		
			// pops the redo state into undo states
			undoStates.push(redoStates.pop());
			
			if(initialRedo){
				// pop two since current state is counted in redoStates
				initialRedo = false;
				initialUndo = true;
				redo();
				return redoStates.length > 0;
			}
		
//			videoChunksUndo.push(videoChunksRedo.pop());

			if(redoStates.length > 0){
				initialUndo = true;
				return true;
			}else return false;
		}
		
		

		public function newPainting():void{
			shaderJob.cancel();
			bmp.bitmapData.fillRect(bmp.bitmapData.rect, 0);
			
			undoStates = new Vector.<BitmapData>();
			redoStates = new Vector.<BitmapData>();
			startingNewPainting = true;
			video.alpha = 1;
			
			preview(true);
			
//			videoChunksUndo = new Vector.<Vector.<BitmapData>>();
//			videoChunksRedo = new Vector.<Vector.<BitmapData>>();
		}

		public function set intensity(value : int):void{
			_intensity = value / 600;
			shader.data.intensity.value = [_intensity];
		}		
		
		public function lightRange(lower : int) : void{
			// have to explicitly set to NaN because pb won't accept 0 ...?
//			if(value == 0)_lowerLimit = NaN;
//			else _lowerLimit = value / 100;
			
			_lowerLimit = lower/100;
//			_upperLimit = upper/100;
			
			init();
		}
		
//		public function limitBrightness(value : int) : void{
//			_brightnessLimit = value / 100;
//			init();
//		}
		
		public var previewActive : Boolean = true;
		public function preview(active:Boolean):void{
			var vidIndex : int = getChildIndex(video);
			var canvasIndex:int = getChildIndex(bmp);
			
			if(active && !previewActive){
				// turn preview on
				
				previewActive = true;
				
				if(_underlayer){
					// move video to front
					removeChild(video);
					addChild(video);
					video.alpha = 1;
				}else{
					// just turn it on
					video.visible = true;
					if(!startingNewPainting)video.alpha = .5;
					else video.alpha = 1;
				}
				
				
			}else if(!active && previewActive){ 
				//turn preview off
				previewActive = false;
				
				if(_underlayer){
					// move video to back
					removeChild(bmp);
					addChild(bmp);
					video.alpha = 1;
				}else{
					// just turn it off
					video.visible = false;
				}
			}
		}
		
		public function underlayer(active : Boolean):void{
			_underlayer = active;
			video.visible = active;
			
			if(active){
				removeChild(bmp);
				addChildAt(bmp, numChildren);
				video.alpha = 1;
			}else{
				removeChild(video);
				addChild(video);
				video.alpha = .5;
			}
		}
		
		/** @return actual fps (as opposed to target fps) */
		public static function getMeasuredFPS():int{
			return fpsCounter.measuredFPS;
		}
		
		public function set fps(value : Number):void{
			_fps = value;
			
			camera.setMode(video.width, video.height, _fps, false);
			
//			saveTimer = new Timer(1000/value);
//			saveTimer.addEventListener(TimerEvent.TIMER, saveFrame);
			updateTimer = new Timer(1000/value);
			updateTimer.addEventListener(TimerEvent.TIMER, update);
		}
		public static function get targetFPS():Number{
			return _fps;
		}
		
		public function get currentFPS():int{
			return camera.currentFPS;
		}
		
		public function get cameraIndex():int{
			var camIndex : int;
			
			for (var i:int = 0; i < Camera.names.length; i++) {
				if(camera.name == Camera.names[i])camIndex = i;
			}
			return camIndex;
		}
	}
	
}