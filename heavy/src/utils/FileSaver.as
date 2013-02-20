package utils {
	import flash.display.BitmapData;
	import flash.display.DisplayObject;
	import flash.display.IBitmapDrawable;
	import flash.filesystem.File;
	import flash.filesystem.FileMode;
	import flash.filesystem.FileStream;
	import flash.geom.Matrix;
	import flash.utils.ByteArray;
	
	import mx.graphics.codec.JPEGEncoder;
	
	public class FileSaver {
		private static var _singleton:FileSaver;

//		public static var makeNewFlvFileFlag : Boolean;

//		public var flvWriter : SimpleFlvWriter = SimpleFlvWriter.getInstance();
		private static var flvFile : File;
		private static var currentVidIndex : int = 1;
		private static var currentImgIndex : int = 1;
		private static var halfMatrix : Matrix;
		private var ma : Matrix;

		private var imgFile : File;
		private var fileba : ByteArray;
		
		/** flag to make full resolution videos */
		public var fullResVideo : Boolean;
		
		/** flag to write video directly to disk */
		public var saveToDisk : Boolean;
		
//		public var flvEncoder:FileStreamFlvEncoder;
//
//		private var micUtil:MicRecorderUtil;

		public function FileSaver(){
			ma = new Matrix();
			ma.scale(-1, 1);
			halfMatrix = new Matrix();
			halfMatrix.scale(.5, .5);
			halfMatrix.scale(-1, 1);
			
//			var mic:Microphone = Microphone.getMicrophone();
//			mic.setSilenceLevel(0, int.MAX_VALUE);
//			mic.gain = 100;
//			mic.rate = 44;
//			micUtil = new MicRecorderUtil(mic);	
			
		}
		
		public static function getInstance() : FileSaver {
			if(_singleton == null) _singleton = new FileSaver();
			return _singleton;
		}
		
		public function savePainting(drawable : IBitmapDrawable):void{
			var img : DisplayObject = drawable as DisplayObject;
			var ma : Matrix = new Matrix();
			ma.scale(-1, 1);
			ma.tx = img.width;
			
			var savebmpd : BitmapData = new BitmapData(img.width, img.height);
			savebmpd.draw(drawable, ma);
			
			var jpg:JPEGEncoder = new JPEGEncoder(90);
			fileba = jpg.encode(savebmpd);
			
			writeImg();
			
		}	
		
		/** writes the image to the disk */
		private function writeImg():void{
			var date : Date = new Date();
			var dateString : String = date.fullYear.toString() + date.month.toString() + date.date.toString();
			
			imgFile = new File();
			imgFile = imgFile.resolvePath(File.desktopDirectory.nativePath + "/LightPaintLive/images/lpl_" + dateString + "_" + currentImgIndex + ".jpg");
			
			if(!imgFile.exists){
				var stream : FileStream = new FileStream();
				stream.open(imgFile, FileMode.WRITE);
				stream.writeBytes(fileba);
				stream.close();
				
				LightPaintLiveDesktop.getInstance().saveEnd.play();
				
			}else{
				currentImgIndex++;
				writeImg();
			}
		}
		
		
//		public function saveVideo(videoChunks : Vector.<Vector.<BitmapData>>) : void {
//			var bmpd : BitmapData = videoChunks[0][0].clone();
//			makeNewFlvFile(bmpd, true);
//			
//			// write all of the images to a video file
//			for (var i:int = 0; i < videoChunks.length; i++){
//				for (var j:int = 0; j < videoChunks[i].length; j++){
//					writeQueuedFrame(videoChunks[i][j]);
//				}
//			}
//			
//			endVideoSave();
//		}
//
//		private function endVideoSave():void{
////			makeNewFlvFileFlag = true;
//			currentVidIndex++;
//			
//			LightPaintLiveDesktop.getInstance().saveEnd.play();
//			closeFile();
//		}
		
		/** used to save out pre-transformed image sequence */
//		private function writeQueuedFrame(frame : BitmapData):void{
//			var bmd : BitmapData = new BitmapData(frame.width, frame.height);
//			bmd.draw(frame);
//			flvEncoder.addFrame(bmd, null);
//		}
		
		/** writes frame directly to disk */
//		public function writeFrame(frame : BitmapData):void{
//			var bmd : BitmapData = drawFrame(frame);
			
//			flvWriter.saveFrame(bitmapdata);
//			flvEncoder.addFrame(bitmapdata, micUtil.byteArray);
//			flvEncoder.addFrame(bmd, null);
//		}
		
		/** saves frame to RAM to support undo / redo functions. Write to disk on user request */
		public function saveFrame(frame : BitmapData, storageVector : Vector.<Vector.<BitmapData>>):void{
			var bmd : BitmapData = drawFrame(frame);
			storageVector[storageVector.length-1].push(bmd);
		}

		private function drawFrame(frame : BitmapData) : BitmapData{
			var divisor : int = 2;
			var matrix:Matrix;
			
			if(fullResVideo){
				matrix = ma.clone();
				divisor = 1;
			}else matrix = halfMatrix.clone();
			
			matrix.tx = frame.width/divisor;
			
			var bitmapdata : BitmapData = new BitmapData(frame.width/divisor, frame.height/divisor);
			bitmapdata.draw(frame, matrix);
			return bitmapdata;
		}
//		
//		public function makeNewFlvFile(templateFrame : BitmapData, preTransformed : Boolean = false):void{
////			makeNewFlvFileFlag = false;
//			
//			flvFile = new File();
//			flvFile = flvFile.resolvePath(File.desktopDirectory.nativePath + "/LightPaintLive/videos/lpl_" + currentVidIndex + ".flv");
//			if(!flvFile.exists){
//				
//				if(WebCam.record)
//					flvEncoder = new FileStreamFlvEncoder(flvFile, WebCam.targetFPS *.66); // just have to guess actual fps is going to be lower
//				else
//					flvEncoder = new FileStreamFlvEncoder(flvFile, WebCam.getMeasuredFPS());
//				
//				// use alchemy encoder if OS is windows (SUPER FAST!)
//				var encoder : Class;
////				if(Capabilities.os.search("Windows")>=0)
//					encoder = VideoPayloadMakerAlchemy;
//				
//				
//				if(fullResVideo || preTransformed){
//					flvEncoder.setVideoProperties(templateFrame.width, templateFrame.height, encoder);
////					flvWriter.createFile(flvFile, templateFrame.width, templateFrame.height, WebCam.fps);
//				}else{ 
//					flvEncoder.setVideoProperties(templateFrame.width/2, templateFrame.height/2, encoder);
////					flvWriter.createFile(flvFile, templateFrame.width/2, templateFrame.height/2, WebCam.fps);
//				}
//					flvEncoder.fileStream.openAsync(flvFile, FileMode.UPDATE);
////					flvEncoder.setAudioProperties(FlvEncoder.SAMPLERATE_44KHZ, true, false, true);
//					flvEncoder.start();
//			}else{
//				// if the file already exists, iterate and check the next file path
//				currentVidIndex++;
//				makeNewFlvFile(templateFrame, preTransformed);
//			}
//		}
//		
//		public function closeFile():void{
////			flvWriter.closeFile();
//
//			flvEncoder.updateDurationMetadata();
//
//			flvEncoder.fileStream.close();
//			flvEncoder.kill();
//		}
		
	}
}