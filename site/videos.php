<!DOCTYPE html>
<html class="theVideos" xmlns:fb="http://ogp.me/ns/fb#" itemscope itemtype="http://schema.org/Product">
	<!-- 			font-family:"BebasNeueRegular"; -->
	<!-- 			font-family:"UniversLTStd67BoldCondensed"; -->
	<head>
		<meta http-equiv="Content-type" content="text/html; charset=utf-8"/>
		<title>Light Paint Live // Videos</title>
		<!-- Add the following three tags inside head -->
		<meta itemprop="name" content="Light Paint Live // Videos">
		<meta itemprop="description" content="Tutorials, demos, and other videos related to light-painting">
		<meta itemprop="image" content="http://lightpaintlive.com/imgs/siteHeader.png">
		<link rel="stylesheet" href="fonts/bebas/stylesheet.css" type="text/css" charset="utf-8">
		<link rel="stylesheet" href="fonts/univers/stylesheet.css" type="text/css" charset="utf-8">
		<script src="scripts/easel.js" type="text/javascript" charset="utf-8"></script>
		<script src="scripts/jquery.min.js" type="text/javascript" charset="utf-8"></script>
		<script src="scripts/lighttrails.js" type="text/javascript" charset="utf-8"></script>
		<script src="scripts/analytics.js" type="text/javascript" charset="utf-8"></script>
	</head>
	<script type="text/javascript">
		function changeVideo(targ, url) {
			document.getElementById("player").src = url;
			$('.selected').removeClass('selected');
			$(targ).addClass('selected');
		}
	</script>
	<style type="text/css" media="screen">
		#videosContent {
			padding: 20px;
			text-align: left;
			width: 900px;
			display: block;
		}
		#player {
			margin-right: 10px;
		}
		#videoSelector {
			clear: left;
		}
		#videoSelector div {
			float: left;
		}
		#videoSelector h1 {
			width: 182px;
			font-size: 12px;
			font-family: "Arial";
			font-weight: normal;
			background-color: rgba(0,0,0,.7);
			padding: 5px;
			position: absolute;
			text-align: left;
			margin: 0px 20px 10px 0px;
			-moz-user-select: none;
			-khtml-user-select: none;
			user-select: none;
		}
		#videoSelector img {
			width: 191px;
		}
		#videoSelector div {
			padding: 10px;
			margin-bottom: 8px;
			margin-right: 6px;
		}
		#videoSelector div:hover {
			border-color: #4AD8C8;
			border-style: solid;
			border-width: 1px;
			padding: 9px;
		}
		#videoSelector .selected {
			border-color: #ff0000;
			border-style: solid;
			border-width: 1px;
			margin: 0;
			padding: 10px;
			margin-bottom: 0px;
			cursor: hand;
			margin-bottom: 6px;
			margin-right: 6px;
		}
		#videoSelector .selected:hover {
			padding: 10px;
		}
		#videoSelector a {
			color: #FFFFFF;
		}
		#videoSelector a:hover {
			color: #4AD8C8;
		}

	</style>
	<?php include('includes/globalStyles.php')
	?>
	<?php include('includes/docHead.php')
	?>
	<!-- 	<h1> VIDEOS </h1>
	<div class="divBar"></div> -->
	<div id="videosContent">
		<div style="width: 860px; height: 484px;">
			<iframe id="player" width="860" height="484" src="http://www.youtube.com/embed/J-ow6VXYr50" frameborder="0" allowfullscreen></iframe>
		</div>
		<div id="videoSelector">
			<a href="#">
			<div class="selected" onclick="changeVideo(this, 'http://www.youtube.com/embed/J-ow6VXYr50')">
				<h1>PBS Light Painting</h1>
				<img src="http://img.youtube.com/vi/J-ow6VXYr50/0.jpg"/>
			</div> </a>
			<a href="#">
			<div onclick="changeVideo(this, 'http://www.youtube.com/embed/PDlEC6cUUHs')">
				<h1>Tutorial: Buying and Installing LPL: Heavy</h1>
				<img src="http://img.youtube.com/vi/PDlEC6cUUHs/0.jpg"/>
			</div> </a>
			<a href="#">
			<div onclick="changeVideo(this, 'http://www.youtube.com/embed/SrXbS4qcEf8')">
				<h1>Miedza's LPL: Heavy Demo</h1>
				<img src="http://img.youtube.com/vi/SrXbS4qcEf8/0.jpg"/>
			</div> </a>
			<a href="#">
			<div onclick="changeVideo(this, 'http://www.youtube.com/embed/V392V2Ha9zM')">
				<h1>Miedza's Sports-hall Performance 1</h1>
				<img src="http://img.youtube.com/vi/V392V2Ha9zM/0.jpg"/>
			</div> </a>
			<a href="#">
			<div onclick="changeVideo(this, 'http://www.youtube.com/embed/jEfBOzRkA20')">
				<h1>Miedza's Sports-hall Performance 2</h1>
				<img src="http://img.youtube.com/vi/jEfBOzRkA20/0.jpg"/>
			</div> </a>
			<a href="#">
			<div onclick="changeVideo(this, 'http://www.youtube.com/embed/35bAKWAdv1k')">
				<h1>Miedza's Light Cone Performance</h1>
				<img src="http://img.youtube.com/vi/35bAKWAdv1k/0.jpg"/>
			</div> </a>
			<a href="#">
			<div onclick="changeVideo(this, 'http://www.youtube.com/embed/9kAO6w3ICRM')">
				<h1>Nike Stadiums | LAPP-PRO Brasil</h1>
				<img src="http://img.youtube.com/vi/9kAO6w3ICRM/0.jpg"/>
			</div> </a>
			
			<a href="#">
			<div onclick="changeVideo(this, 'http://www.youtube.com/embed/1E2noH6LDWE')">
				<h1>Miedza's Country Lane Performance</h1>
				<img src="http://img.youtube.com/vi/1E2noH6LDWE/0.jpg"/>
			</div> </a>
			<a href="#">
			<div onclick="changeVideo(this, 'http://www.youtube.com/embed/GT2g4FjziOo')">
				<h1>Miedza's Humble Cottage Performance</h1>
				<img src="http://img.youtube.com/vi/GT2g4FjziOo/0.jpg"/>
			</div> </a>
			<a href="#">
			<div onclick="changeVideo(this, 'http://www.youtube.com/embed/04oNe2CJjgs')">
				<h1>Miedza's Warehouse Performance</h1>
				<img src="http://img.youtube.com/vi/04oNe2CJjgs/0.jpg"/>
			</div> </a>
			<a href="#">
			<div onclick="changeVideo(this, 'http://www.youtube.com/embed/3Fe--AaFqnA')">
				<h1>Miedza's Horse Field Performance</h1>
				<img src="http://img.youtube.com/vi/3Fe--AaFqnA/0.jpg"/>
			</div> </a>
			
			
			<a href="#">
			<div onclick="changeVideo(this, 'http://www.youtube.com/embed/uXID_HqdmxE')">
				<h1>Tutorial: Orbs</h1>
				<img src="http://img.youtube.com/vi/uXID_HqdmxE/0.jpg"/>
			</div> </a>
			<a href="#">
			<div onclick="changeVideo(this, 'http://www.youtube.com/embed/Zv1jXj3c6jM')">
				<h1>Tutorial: Off-Camera Light</h1>
				<img src="http://img.youtube.com/vi/Zv1jXj3c6jM/0.jpg"/>
			</div> </a>
			<a href="#">
			<div onclick="changeVideo(this, 'http://www.youtube.com/embed/raSTf7ogvW4')">
				<h1>Tutorial: On-Camera Light</h1>
				<img src="http://img.youtube.com/vi/raSTf7ogvW4/0.jpg"/>
			</div> </a>
			<a href="#">
			<div onclick="changeVideo(this, 'http://www.youtube.com/embed/UkxUDJfcW4E')">
				<h1>Tutorial: Glow Sticks, Glow Wire, Steel Wool, Flashlights</h1>
				<img src="http://img.youtube.com/vi/UkxUDJfcW4E/0.jpg"/>
			</div> </a>
		</div>
	</div>
	<?php include('includes/footer.php')
	?>
