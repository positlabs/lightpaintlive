<link rel="stylesheet" href="globalStyles.css" type="text/css" charset="utf-8">
<link rel="shortcut icon" type="image/x-icon" href="/favicon.ico">

<body onload="initLightTrails()">
	<div id="fb-root"></div>
	<script>
		//facebook stuff

		( function(d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0];
				if(d.getElementById(id))
					return;
				js = d.createElement(s);
				js.id = id;
				js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=331545326882067";
				fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));

	</script>
	<script type="text/javascript">
		// g+ stuff
		(function() {
			var po = document.createElement('script');
			po.type = 'text/javascript';
			po.async = true;
			po.src = 'https://apis.google.com/js/plusone.js';
			var s = document.getElementsByTagName('script')[0];
			s.parentNode.insertBefore(po, s);
		})();

	</script>
	<canvas id="canvas"></canvas>

	<div id="wrapper">
		<?php include('lightControls.php')
		?>

		<div id="container">
			<a href="index.php"><div id="headerLogo"></div></a>
			<nav>
				<ul>
					<li id="theProgram">
						<a href="index.php">THE PROGRAM</a>
					</li>
					<li id="theGallery">
						<a href="gallery.php">THE GALLERY</a>
					</li>
					<li id="theVideos">
						<a href="videos.php">THE VIDEOS</a>
					</li>
					<li id="theStory">
						<a href="story.php">THE STORY</a>
					</li>
				</ul>
			</nav>
			<img src="imgs/redLine.png" style="text-align: center; margin-bottom: -6px; width: 940px; height: 1px;"/>
			<div id="content">
