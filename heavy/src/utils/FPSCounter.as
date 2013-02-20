package utils{
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.utils.getTimer;
	
	public class FPSCounter extends Sprite{
		private var last:uint = getTimer();
		private var ticks:uint = 0;
		public var measuredFPS:int;
		
		public function FPSCounter() {
			addEventListener(Event.ENTER_FRAME, tick);
		}
		
		public function tick(evt:Event):void {
			ticks++;
			var now:uint = getTimer();
			var delta:uint = now - last;
			if (delta >= 1000) {
				//trace(ticks / delta * 1000+" ticks:"+ticks+" delta:"+delta);
				measuredFPS = ticks / delta * 1000;
				ticks = 0;
				last = now;
			}
		}
	}
}