lightpaintlive
==============


Mercury
======
a webcam app for light painting in real-time.


Buy CTA
------
https://developer.chrome.com/webstore/inline_installation


Mercury feature demo video
-----
probably inline video

start with a cool light painting.

go over features



LIGHT Modes
-------
Mercury has 10 modes for capturing light. Some are used for light painting, and some are used for transitioning between paintings. There are even some modes for 'dark painting'. Use the keys 0-9 to quickly switch modes.

normal: Used for fading out the current painting.
 
average, screen, add: Additive blend modes. Simulates traditional light painting.

lighten: Only the brightest light will show. Allows painting for a very long time without over-exposing the picture.

darken: Similar to lighten, but darkness is sticky. Can be used in extremely bright environments.

multiply: darkening effect.

linearlight: High contrast lightening.

linearburn: High contrast darkening.

pinlight: a mix between lighten and darken

TODO: create gifs 


keyboard shortcuts
-------



FAQs
========


It's not working!
-----
If the app isn't working, make sure Chrome is up to date. Open chrome and go to chrome://chrome to ask it to update itself.

Make sure the webcam is plugged in, and test to see if it works (https://apprtc.appspot.com). If it fails, then try updating the drivers for your webcam.


How can I use a different webcam?
-----
In Chrome, go to chrome://settings/content, find the Media section, and select your camera.


Can I use a DSLR with LPL?
-----
Yes, but it requires 3rd party software. Generally the video feed from DSLR to webcam is low resolution and low framerate. We don't recommend it.

[links to dslr -> webcam programs]
http://sparkosoft.com/how-to-use-dslr-as-webcam
http://extrawebcam.com/


Can I record light painting videos?
-----
Yes, by using as screen-casting program. Quicktime has this feature built-in. There is also a free web-based program called Screencast-o-matic (www.screencast-o-matic.com).


How can I get rid of film noise?
-----
Most webcams default to using auto-exposure. This is not ideal for light painting. In complete darkness, it will use the maximum exposure, which makes the video very noisy. Use your webcam's driver software to control settings on the webcam, or use a universal webcam controller like Webcam Settings (Mac) (https://itunes.apple.com/us/app/webcam-settings/id533696630?mt=12
).


How can I fade out my light painting?
-----
Short fades are possible by switching modes; like 'screen' to 'normal'.

This formula can be used to determine the duration of the fades. Each frame will subtract 1 value from the current color, of which there are 256 possible values.

256 (color values) / 60 (frames per second) = 4.3 seconds


Where can I buy light tools?
-----
http://lightpaintingbrushes.com/
Jason Page created a flexible, extensible light painting brush system. We highly recommend it.

Blinky Tape. http://blinkinlabs.com/blinkytape/
Programmable 60-led RGB strip. 

Smartphones and tablets are amazing light tools. You can use videos, gifs, or images as light tools!


Installation walkthrough video
------
external link via thumbnail with play button

1. Go to chrome app store (this needs to be done in Chrome)
2. buy
3. launch from chrome app panel
4. do a light painting



Open Source
=======

Here are some open source light painting programs. LPL no longer maintains these projects, but we hope they will be useful to someone. 

LPL Heavy
The original desktop light painting app. Flex / Actionscript 3.

LPL Android (https://github.com/positlabs/lightpainter)
Simple light painting app for Android devices. Java.

LPL Post (?)
Post-process for converting normal videos into light painting videos. Processing (Java).


Footer
=======
FB like
Google +1 
josh@lightpaintlive.com








Mercury App
=======
add an info icon that opens an overlay with support email and link to site
