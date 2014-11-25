<style>
	.theGallery #lightControls{
		visibility: hidden;
	}

	#lightControls {
		display: none;
		position: fixed;
		top: 0;
		padding: 5px;
		padding-left: 20px;
		width: 115px;
		-moz-user-select: none;
		-khtml-user-select: none;
		user-select: none;
		background-color: rgba(0,0,0,0.5);
	}
	.controlBtn {
		float: right;
		background-color: #000000;
		border-color: #4AD8C8;
		border-width: 1px;
		border-style: solid;
		padding: 6px;
		color: #ffffff;
		cursor: pointer;
		width: 10px;
		height: 10px;
		margin-bottom: 10px;
	}
	.controlBtn:hover {
		border-color: #FF0000;
		background-color: #111111;
	}
</style>
<script>
	var containerVisible = true;
	function togglePageVisibility() {
		if(containerVisible) {
			$('#container').hide();
			$('footer').hide();
			containerVisible = false;
			document.getElementById("toggleContent").innerHTML = "show content";
		} else {
			$('#container').show();
			$('footer').show();
			containerVisible = true;
			document.getElementById("toggleContent").innerHTML = "hide content";
		}
	}

	var controlsVisible = false;
	function toggleControlsVisibility() {
		if(controlsVisible)
			$('#controls').hide();
		else if(!controlsVisible)
			$('#controls').show();
		controlsVisible = !controlsVisible;
	}
</script>
<div id="lightControls">
	<div class="controlBtn" onclick="toggleControlsVisibility()" style="width:100%; padding-top: auto; height: 1.3em">
		controls
	</div>
	<div id="controls" style="display: none">
		<div class="controlBtn" id="toggleContent" onclick="togglePageVisibility()" style="width:100%; padding-top: auto; height: 1.3em">
			hide content
		</div>
		<div style="float: left; width: 100%">
			<p style="float: left; height: 20px;">
				particles
			</p>
			<div class="controlBtn" onclick="addParticle()">
				+
			</div>
			<div class="controlBtn" onclick="removeParticle()">
				-
			</div>
		</div>
		<div style="float: left; width: 100%">
			<p style="float: left; height: 20px;">
				gravity
			</p>
			<div class="controlBtn" onclick="particleSpeed(.02)">
				+
			</div>
			<div class="controlBtn" onclick="particleSpeed(-.02)">
				-
			</div>
		</div>
		<div style="float: left; width: 100%">
			<p style="float: left; height: 20px;">
				speed
			</p>
			<div class="controlBtn" onclick="if(accelLimit< 15)accelLimit++">
				+
			</div>
			<div class="controlBtn" onclick="if(accelLimit >1)accelLimit--">
				-
			</div>
		</div>
		<div style="float: left; width: 100%">
			<p style="float: left; height: 20px;">
				brightness
			</p>
			<div class="controlBtn" onclick="brighness(.01)">
				+
			</div>
			<div class="controlBtn" onclick="brighness(-.01)">
				-
			</div>
		</div>
		<div style="float: left; width: 100%">
			<p style="float: left; height: 20px;">
				fade
			</p>
			<div class="controlBtn" onclick="if(fadeStrength < 1)fadeStrength += .005">
				+
			</div>
			<div class="controlBtn" onclick="if(fadeStrength>0)fadeStrength -= .005">
				-
			</div>
		</div>
		<div class="controlBtn" onclick="clearCanvas = true" style="width:100%; padding-top: auto; height: 1.3em">
			clear canvas
		</div>
	</div>
</div>