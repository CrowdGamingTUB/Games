//############ Adjustable parameters ############
//###############################################
//+++ delay_val: simulates x milliseconds of input delay
//+++ PL: simulates x % of command packets been droped
//+++ fps: sets the frame rate of the game: default = 60
//+++ testDuration: time in seconds till the game ends
//+++ targetSpeed: default speed of moving objects (increases over time)
//+++ speed_gain: movement speed gained over time
//+++ MIN_INTERVAL_Shot: minumum time between two shots
//+++ MIN_INTERVAL_Spawn: time till spawn of new target (unless no target available)

// network or encoding
var delay_val = 0;
var PL = 0;
var fps = 60;
// game characteristics
var targetSpeed = 3;
const MIN_INTERVAL_Shot = 250;
const MIN_INTERVAL_Spawn = 3000;
var speed_gain = 1.1
// others
var testDuration = 90;

//############ game elements ############
//#######################################
var Targets = [];
// states and counter
var score = 0;
var col;
var delayedFrames = Math.ceil(60*delay_val/1000);
var restartState;
var inputDelayState;
var testloop;
var targetHitCounter = 0;
var shotCounter = 0;
var hitCounter = 0;
var maxPoint = 0;
var mediumPoint = 0;
var minPoint = 0;
var multiplier = 1;
var myFrameCount = 0;
//in second
var gameStarted = false;
var gameRestarting = false;
var restart_counter = 5;
var gameStartDate = null;
var timeLeft = testDuration;
var lasthitTime = new Date();;
var hitTime = null;
var timeBetweenHits = null;
var numberOfTries = 1;
var scoreLog = [];
var targetSpeedLog = [];
var multiplierLog = [];
var keyLog = [];
var timeLog = [];
var shotCounterLog = [];
var hitCounterLog = [];
var maxPointLog = [];
var mediumPointLog = [];
var minPointLog = [];
var highscore = 0;
var playTime = 0;
var previousTime = 0;
var targetSpeed_default = targetSpeed;
var acceptHit = false;
var mouseCrossX = 0;
var mouseCrossY = 0;
var mousePositionQ=[];
// draw flag
var drawit = true;

//############ log data #############
//###################################
var SendToServer = false;
var gameID = "Shooting_C0";
var gameVersion = "05072018v1";
var baseURL = "http://gamingqoe.qu.tu-berlin.de/store/verification.php?"

// store data
String.prototype.format = String.prototype.f = function() {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

// game setup function (canvas etc.)
function setup() {
	// ST: might not be necessary
	if (!gameStarted){
		gameStarted=true;
		gameStartDate= new Date();
		testloop= setInterval(updateTimer, 1000);
	}
   
	var cnv = createCanvas(0.9*windowWidth, 0.8*windowHeight);
	var x = 0.05*windowWidth;
	var y = (windowHeight - height) / 2;
	cnv.position(x, y);
	document.getElementById("RestartDiv").style.padding = "0px";
	document.getElementById("Restart_Text").style.fontSize = "xx-large"; 
	textAlign(CENTER);
	textSize(40);
}

function draw() {
	if (frameCount % round(60/fps) == 0)
		drawit=true;
	else	
		drawit=false;
	
	if (drawit){
		background(0);
		drawHUD();
	}
	
	// create mousePostion object every frame and store it in array
	var rnd = Math.floor((Math.random() * 1000))/10;
	if (rnd >= PL){
		mp = new MousePosition(mouseX,mouseY);
		mousePositionQ.push(mp);
		if (mousePositionQ.length >= delayedFrames){
			oldP = mousePositionQ.shift();
			mouseCrossX = oldP.x;
			mouseCrossY = oldP.y;
			var now = new Date();
			var logTime = Math.floor(now.getTime() - oldP.mouseTime.getTime());
			// console.log("dT: " + logTime);
		}else{
			mouseCrossX = mousePositionQ[0].x;
			mouseCrossY = mousePositionQ[0].y;
		}
	}
	handleLevel(frameCount);
	handleTargets();
}

function drawHUD() {

	stroke(255);
	strokeWeight(5);

	/* draw score */
	fill(255,255,255);
	noStroke();
	text("Score: " + score,  0.5*(width), 0.1*windowHeight);
	text("Accuracy: " + hitCounter + "/" + shotCounter,  0.8*(width), 0.1*windowHeight);
	text("Time left: " + timeLeft + " sec",  0.2*(width), 0.1*windowHeight);
}

function handleTargets() {
	
	// draw moving target(s)
	for (var i = 0; i < Targets.length; i++) {
		Targets[i].update(targetSpeed);
		if (drawit)
			Targets[i].draw();
	}
	
	// draw red mouse pointer
	strokeWeight(0);
	fill(255, 0, 0);
	if (drawit)
		ellipse(mouseCrossX, mouseCrossY, 8, 8);
	
	// check if target was hitted
	for (var i = 0; i < Targets.length; i++) {	
		//end if Target reaches left screen border
		if (!Targets[0].onScreen){
			endGame();
			break;
		}
			
		if (mouseIsPressed === true){
			// only accept a new click after some time passed
			hitTime = new Date();
			timeBetweenHits = Math.floor(hitTime.getTime() - lasthitTime.getTime());
			if (timeBetweenHits > MIN_INTERVAL_Shot){
				lasthitTime = hitTime;
				acceptHit = true;
			}
		}
		if (acceptHit && drawit && !gameRestarting)
			DelayShotState = setTimeout(DelayShot, delay_val, i);
		acceptHit = false;
	}
}

function DelayShot (i){
	if (typeof Targets[i] != "undefined")
		Targets[i].hits(i,3);
}

function myMouseMove (){
	var now =  new Date();
	var keyStamp = Math.floor(now.getTime() - gameStartDate.getTime());
	mouseCrossX = mouseX;
	mouseCrossY = mouseY;
}

function MousePosition(x,y){
	this.mouseTime = new Date();
	this.x=x;
	this.y=y;
}

function handleLevel(n) {
	myFrameCount += 1;
	if (Targets.length == 0){
		newTarget();
		lastSpawnTime = new Date();
	}
	else{
		spawnTime = new Date();
		timeBetweenSpawns = Math.floor(spawnTime.getTime() - lastSpawnTime.getTime());
		if (timeBetweenSpawns > MIN_INTERVAL_Spawn){
			newTarget();
			lastSpawnTime = spawnTime;
		}	
	}
	if (n % 240 === 0) // every 4 seconds
		targetSpeed *= speed_gain; // speed up
	// score = round((myFrameCount * Math.pow(targetSpeed,2.5))/1000);
}

function newTarget() {
	var size = random(30) + 150;
	var obs = new Target(width + size, random(0.4,0.66)*height, size);
	Targets.push(obs);
}

function endGame() {
	gameRestarting = true;
	noLoop();
	noStroke();
	restart_counter = 5;	
	document.getElementById("RestartDiv").style.padding = "10px";
	document.getElementById("Restart_Text").textContent="GAME OVER";
	playTime = round(frameCount/60) - previousTime;
	timeLog.push(playTime);
	previousTime = round(frameCount/60);
	if (timeLeft > 3)
		restartState = setInterval(RestartCountdown, 666);
}

function RestartCountdown(){
	restart_counter--;
	switch (restart_counter) {
		case 3:
			document.getElementById("Restart_Text").textContent="Restarting in: 3";
			break;
		case 2:
			document.getElementById("Restart_Text").textContent="Restarting in: 2";
			break;
		case 1:
			document.getElementById("Restart_Text").textContent="Restarting in: 1";
			break;
		case 0:
			document.getElementById("Restart_Text").textContent="Restarting!";
			break;
		case -1:
			document.getElementById("Restart_Text").textContent="";	
			document.getElementById("RestartDiv").style.padding = "0px";
			clearTimeout(restartState);
			RestartGame();
			break;
	}
} 

function RestartGame(){
	// stats
	scoreLog.push(score);
	multiplierLog.push(multiplier);
	targetSpeedLog.push(round(10*targetSpeed)/10);
	hitCounterLog.push(hitCounter);
	shotCounterLog.push(shotCounter);
	maxPointLog.push(maxPoint);
	mediumPointLog.push(mediumPoint);
	minPointLog.push(minPoint);
	keyLog.push("|");
	if (score > highscore)
		highscore = score;
	numberOfTries++;
	// reset
	Targets = [];
	myFrameCount = 0;
	score = 0;
	multiplier = 1;
	targetCounter = 0;
	shotCounter = 0;
	hitCounter = 0;
	maxPoint = 0;
	mediumPoint = 0;
	minPoint = 0;
	targetSpeed = targetSpeed_default;
	textSize(40);
	gameRestarting = false;
	loop();
}

function testPeriodisOver()
{
	clearInterval(testloop);
	testloop = null;	
	document.getElementById("RestartDiv").style.padding = "10px";
	document.getElementById("Restart_Text").textContent="The playing time is over!";
	noLoop();
	noStroke();
	scoreLog.push(score);
	multiplierLog.push(multiplier);
	targetSpeedLog.push(round(10*targetSpeed)/10);
	hitCounterLog.push(hitCounter);
	shotCounterLog.push(shotCounter);
	maxPointLog.push(maxPoint);
	mediumPointLog.push(mediumPoint);
	minPointLog.push(minPoint);
	playTime = round(frameCount/60) - previousTime;
	timeLog.push(playTime);
	if (score > highscore)
		highscore = score;
	stats=getPlayStats();
	vcode=uuidv4();
	console.log(stats);
	gameStarted=false;
	return
	// call to the finish page..
	if (SendToServer){
		call=query.f(gameID,gameVersion,vcode,gameStartDate.toISOString().split('T')[0],gameStartDate.getHours(),gameStartDate.getMinutes(),stats);
		console.log(call);

		setTimeout(function() {
			window.location.href=baseURL+call;
		}, 1000);
	} 
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function getPlayStats(){
	stats= "test::dur:{0};ntry:{1};hs:{2};scores:{3};playingtime:{4};targetSpeed:{5};shotCounter:{6};hitCounter:{7};maxPoint:{8},mediumPoint:{9},minPoint:{10},keys:{11};system:wiw:{12};wih:{13};nacn:{14};np:{15}";
	return stats.f(testDuration,numberOfTries,highscore,JSON.stringify(scoreLog),JSON.stringify(timeLog),JSON.stringify(targetSpeedLog),JSON.stringify(shotCounterLog),JSON.stringify(hitCounterLog),JSON.stringify(maxPointLog),JSON.stringify(mediumPointLog),JSON.stringify(minPointLog),JSON.stringify(keyLog),window.innerWidth,window.innerHeight,navigator.appCodeName,navigator.platform);
}

function updateTimer(){
	var now=  new Date();
	var seconds = Math.floor((now.getTime() - gameStartDate.getTime()) / 1000);
	timeLeft = testDuration - seconds;
	if (timeLeft <= 0)
		testPeriodisOver();
}