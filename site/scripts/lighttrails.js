var canvas;
var stage;
var ctx;
var fadeRect;

var viewToDocRatioY;
var viewWidth = 0;
var viewHeight = 0;

var iPad;

var imgs;
var particles = [];

var accelLimit = 6;
var speed = .04;
var fadeStrength = .03;
var particleBrightness = .3;
var clearCanvas = false;

// this just needs a #canvas element

function addParticle() {
	// alert("addParticle()");
	var p = new Particle(imgs[Math.round(Math.random() * imgs.length)]);
	particles.push(p);
	var bmp = p.bmp;

	// randomly determine offscreen spawn positions
	if(Math.random() > .5)
		bmp.x = canvas.width + 100;
	else
		bmp.x = -100;
	bmp.y = Math.random() * canvas.height;
	
	stage.addChild(bmp);
}

var wait;
function initLightTrails() {
	wait = setTimeout("doInitLightTrails()", 5000);
}

function doInitLightTrails() {
	iPad = (navigator.userAgent.match(/iPad/i) != null);
	canvas = document.getElementById("canvas");

	setSize();

	// viewToDocRatioY = viewHeight / $(document).height();
	// canvas.width = $(window).width();
	// canvas.height = $(window).height();
	canvas.width = viewWidth;
	canvas.height = viewHeight;
	ctx = canvas.getContext("2d");
	stage = new Stage(canvas);
	stage.autoClear = false;

	// pick a random color set
	var randColor = Math.random() * 3;
	if(randColor < 1)
		imgs = ["imgs/lightBrushes/pb01.png", "imgs/lightBrushes/pb02.png", "imgs/lightBrushes/pb03.png"];
	else if(randColor < 2)
		imgs = ["imgs/lightBrushes/pr01.png", "imgs/lightBrushes/pr02.png", "imgs/lightBrushes/pr03.png"];
	else if(randColor < 3)
		imgs = ["imgs/lightBrushes/pp01.png", "imgs/lightBrushes/pp02.png", "imgs/lightBrushes/pp03.png"];

	var pCount = 3;
	if(iPad)
		pCount = 1;
	for(var i = 0; i < pCount; i++) {
		addParticle();
	};

	//
	fadeRect = new Shape();
	var g = fadeRect.graphics;
	fadeRect.alpha = .02;
	g.beginFill(Graphics.getRGB(0, 0, 0));
	// g.drawRect(0, 0, $(window).width(), $(window).height());
	g.drawRect(0, 0, canvas.width, canvas.height);
	g.endFill();
	g.draw(ctx);
	stage.addChild(fadeRect);

	if(iPad)
		Ticker.setFPS(18);
	else
		Ticker.setFPS(24);
	Ticker.addListener(window);
}

/**
 * 
 * CONTROLS FOR USER
 * 
 */


function removeParticle() {
	if(particles.length > 0)
		stage.removeChild(particles.pop().bmp);
}

function particleSpeed(delta){
	speed += delta;
	if(speed < .0001) speed = .0001;
	for(var i = 0; i < particles.length; i++) {
		particles[i].accelRate = 2/particles[i].bmp.scaleY * speed;
	}
}
function brighness(delta){
	particleBrightness += delta;
	if(particleBrightness < .01) particleBrightness = .01;
	else if(particleBrightness > 1)particleBrightness = 1;
	
	for(var i = 0; i < particles.length; i++) {
		particles[i].bmp.alpha = particles[i].bmp.scaleY / 3.5 * particleBrightness;
;
	}
}

/**
 * 
 * UPDATE FUNCTIONS
 *  
 */
function tick() {

	for(var i = 0; i < particles.length; i++) {
		updateParticle(particles[i]);
	};

	//fade every % ticks
	if(Ticker.getTicks() % 3 == 0)
		fadeRect.alpha = fadeStrength;
	// else if(Ticker.getTicks() % 100 == 0)
		// fadeRect.alpha = .1;
	else
		fadeRect.alpha = 0;
	
	//clear the canvas if the flag is set	
	if(clearCanvas){
		fadeRect.alpha = 1;
		clearCanvas = false
	}

	stage.update();
}

function updateParticle(p) {
	// update acceleration
	if(stage.mouseX > p.bmp.x)
		p.accel[0] += p.accelRate;
	else
		p.accel[0] -= p.accelRate;
	// if(stage.mouseY * viewToDocRatioY > p.bmp.y)
	if(stage.mouseY > p.bmp.y)
		p.accel[1] += p.accelRate;
	else
		p.accel[1] -= p.accelRate;

	// limit acceleration
	if(p.accel[0] > accelLimit)
		p.accel[0] = accelLimit;
	else if(p.accel[0] < -accelLimit)
		p.accel[0] = -accelLimit;
	if(p.accel[1] > accelLimit)
		p.accel[1] = accelLimit;
	else if(p.accel[1] < -accelLimit)
		p.accel[1] = -accelLimit;

	p.bmp.x += p.accel[0];
	p.bmp.y += p.accel[1];

	p.bmp.rotation += (Math.abs(p.accel[0])) * .3;
}

function Particle(imgPath) {
	this.bmp = new Bitmap(imgPath);
	this.bmp.regX = this.bmp.image.width * .5;
	this.bmp.regY = this.bmp.image.height * .5;
	
	// max scaleX is .81 // min is .01
	this.bmp.scaleX = Math.random() * .8 + .01;
	// max scaleY is 3.4 // min is .16
	this.bmp.scaleY = (.86 - this.bmp.scaleX) * 4;
	
	this.accel = [0, 0];
	this.accelRate = 3.5/this.bmp.scaleY * speed;
	
	this.bmp.alpha = this.bmp.scaleY / 3.5 * particleBrightness;
	this.bmp.compositeOperation = "lighter";
}

function setSize() {
	if( typeof (window.innerWidth ) == 'number') {
		//Non-IE
		viewWidth = window.innerWidth;
		viewHeight = window.innerHeight;
	} else if(document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight )) {
		//IE 6+ in 'standards compliant mode'
		viewWidth = document.documentElement.clientWidth;
		viewHeight = document.documentElement.clientHeight;
	} else if(document.body && (document.body.clientWidth || document.body.clientHeight )) {
		//IE 4 compatible
		viewWidth = document.body.clientWidth;
		viewHeight = document.body.clientHeight;
	}
}