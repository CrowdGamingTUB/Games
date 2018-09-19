// ###############################################################
// ###################   GAME: Shooting Range   ##################
// ###############################################################

//############ Adjustable parameters ############
//###############################################
//+++ targetSpeed: default speed of moving objects (increases over time)
//+++ speed_gain: movement speed gained over time
//+++ MIN_INTERVAL_Shot: minumum time between two shots
//+++ MIN_INTERVAL_Spawn: time till spawn of new target (unless no target available)


// game characteristics
var targetSpeed = 3;
const MIN_INTERVAL_Shot = 250;
const MIN_INTERVAL_Spawn = 3000;
var speed_gain = 1.08

// duration
if (isTraining == 1)
	testDuration = trainingDuration;
else
	testDuration = gamingDuration;

// hasPlayed validation
var InputThreshold = 410;

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
var now = new Date();
var gameStarted = false;
var gameRestarting = false;
var restart_counter = 5;
var gameStartDate = null;
var timeLeft = testDuration;
var lasthitTime = new Date();
var hitTime = null;
var timeBetweenHits;
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
var mouseDown = false;
// point msg
var showPointsState;
var showPoints = 0;
var showPoints_x;
var showPoints_y;
// draw flag
var drawit = true;
// sound file
var sound;
var medal = 1;
var sound_medal;
// positions and other calculations
var rnd;
var hitReady;
var bullet_x;
var bullet_y;
var bullet_dx;
var bullet_dy;
var time_x;
var diff_x;
var accu_x;
var texts_y;
var hud_x;
var hud_y;
var hud_dx;
var hud_dy;
var s_x;
var s_y;
var s_dx;
var s_dy1;
var s_dy2;


//############ log data #############
//###################################
if (isTraining == 1)
	var gameID = "Shooting_" + game_code + "_0_3";
else
	var gameID = "Shooting_" + game_code + "_3";
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
	bullet_false = loadImage("bullet_false.png");
	bullet_true = loadImage("bullet_true.png");
	myFont = loadFont("coolvetica.ttf");
	cursor = loadImage("cursor.png");
}

function showPopup(){
	swal('You left the game tab', '... please press "F5" to restart the game!', 'error');
	noLoop();
	clearInterval(testloop);
}

function loadPositions(){
	bullet_x = 0.1*width-bullet_true.width/20;
	bullet_y = 0.95*height-bullet_true.height/20;
	bullet_dx = bullet_true.width/20;
	bullet_dy = bullet_true.height/20;
	time_x = 0.2*(width);
	diff_x = 0.5*(width);
	accu_x = 0.8*(width);
	texts_y = 0.1*windowHeight;
	hud_x = 0.68*width;
	hud_y = 0.75*height;
	hud_dx = 0.3*width;
	hud_dy = 0.22*height;
	s_x = 0.72*width;
	s_y = 0.82*height;
	s_dx = (s_x/width+0.15)*width;
	s_dy1 = (s_y/height+0.05)*height;
	s_dy2 = (s_y/height+0.1)*height;
}

// game setup function (canvas etc.)
function setup() {
	document.addEventListener("blur", showPopup);
	textFont(myFont);
	textSize(40);
	if (!gameStarted){
		gameStarted=true;
		gameStartDate= new Date();
		testloop = setInterval(updateTimer, 10);
	}
   
	var cnv = createCanvas(0.9*windowWidth, 0.8*windowHeight);
	var x = 0.05*windowWidth;
	var y = (windowHeight - height) / 2;
	cnv.position(x, y);
	document.getElementById("RestartDiv").style.padding = "0px";
	document.getElementById("Restart_Text").style.fontSize = "xx-large"; 
	textAlign(CENTER);
	loadPositions()
	sound = new Audio('barreta.mp3');
	sound_medal = new Audio('medal.wav');
}

function draw() {
	if (frameCount % round(60/fps) == 0)
		drawit=true;
	else	
		drawit=false;
	
	drawHUD();
		
	// create mousePostion object every frame and store it in array
	// random number for packet loss ... will be used global from here
	rnd = Math.floor((Math.random() * 1000))/10;
	if (rnd >= PL){
		mp = new MousePosition(mouseX,mouseY);
		mousePositionQ.push(mp);
		if (mousePositionQ.length >= delayedFrames){
			oldP = mousePositionQ.shift();
			mouseCrossX = oldP.x;
			mouseCrossY = oldP.y;
			var logTime = Math.floor(now.getTime() - oldP.mouseTime.getTime());
		}else{
			mouseCrossX = mousePositionQ[0].x;
			mouseCrossY = mousePositionQ[0].y;
		}
	}
	
	handleLevel(frameCount);
	handleTargets();
}

function drawHUD() {	

	if (drawit){
		background(0);
		// timer
		fill(255, 255, 2555, 188);
		stroke(0, 0, 153);
		strokeWeight(2);
		textAlign(CENTER);
		text("Time left: " + timeLeft + " sec",  time_x, texts_y);
		
		if (feedback == 1)
			text("Score: " + score,  accu_x, texts_y);
		
		if (feedback >= 2){
			// box for stats and score
			fill(102, 153, 255, 127);
			rect(hud_x, hud_y, hud_dx, hud_dy, 20, 10, 10, 5);
			textSize(35);
			textAlign(LEFT);
			fill(255, 255, 2555, 188);	
			text("Score: ", s_x, s_y);
			text(score, s_dx, s_y);
			
			// medals
			if (score < 1000){
				text("Your Medal:", s_x, s_dy1);
				text("-", s_dx, s_dy1);
				text("Bronze:", s_x, s_dy2);
				text("1000", s_dx, s_dy2);
			}else if (score < 5000){
				text("Your Medal:", s_x, s_dy1);
				text("Bronze", s_dx, s_dy1);
				text("Silver:", s_x, s_dy2);
				text("5000", s_dx, s_dy2);
				if (medal == 1){
					sound_medal.play();
					medal = 2;
				}
			}else if (score < 7500){	
				text("Your Medal:", s_x, s_dy1);
				text("Silver", s_dx, s_dy1);
				text("Gold: ", s_x, s_dy2);
				text("7500", s_dx, s_dy2);
				if (medal == 2){
					sound_medal.play();
					medal = 3;
				}
			}else if (score < 12000){
				text("Your Medal:", s_x, s_dy1);
				text("Gold", s_dx, s_dy1);
				text("Platinum:", s_x, s_dy2);
				text("12000", s_dx, s_dy2);
				if (medal == 3){
					sound_medal.play();
					medal = 4;
				}
			}else if (score > 11999){	
				text("Your Medal:", s_x, s_dy1);
				text("Platinum", s_dx, s_dy1);
				if (medal == 4){
					sound_medal.play();
					medal = 5;
				}
			}
			textSize(40);
		}
		
		if (feedback == 3){
			// show bullet icon
			if (hitReady)
				image(bullet_true, bullet_x, bullet_y, bullet_dx, bullet_dy);
			else
				image(bullet_false, bullet_x, bullet_y, bullet_dx, bullet_dy);
			
			// speed and accuracy
			textAlign(CENTER);
			var diff = round(targetSpeed*100)/100 - 2;
			text("Difficulty: " + Number.parseFloat(diff).toFixed(1),  diff_x, texts_y);
			text("Accuracy: " + hitCounter + "/" + shotCounter,  accu_x, texts_y);
		}
	}
	
	// points popping up
	if (!(showPoints == 0) && (feedback == 3)){
		textSize(30);
		if (showPoints==100){
			fill(255,193,37);
			if (drawit)
				text("+100", showPoints_x, showPoints_y);
			if (frameCount%3)
				showPoints_y = showPoints_y - 1;
		}
		else if (showPoints==50){
			fill(205,51,51);
			if (drawit)
				text("+50", showPoints_x, showPoints_y);
			if (frameCount%3)
				showPoints_y = showPoints_y - 1;
		}
		else if (showPoints==25){
			fill(92,172,238);
			if (drawit)
				text("+25", showPoints_x, showPoints_y);
			if (frameCount%3)
				showPoints_y = showPoints_y - 1;
		}
		else if (showPoints==-25){
			fill(205,51,51);
			if (drawit)
				text("-25", showPoints_x, showPoints_y);
			if (frameCount%3)
				showPoints_y = showPoints_y + 1;
		}
		textSize(40);
	}
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
		image(cursor, mouseCrossX - 16, mouseCrossY - 16, 32, 32);
		// ellipse(mouseCrossX, mouseCrossY, 8, 8);
	
	// check if target was hitted
	for (var i = 0; i < Targets.length; i++) {	
		//end if Target reaches left screen border
		if (!Targets[0].onScreen){
			endGame();
			break;
		}
		
		// mousePressed is expected here
		
		if (acceptHit && !gameRestarting)
			DelayShotState = setTimeout(DelayShot, delay_val, i);
		acceptHit = false;
	}
}

function showPointsTimer(){
	showPoints = 0;
	clearTimeout(showPointsState);
}
			
function mousePressed(){
	// only accept a new click after some time passed
	timeBetweenHits = Math.floor(now.getTime() - lasthitTime.getTime());
	if ((timeBetweenHits > MIN_INTERVAL_Shot) && (!mouseDown))
		acceptHit = true;
}

function mouseReleased(){
	mouseDown = false;
}

function DelayShot (i){
	if (typeof Targets[i] != "undefined"){
		
		if (rnd >= PL){
			if (feedback >= 2){
				if (!sound.paused ) {
					sound.pause();
					sound.currentTime = 0;
					sound.play();
				} else {
					sound.play();
				}
			}
			Targets[i].hits(i,3);
		}
	}
}

function myMouseMove (){
	var keyStamp = Math.floor(now.getTime() - gameStartDate.getTime());
	mouseCrossX = mouseX;
	mouseCrossY = mouseY;
}

function MousePosition(x,y){
	this.mouseTime = new Date();
	this.x = x;
	this.y = y;
}

function handleLevel(n) {
	myFrameCount += 1;
	if (Targets.length == 0){
		newTarget();
		lastSpawnTime = now;
	}
	else{
		timeBetweenSpawns = Math.floor(now.getTime() - lastSpawnTime.getTime());
		if (timeBetweenSpawns > MIN_INTERVAL_Spawn){
			newTarget();
			lastSpawnTime = now;
		}	
	}
	if (n % 240 === 0) // every 4 seconds
		targetSpeed *= speed_gain; // speed up
}

function newTarget() {
	var size = random(30) + 150;
	var obs = new Target(width + size, random(0.3,0.6)*height, size);
	Targets.push(obs);
}

function endGame() {
	gameRestarting = true;
	noLoop();
	noStroke();
	restart_counter = 5;	
	document.getElementById("RestartDiv").style.padding = "10px";
	document.getElementById("Restart_Text").textContent="You Lost!";
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
			clearInterval(restartState);
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
	
	// check if played properly based on number of inputs
	var hasPlayed = 1;
	if (keyLog.length < InputThreshold*0.2*(testDuration/90))
		hasPlayed = 0;
		
	// put md5 before keyLog
	statsMD5 = md5(stats);
	
	// call to the finish page..
	if (SendToServer){
		query="?pid=NN&gid={0}&gv={1}&c={2}&pd={3}&pt={4}:{5}&train={7}&hp={8}&md={9}&st={10}&gs={6}";
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
	stats= "test::dur:{0};ntry:{1};hs:{2};scores:{3};playingtime:{4};targetSpeed:{5};shotCounter:{6};hitCounter:{7};maxPoint:{8},mediumPoint:{9},minPoint:{10},keys:{11};system:wiw:{12};wih:{13};nacn:{14};np:{15}";
	return stats.f(testDuration,numberOfTries,highscore,JSON.stringify(scoreLog),JSON.stringify(timeLog),JSON.stringify(targetSpeedLog),JSON.stringify(shotCounterLog),JSON.stringify(hitCounterLog),JSON.stringify(maxPointLog),JSON.stringify(mediumPointLog),JSON.stringify(minPointLog),JSON.stringify(keyLog),window.innerWidth,window.innerHeight,navigator.appCodeName,navigator.platform);
}

function updateTimer(){
	now = new Date();
	var seconds = Math.floor((now.getTime() - gameStartDate.getTime()) / 1000);
	timeLeft = testDuration - seconds;
	if (timeLeft <= 0)
		testPeriodisOver();
	
	if (Math.floor(now.getTime() - lasthitTime.getTime()) > MIN_INTERVAL_Shot)
		hitReady = true;
	else
		hitReady = false;
}