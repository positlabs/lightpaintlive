<!DOCTYPE html>
<html class="theProgram" xmlns:fb="http://ogp.me/ns/fb#" itemscope itemtype="http://schema.org/Product">
	<!-- 			font-family:"BebasNeueRegular"; -->
	<!-- 			font-family:"UniversLTStd67BoldCondensed"; -->
	<head>
		<meta http-equiv="Content-type" content="text/html; charset=utf-8"/>
		<title>Light Paint Live // Program</title>
		<!-- Add the following three tags inside head -->
		<meta itemprop="name" content="Light Paint Live // Program">
		<meta itemprop="description" content="Light Paint Live is a webcam program that lets you paint with light! It shows pictures developing in real-time!">
		<meta itemprop="image" content="http://lightpaintlive.com/imgs/siteHeader.png">

        <meta property="og:title" content="Light Paint Live // Program"/>
        <meta property="og:description" content="Light Paint Live is a webcam program that lets you paint with light! It shows pictures developing in real-time!">
        <meta property="og:url" content="http://lightpaintlive.com"/>
        <meta property="og:image" content="http://lightpaintlive.com/imgs/josh.jpg"/>

		<link rel="stylesheet" href="fonts/bebas/stylesheet.css" type="text/css" charset="utf-8">
		<link rel="stylesheet" href="fonts/univers/stylesheet.css" type="text/css" charset="utf-8">
		<link rel="shortcut icon" type="image/x-icon" href="/favicon.ico">

		<script src="scripts/jquery.min.js" type="text/javascript" charset="utf-8"></script>
		<script src="scripts/lighttrails.js" type="text/javascript" charset="utf-8" ></script>
		<script src="scripts/easel.js" type="text/javascript" charset="utf-8"></script>
		<script src="scripts/analytics.js" type="text/javascript" charset="utf-8"></script>
	</head>
	<style type="text/css" media="screen">
		.flavorBlock {
			float: left;
			width: 177px;
			margin-right: 79px;
		}
		.flavorBlock:last-child {
			margin-right: 0;
		}
		.flavorBlock li {
			margin: 0;
			padding: 0;
			list-style: none;
		}
		#instantBtn img {
			border-width: 1px;
			border-style: solid;
			border-color: #4ad8c8;
		}
		#instantBtn img:hover {
			border-color: #ffffff;
		}
		#heavyBtn {
			border-width: 1px;
			border-style: solid;
			border-color: #ff0000;
		}
		#heavyBtn:hover {
			border-color: #ffffff;
		}
    #androidBtn img {
      border-width: 1px;
      border-style: solid;
      border-color: #12b91e;
    }
		#androidBtn img:hover {
			border-color: #ffffff;
		}
    #mercuryBtn img {
      border-width: 1px;
      border-style: solid;
      border-color: #0e52c1;
    }
    #mercuryBtn img:hover {
      border-color: #ffffff;
    }
		#featuresSection h2 {
			padding-top: 30px;
			margin-bottom: 5px;
		}
	</style>
	<?php include('includes/docHead.php')
	?>
	<h1> DEMO </h1>
	<iframe width="560" height="315" src="http://www.youtube.com/embed/SrXbS4qcEf8" frameborder="0" allowfullscreen></iframe>
	<h1> WHAT IS IT? </h1>
	<!-- 	<div class="divBar"></div> -->
	<section>
		<h2>Light Paint Live is a webcam program that lets you paint with light!</h2>
		<p>
			This program is great for amateur and professional light-painters alike. Amateurs can use it to experiment with light painting without having to buy an expensive camera, and pros can use it as a heads-up display for their DSLR camera. It shows the picture developing in real-time!
		</p>
		<p>
			Many people are unfamiliar with light painting, but it’s been around since the early 1900’s! Read more about the history at <a href="http://lightpaintingphotography.com/light-painting-history/" target="_blank">LightPaintingPhotography.com</a>
		</p>
		<p>
			For a more verbose description, see Joerg Miedza's <a href="http://miedza.de/photos/rtlartl" target="_blank">post about realtime light-art.</a>
		</p>
	</section>
	<h1> FLAVORS </h1>
	<!-- 	<div class="divBar"></div> -->
	<section>

		<div class="flavorBlock">
			<h2>LPL MERCURY</h2>
			<a href="https://chrome.google.com/webstore/detail/light-paint-live-mercury/bphfkpkoljdicakaokfbjiaamholpgjf?hl=en&gl=US" target="_blank" id="mercuryBtn"><img src="imgs/mercuryBtn.jpg"/></a>
			<p>
				<strong>Chrome app</strong>
        <br>
        Uses GPU processing for extremely fluid light-painting. It functions offline so you can shoot in remote locations! Try the
        <a href="http://lightpaintlive.com/mercury/" target="_blank">alpha version</a> for a taste of what you'll get in the app.
			</p>
		</div>

		<div class="flavorBlock">
			<h2>LPL INSTANT</h2>
			<a href="http://lightpaintlive.com/instant" target="_blank" id="instantBtn"><img src="imgs/instantBtn.jpg"/></a>
			<p>
				<strong>Free demo of LPL Heavy</strong>
				<br/>
				All you need is a computer and a webcam!
			</p>
		</div>
		<div class="flavorBlock">
			<h2>LPL HEAVY</h2>
			<a href="heavy.php"><img id="heavyBtn" alt="" src="imgs/heavyBtn.jpg" type="image"/></a>
			<p>
				<strong>Full-feature desktop version!</strong>
				<li>
					- Mac / Windows compatible
				</li>
				<li>
					- Up to 1920x1080 resolution
				</li>
				<li>
					- Undo / Redo controls
				</li>
				<li>
					...and lots more! (see below)
				</li>
			</p>
		</div>
    <!--<div class="flavorBlock">-->
			<!--<h2>LPL ANDROID</h2>-->
			<!--<a href="https://market.android.com/details?id=com.positlabs.lightpaintlive&hl=en" target="_blank" id="androidBtn"><img src="imgs/androidBtn.jpg"/></a>-->
			<!--<p>-->
				<!--<strong>Free android app</strong> that makes for a handy light-painter’s sketch book. Super portable!-->
			<!--</p>-->
		<!--</div>-->

	</section>
	<h1> FEATURES </h1>
	<!-- 	<div class="divBar"></div> -->
	<section id="featuresSection">
		<img src="imgs/featureDiagram.jpg"/>
		<h2>1. MAIN CONTROLS</h2>
		<strong>Start / stop</strong> button will start or stop capturing a painting. Key-control: SPACEBAR.
		<br/>
		<strong>Light-sensitivity</strong> slider controls amount of light captured per frame - similar to ISO. Key-control: UP / DOWN ARROWS. <h2>2. EDIT CONTROLS</h2>
		<strong>Undo / redo</strong> buttons will do just that. Key-controls: CTRL+Z, CTRL+Y.
		<br/>
		<strong>New</strong> button makes a new painting. Key-control: CTRL+N.
		<br/>
		<strong>Save</strong> button will save an image or video to the users desktop. Key-control: CTRL+S. <h2>3. SCREEN CONTROLS</h2>
		<strong>Fullscreen</strong> button makes application go into fullscreen mode.
		<br/>
		<strong>Toggle preview</strong> button turns live preview on or off. Key-control: ENTER. <h2>4. PAINTING OPTIONS</h2>
		<strong>Countdown</strong> activates a slider that controls how long to delay capture after the start button is pressed.
		<br/>
		<strong>Video underlayer</strong> checkbox enables a live video preview underneath the light canvas.
		<br/>
		<strong>Light range</strong> checkbox activates sliders that control the range of light that is captured.
		<br/>
		<strong>Limit brightness</strong> checkbox prevents painting from exceeding natural light values. Also has a slider for increasing the threshold.
		<br/>
		<strong>Fade</strong> checkbox activates a slider that controls how fast the painting fades away.
		<br/>
		<strong>Color shift</strong> activates sliders that shift the red, green, and blue color channels.
		<br/>
		<h2>5. WEBCAM OPTIONS</h2>
		<strong>Camera selector</strong> lets user pick which webcam to use.
		<br/>
		<strong>Capture size</strong> selector determines the dimensions of the image.
		<br/>
		<strong>Target frame-rate</strong> slider determines the maximum rate of capture.
    <del>
      <h2>6. RECORDING OPTIONS</h2>
      <strong>Capture video</strong> checkbox enables user to save a video of the performance. Recommended for low-resolution only.
      <br/>
      <strong>Save full res video</strong> checkbox records videos at full size. Recommended for low-resolution only.
      <br/>
      <strong>Write video to disk</strong> checkbox writes the video to the disk as it’s being captured. Minimzes memory usage during recording.
      </del>
    <h2>7. VIEW OPTIONS</h2>
		<strong>Dim controls</strong> checkbox dims the controls during painting.
	</section>
	<h1> TIPS </h1>
	<section id="tipsSection">

		LPL needs a lot of processing power to do its job. Consider this: a 1920 x 1080 image contains about two-million pixels. LPL’s default target frame-rate is 24fps,
		so <b>the computer attempts to process about fifty-million pixels every second!!</b>

		<p>
			To improve LPL’s performance, you can do a couple of things.
		</p>

		<p>
			<b> 1. Close any other open programs.</b>
			<br/>
			<b>2. Use a lower resolution capture size. Less pixels means more speed! </b>
			<br/>
			<b>3. Buy a processor with a lot of cores.</b>
		</p>
		<p>
			LPL uses <a href="http://www.adobe.com/devnet/pixelbender.html" target="_blank">Pixel Bender</a> to process incoming frames. Pixel Bender splits the workload evenly between all available processor cores. The more cores your processor has, the smoother the painting will be!
		</p>
	</section>
	<h1> RESOURCES </h1>
	<section id="resourcesSection">
		<a href="http://extrawebcam.com/" target="_blank">ExtraWebcam</a> - Connect Canon live-view to LPL with this software.
		<br/>
		<a href="http://webcam-osx.sourceforge.net/index.html" target="_blank">Macam</a> - Various webcam drivers for Mac.
		<br />
		<a href="http://www.splitcamera.com/" target="_blank">Split Cam</a> - Play video files through the webcam.

	</section>
	<?php include('includes/footer.php')
	?>
