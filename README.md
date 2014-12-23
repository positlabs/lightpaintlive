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
Mercury has 4 modes for capturing light. Use the keys 0-3 to quickly switch modes.

normal: Used for fading out the current painting.
 
average, screen, add: Additive blend modes. Simulates traditional light painting.

lighten: Only the brightest light will show. Allows painting for a very long time without over-exposing the picture.

darken: Similar to lighten, but darkness is sticky. Can be used in extremely bright environments.

TODO: create gifs 


keyboard shortcuts
-------
Mode: 0, 1, 2, 3
Fullscreen: f, f11
New: n
Save: s
Trigger: spacebar



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
josh@lightpaintlive.com



Story
=====

LPL started as a simple prototype. It had two buttons and was very slow. It was discovered by Joerg Miedza, a prominent member of the light-painting community. The app was very limited, but Miedza saw it as the next step in the evolution of light-painting. He wanted to know if it could be improved, so he emailed the developer. Ever since then, Josh and Joerg have been exchanging ideas and improving LPL. Miedza was overflowing with enthusiasm and ideas. He was the driving force behind the LPL project. Without him, the program would still have only two controls!

Joerg Miedza: Artist
Miedza has been creating movies and photos using special techniques since the late 90’s. He is the co-founder of the german light-art project LAPP-PRO. In this project, the LAPP-Team developed a unique brand of light painting: LightArt Performance Photography, or LAPP for short. The skills Miedza acquired working with motion pictures allowed him to contribute significantly to the performance and artistic aspect of LAPP photography.
His personal work is at miedza.de 
Email: joerg@miedza.de 
There is also a book of the work: Painting With Light

Josh Beckwith: Developer
Josh has always been obsessed with science and technology - and as a child, he dreamed of becoming an inventor. Now, he's a senior interactive developer at Tool of North America.
Email: josh@lightpaintlive.com





Mercury App
=======
add an info icon that opens an overlay with support email and link to site
