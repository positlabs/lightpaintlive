package com.positlabs.lpl.instant {
	import mx.graphics.codec.JPEGEncoder;

	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.Shader;
	import flash.display.ShaderJob;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.ShaderEvent;
	import flash.filters.ShaderFilter;
	import flash.geom.Matrix;
	import flash.media.Camera;
	import flash.media.Video;
	import flash.net.FileReference;
	import flash.utils.ByteArray;
	
	public class WebCam extends Sprite{	
		
		public static var video : Video;
		private var camera : Camera;
		private var cameraBmd : BitmapData;
		private var bmp : Bitmap;
		private var ma : Matrix;
		
		/* The amount of light captured */
		private static var _intensity : Number = 50/600;
		
		[Embed("com/positlabs/lpl/pixelbender/lplExposure.pbj", mimeType="application/octet-stream")]
		private var LPLFilter : Class;	
		
		private var shader : Shader;
		private var shaderfilter : ShaderFilter;
		private var shaderJob : ShaderJob;
		
		private var painting : Boolean;
		
//		private var startingNewPainting : Boolean = true;
//		private var initialUndo : Boolean = true;
//		private var initialRedo : Boolean = true;
//		private var undoStates : Vector.<BitmapData> = new Vector.<BitmapData>();
//		private var redoStates : Vector.<BitmapData> = new Vector.<BitmapData>();
		
		public function WebCam(w : int, h : int):void {
			camera = Camera.getCamera();
			
			if(camera != null){
				video = new Video(w, h);
				video.smoothing = true;
				camera.setMode(w, h, 60);
				video.attachCamera(camera);
				
				// bitmap to draw to
				var bmd : BitmapData = new BitmapData(w, h, false, 0x000);
				bmp = new Bitmap(bmd);
				addChild(bmp);
				bmp.scaleX = -1;
				bmp.x = w;
				
				addChild(video);
				video.scaleX = -1;
				video.x = video.width;
				
				cameraBmd = bmd.clone();
				
				ma = new Matrix();
				ma.scale(-1, 1);
				
				init();
			}else{
				// notify user
				LPL_Instant.notifyCamera();
			}
		}
		
		private function init():void{
			shader = new Shader(new LPLFilter() as ByteArray);
			shader.data.intensity.value = [_intensity];
			shaderJob = new ShaderJob();
		}
		
		private function update(e:Event):void{
			cameraBmd.draw(video);
			applyShader();
		}
		
		private function applyShader():void{
			
			// supply canvas and camera
			shader.data.src.input = bmp.bitmapData;
			shader.data.src2.input = cameraBmd;
			
			//create a shader job
			shaderJob = new ShaderJob(shader, bmp.bitmapData);
			
			if(painting){
				//add listener for job completion
				shaderJob.addEventListener(ShaderEvent.COMPLETE, update);
			}
			
			//run job
			shaderJob.start();
		}
		
		public function startPainting():void{
			preview(false);
			
			painting = true;
			applyShader();
			
			// clear redo states
//			redoStates = new Vector.<BitmapData>();
			
//			if(startingNewPainting){
				// save the state
//				undoStates.push(bmp.bitmapData.clone());
//				startingNewPainting = false;
//			}
		}
		public function stopPainting():void{
			painting = false;
			shaderJob.cancel();
			shaderJob.removeEventListener(ShaderEvent.COMPLETE, update);
			
			// save the state
//			undoStates.push(bmp.bitmapData.clone());
//			
//			initialUndo = true;
//			initialRedo = true;
		}
		
		/** @return true if more undo states are available */
//		public function undo() : Boolean{
//			
//			// sets the image to the last saved state
//			bmp.bitmapData = undoStates[undoStates.length-1];
//			
//			// pops the undo state into redo states
//			redoStates.push(undoStates.pop());
//			
//			if(initialUndo){
//				// pop two since current state is counted in undoStates
//				initialUndo = false;
//				undo();
//			}
//			
//			startingNewPainting = true;
//			
//			if(undoStates.length > 0)return true;
//			else return false;
//		}
		
		/** @return true if more redo states are available */
//		public function redo() : Boolean{
//			// sets the image to the last saved state
//			bmp.bitmapData = redoStates[redoStates.length-1];
//			
//			// pops the redo state into undo states
//			undoStates.push(redoStates.pop());
//			
//			if(initialRedo){
//				// pop two since current state is counted in redoStates
//				initialRedo = false;
//				redo();
//			}
//			
//			if(redoStates.length > 0)return true;
//			else return false;
//		}
		
		public function newPainting():void{
			shaderJob.cancel();
			bmp.bitmapData.fillRect(bmp.bitmapData.rect, 0);
			
//			undoStates = new Vector.<BitmapData>();
//			redoStates = new Vector.<BitmapData>();
//			startingNewPainting = true;
			
			preview(true);
		}
		
		public function set intensity(value : int):void{
			_intensity = value / 600;
			shader.data.intensity.value = [_intensity];
		}
		
		
		public var previewActive : Boolean = true;
		public function preview(active:Boolean):void{
			if(active && !previewActive){
				previewActive = true;
				addChild(video);
			}else if(!active && previewActive){ 
				previewActive = false;
				removeChild(video);
			}
		}
		
		
		public function savePainting():void{
			// bitmap data is flipped to display properly, so unflip it by drawing the view
			var savebmpd : BitmapData = new BitmapData(bmp.width, bmp.height);
			savebmpd.draw(this);
			
			var jpg:JPEGEncoder = new JPEGEncoder();
			var ba:ByteArray = jpg.encode(savebmpd);
			
			var file : FileReference = new FileReference();
			file.save(ba, 'lightPainting.jpg');
		}	
	}
	
}