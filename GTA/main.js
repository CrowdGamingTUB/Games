// ###############################################################
// ########################   GAME: GTA   ########################
// ###############################################################

//############ Adjustable parameters ############
//###############################################
//+++ targetSpeed: default speed of moving objects (increases over time)
//+++ MIN_INTERVAL_Shot: minumum time between two shots
//+++ turnTime: time in seconds in the gray/disabled mode of the target
//+++ sessionDuration: time in seconds for each session till restart

// game characteristics
var targetSpeed = 3;
const MIN_INTERVAL_Shot = 250; // could be used for reload function
var turnTime = 2;

// duration
if (isTraining == 1)
	testDuration = trainingDuration - 1;
else
	testDuration = gamingDuration - 1;

// only for GTA
var sessionDuration = 27;

// hasPlayed validation
var InputThreshold = 230;

//############ game elements ############
//#######################################
var MyTarget;
var hits_x = [];
var hits_y = [];
var img; 
var targetSpeed_default = targetSpeed;
var acceptHit = false;
var mouseCrossX = 0;
var mouseCrossY = 0;
var mousePositionQ=[];
// states and counter
var score = 0;
var col;
var delayedFrames = Math.ceil(60*delay_val/1000);
var restartState;
var inputDelayState;
var testloop;
var turnCounter = 0;
var shotCounter = 0;
var hitCounter = 0;
var maxPoint = 0;
var mediumPoint = 0;
var lowPoint = 0;
var minPoint = 0;
var multiplier = 1;	// could be implemented but may confuse player
var myFrameCount = 0;
//in second
var gameStarted = false;
var gameRestarting = false;
var restart_counter = 5;
var gameStartDate = null;
var sessionStartDate = null;
var timeLeft = testDuration;
var sessionTimeLeft = sessionDuration;
var lasthitTime = new Date();;
var hitTime = null;
var timeBetweenHits = null;
var playTime = 0;
var previousTime = 0;
var numberOfTries = 1;
// logs
var scoreLog = [];
var targetSpeedLog = [];
var multiplierLog = [];
var keyLog = [];
var timeLog = [];
var shotCounterLog = [];
var hitCounterLog = [];
var maxPointLog = [];
var mediumPointLog = [];
var lowPointLog = [];
var minPointLog = [];
var highscore = 0;
// draw flag
var drawit = true;

//############ log data #############
//###################################
if (isTraining == 1)
	var gameID = "GTA_" + game_code + "_0_3";
else
	var gameID = "GTA_" + game_code + "_3";
var hasPlayed = 1;
var statsMD5;



// store data
String.prototype.format = String.prototype.f = function() {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

function preload() {
	// load backgroud image for game
	img = loadImage("GTA.jpg");
}

// game setup function (canvas etc.)
function setup() {
	if (!gameStarted){
		gameStarted = true;
		gameStartDate = new Date();
		sessionStartDate = new Date();
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
	
	var size = 125;
	MyTarget = new Target(width - size, 0.4*height, size);
}

function draw() {	
	if (frameCount % round(60/fps) == 0)
		drawit=true;
	else	
		drawit=false;
	
	if (drawit){
		background(img);
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
	
	handleTarget();
}

function drawHUD() {

	stroke(255);
	strokeWeight(5);

	/* draw score */
	fill(255,255,255);
	noStroke();
	text("Time left: " + timeLeft + " sec",  0.2*(width), 0.1*windowHeight);
	text("Score: " + score,  0.5*(width), 0.1*windowHeight);
	text("Accuracy: " + hitCounter + "/" + shotCounter,  0.8*(width), 0.1*windowHeight);
	text("Session: " + sessionTimeLeft + " sec",  0.81*(width), 0.7*windowHeight);
}

function handleTarget() {
	
	// draw moving target
	if (drawit)
		MyTarget.draw();
	
	MyTarget.update(targetSpeed);
	
	// draw red mouse pointer
	strokeWeight(0);
	fill(255, 0, 0);
	if (drawit)
		ellipse(mouseCrossX, mouseCrossY, 8, 8);
	
	// check if target was hitted
	if (mouseIsPressed === true){
		// only accept a new click after some time passed
		hitTime = new Date();
		timeBetweenHits = Math.floor(hitTime.getTime() - lasthitTime.getTime());
		if (timeBetweenHits > MIN_INTERVAL_Shot){
			lasthitTime = hitTime;
			acceptHit = true;
		}
	}
	if (acceptHit && !gameRestarting)
		DelayShotState = setTimeout(DelayShot, delay_val);
	acceptHit = false;
}

function DelayShot (){
	if (typeof MyTarget != "undefined")
		MyTarget.hits();
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

function endGame() {
	gameRestarting = true;
	noLoop();
	noStroke();
	restart_counter = 5;	
	document.getElementById("RestartDiv").style.padding = "10px";
	document.getElementById("Restart_Text").textContent="Time is over!";
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
	lowPointLog.push(lowPoint);
	minPointLog.push(minPoint);
	keyLog.push("|");
	if (score > highscore)
		highscore = score;
	numberOfTries++;
	// reset
	myFrameCount = 0;
	score = 0;
	multiplier = 1;
	targetCounter = 0;
	shotCounter = 0;
	hitCounter = 0;
	maxPoint = 0;
	mediumPoint = 0;
	lowPoint = 0;
	minPoint = 0;
	textSize(40);
	hits_x = [];
	hits_y = [];
	MyTarget.x = 0.8*width - 0.5*MyTarget.size;
	sessionTimeLeft = sessionDuration;
	sessionStartDate = new Date();
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
	lowPointLog.push(lowPoint);
	minPointLog.push(minPoint);
	playTime = round(frameCount/60) - previousTime;
	timeLog.push(playTime);
	if (score > highscore)
		highscore = score;
	stats=getPlayStats();
	vcode=uuidv4();
	console.log(stats);
	gameStarted=false;
	
	// check if played properly based on number of inputs
	if (keyLog.length < InputThreshold*0.2*(testDuration/90))
		hasPlayed = 0;
		
	// put md5 before keyLog
	statsMD5 = md5(stats);
	
	// call to the finish page..
	if (SendToServer){
		query="?pid=NN&gid={0}&gv={1}&c={2}&pd={3}&pt={4}:{5}&train={7}&hp={8}&md={9}&st{10}&gs={6}";
		call=query.f(gameID,gameVersion,vcode,gameStartDate.toISOString().split('T')[0],gameStartDate.getHours(),gameStartDate.getMinutes(),stats,isTraining,hasPlayed,statsMD5,showToken);
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
	stats= "test::dur:{0};ntry:{1};hs:{2};scores:{3};playingtime:{4};targetSpeed:{5};shotCounter:{6};hitCounter:{7};maxPoint:{8},mediumPoint:{9},lowPoint:{10},minPoint:{11},keys:{12};system:wiw:{13};wih:{14};nacn:{15};np:{16}";
	return stats.f(testDuration,numberOfTries,highscore,JSON.stringify(scoreLog),JSON.stringify(timeLog),JSON.stringify(targetSpeedLog),JSON.stringify(shotCounterLog),JSON.stringify(hitCounterLog),JSON.stringify(maxPointLog),JSON.stringify(mediumPointLog),JSON.stringify(lowPointLog),JSON.stringify(minPointLog),JSON.stringify(keyLog),window.innerWidth,window.innerHeight,navigator.appCodeName,navigator.platform);
}

function updateTimer(){
	var now = new Date();
	var seconds = Math.floor((now.getTime() - gameStartDate.getTime()) / 1000);
	timeLeft = testDuration - seconds;
	if (timeLeft <= 0)
		testPeriodisOver();
	var sessionTime = Math.floor((now.getTime() - sessionStartDate.getTime()) / 1000);
	sessionTimeLeft = sessionDuration - sessionTime;
	if ((sessionTimeLeft <= 0) && (!gameRestarting))
		endGame();
}