package{

	
	public class Tooltips{	
	
		public static var recordCheckBox : String = "Records a video of the painting. Save > Video (or ctrl + shift + s) will save it to the desktop";
		public static var fullresCheckBox : String = "Enables video recording at full resolution (default is half). This will greatly increase time needed to save videos.";
		public static var saveToDiskCheckBox : String = "Generates a new video file every time the start button is pressed. Writes to the file on-the-fly. Great for recording long sessions, but hinders performance.";
		public static var fadeCheckBox : String = "Fades the painting over time. The higher the value, the faster it will fade. Useful for setting up a shot, experimenting with techniques, or running the program ad infinitum (at events or parties).";
		public static var lightRangeCheckBox : String = "Only capture a set range of light.";
		public static var delayCheckBox : String = "Do a countdown before starting the painting. Use the slider to set how many seconds the countdown will last.";
		public static var hueCheckBox : String = "Shift the color channels (red, green, blue) of the light.\r\rFor example, adding green will tint the image green. Conversely, subtracting green will tint the image purple.\r\rIdeally, the RGB values should add up to 0. If they are less than 0, the image will appear dimmer; greater than 0 and it will appear brighter.";
		public static var limitBrightnessCheckBox : String = "Limits the brightness of the painting to the brightness of the camera. In other words, the painted image will never be brighter than what is seen by the camera. The slider allows for extra brightness.\r\rNote that this limit can be overridden by the color shift controls. Also, this option has the side-effect of making grainy images.";
		public static var fpsSlider : String = "Sets the framerate of the camera. If it's set above what the camera supports, it will cap at the highest possible rate.";
		public static var dimControlsCheckBox : String = "Dims the controls during painting.";
		public static var resolutionSelector : String = "Low resolution makes for smoother performance, while high resolution gives higher quality images.";
		public static var popoutBtn : String = "Puts the canvas into a new window.";

	}	
}