Social = (function () {

	/**
	 * @author josh beckwith
	 */

	var $social;
	var template = '<div id="social" class="closed"> <div id="facebook" class="social"><div class="fb-like" data-href="http://www.facebook.com/LightPaintLive" data-send="true" data-width="450"	data-show-faces="false" data-colorscheme="dark"> </div></div>	<div id="gplus" class="social">	<div class="g-plusone" data-annotation="inline" data-width="300" data-href="http://lightpaintlive.com"></div></div>	<div id="twitter" class="social">	<a href="https://twitter.com/share" class="twitter-share-button" data-url="http://lightpaintlive.com"	data-text="Real-time light painting!" data-size="large">Tweet</a></div>	</div>';

	function Social($container) {

		$social = $container;
		$social.replaceWith(template);

		// load facebook api
		(function (d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) return;
			js = d.createElement(s);
			js.id = id;
			js.src = "http://connect.facebook.net/en_US/all.js#xfbml=1&appId=331545326882067";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));

//set up twitter
		!function (d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0];
			if (!d.getElementById(id)) {
				js = d.createElement(s);
				js.id = id;
				js.src = "http://platform.twitter.com/widgets.js";
				fjs.parentNode.insertBefore(js, fjs);
			}
		}(document, "script", "twitter-wjs");

// set up g+
		(function () {
			var po = document.createElement('script');
			po.type = 'text/javascript';
			po.async = true;
			po.src = 'https://apis.google.com/js/plusone.js';
			var s = document.getElementsByTagName('script')[0];
			s.parentNode.insertBefore(po, s);
		})();

	}

	Social.prototype = {
		open:function (e) {
			$social.removeClass("closed").addClass("open");
			setTimeout(function () {
				$social.clickOutside(function () {
					$social.removeClass("open").addClass("closed");
				});
			}, 200);
		}

	};
	return Social;
}());