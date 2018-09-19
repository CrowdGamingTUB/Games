// ###############################################################
// ####################   GAME: T-REX   ##########################
// ###############################################################

//############ Adjustable parameters ############
//###############################################
//+++ obstacleSpeed: how fast are the boxes moving
//+++ size: what is the size of the player
//+++ spawn_time: at x frames a new box might be spawned
//+++ speed_gain: how fast should the game become faster
//+++ speed_interval: at x frames the speed will be increased


// game characteristics
var obstacleSpeed = 12;
const size = 20;
var spawn_time = 50;
var speed_gain = 1.05;
var speed_interval = 240;

// duration
if (isTraining == 1)
	testDuration = trainingDuration;
else
	testDuration = gamingDuration;

// hasPlayed validation
var InputThreshold = 64;

//############ game elements ############
//#######################################
var horizon;
var obstacleSpeed;
var score = 0;
var boxscore = 0;
var obstacles = [];
var dino;

//############ states and counter ############
//############################################
var restartState;
var inputDelayState;
var testloop;
var obstaclesCounter = 0;
var jumpCounter = 0;
var myFrameCount = 0;
//in second
var gameStarted = false;
var gameStartDate = null;
var timeLeft = testDuration;
var numberOfTries = 1;
var scoreLog = [];
var boxesLog = [];
var jumpLog = [];
var keyLog = [];
var timeLog = [];
var playTime = 0;
var previousTime = 0;
var difficultyLog = [];
var obstacleSpeed_default = obstacleSpeed;
var highscore = 0;
// point msg
var showPointsState;
var showPoints = 0;
var showPoints_x;
var showPoints_y;
// draw flag
var drawit = true;
// sound file
var sound;
var sound_crash;
var medal = 1;
var sound_medal;
// positions and other calculations
var rnd;
var time_x;
var diff_x;
var box_x;
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
	var gameID = "TRex_" + game_code + "_0_3";
else
	var gameID = "TRex_" + game_code + "_3";
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
	myFont = loadFont("coolvetica.ttf");
}

function showPopup(){
	swal('You left the game tab', '... please press "F5" to restart the game!', 'error');
	noLoop();
	clearInterval(testloop);
}

function loadPositions(){
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
	window.addEventListener("blur", showPopup);
	textFont(myFont);
	textSize(40);
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
	loadPositions()
	sound = new Audio('jump.mp3');
	sound_crash = new Audio('crash.mp3');
	sound_medal = new Audio('medal.wav');
	
	horizon = 0.7*height;
	showPoints_x = 0.1*width;
	showPoints_y = 0.45*height;
	dino = new TRex(0.1*windowWidth, 0, 1.5*size);
}

function draw() {	
	drawHUD();
	handleLevel(frameCount);
	dino.update(horizon);
	handleObstacles();
}

function drawHUD() {
	
	if (frameCount % round(60/fps) == 0)
		drawit=true;
	else	
		drawit=false;

	if (drawit){
		background(0);
		
		/* draw horizon */
		stroke(102, 153, 255, 127);
		strokeWeight(5);
		line(0, horizon, width, horizon);

		/* draw T-Rex */
		dino.draw();
		
		/* HUD elements */
		stroke(0, 0, 153);
		strokeWeight(2);
		textAlign(CENTER);
		
		// timer
		fill(255, 255, 255, 188);
		text("Time left: " + timeLeft + " sec",  time_x, texts_y);
		
		if (feedback == 1)
			text("Score: " + round(score/10)*10,  accu_x, texts_y);
		
		if (feedback >= 2){
			// box for stats and score
			fill(102, 153, 255, 127);
			rect(hud_x, hud_y, hud_dx, hud_dy, 20, 10, 10, 5);
			textSize(35);
			textAlign(LEFT);
			fill(255, 255, 255, 188);	
			text("Score: ", s_x, s_y);
			text(round(score/10)*10, s_dx, s_y);
			
			// medals
			if (score < 500){
				text("Your Medal:", s_x, s_dy1);
				text("-", s_dx, s_dy1);
				text("Bronze:", s_x, s_dy2);
				text("500", s_dx, s_dy2);
			}else if (score < 1000){
				text("Your Medal:", s_x, s_dy1);
				text("Bronze", s_dx, s_dy1);
				text("Silver:", s_x, s_dy2);
				text("1000", s_dx, s_dy2);
				if (medal == 1){
					sound_medal.play();
					medal = 2;
				}
			}else if (score < 2500){	
				text("Your Medal:", s_x, s_dy1);
				text("Silver", s_dx, s_dy1);
				text("Gold: ", s_x, s_dy2);
				text("2500", s_dx, s_dy2);
				if (medal == 2){
					sound_medal.play();
					medal = 3;
				}
			}else if (score < 4000){
				text("Your Medal:", s_x, s_dy1);
				text("Gold", s_dx, s_dy1);
				text("Platinum:", s_x, s_dy2);
				text("4000", s_dx, s_dy2);
				if (medal == 3){
					sound_medal.play();
					medal = 4;
				}
			}else if (score > 3999){	
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
			textAlign(CENTER);
			text("Speed: " + Number.parseFloat(obstacleSpeed).toFixed(1),  diff_x, texts_y);
			text("Boxes: " + obstaclesCounter,  accu_x, texts_y);
		}
	}
	
	
	// points popping up
	if (!(showPoints == 0) && (feedback == 3)){
		textSize(30);
		if (showPoints==100){
			fill(205,51,51);
			if (drawit)
				text("+100", showPoints_x, showPoints_y);
			if (frameCount%3)
				showPoints_y = showPoints_y - 1;
		}
		else if (showPoints==50){
			fill(255,193,37);
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
		textSize(40);
	}
}

function showPointsTimer(){
	showPoints_y = 0.45*height;
	showPoints = 0;
	clearTimeout(showPointsState);
}

function handleObstacles() {
	
	for (var i = obstacles.length - 1; i >= 0; i--) {

		obstacles[i].update(obstacleSpeed);
		// skip drawing in case of frame drop
		if (drawit)
			obstacles[i].draw();

		if (obstacles[i].hits(dino)) // if there's a collision
			endGame();
		
		var currentSize = obstacles[0].size;
		
		if (!obstacles[i].onScreen) // if it's no longer showing
		{
			obstacles.splice(i, 1); // delete from array
			obstaclesCounter += 1;
			if (currentSize > 80){
				showPoints = 100;
				boxscore += 100;	
			}else if (currentSize > 70){
				showPoints = 50;
				boxscore += 50;	
			}else{
				showPoints = 25;
				boxscore += 25;
			}
			showPointsState = setTimeout(showPointsTimer, 1000);
		}
	}
}

/**
	* speeds game up, pushes new obstacles, & handles score
	*/
function handleLevel(n) {
	myFrameCount += 1;
	if (n % spawn_time === 0) { // every 0.5 seconds
		var n = noise(n); // noisey
		if (n > 0.5){
			newObstacle(); // push new obstacle
		}
	}
	if (n % speed_interval === 0) // every 2 seconds
		obstacleSpeed *= speed_gain; // speed up
	score = round((myFrameCount * Math.pow(obstacleSpeed,1.75))/1000) + boxscore;
}

/**
	* pushes random obstacle
	*/
function newObstacle() {

	var col = color(random(255), random(255), random(255));
	var size = random(30) + 60;
	var obs = new Obstacle(width + size, size, horizon, col);
	obstacles.push(obs);
}

function keyPressed() {
	var now =  new Date();
	var keyStamp = Math.floor(now.getTime() - gameStartDate.getTime());
	if (keyCode === 32)
		keyLog.push("up,"+keyStamp);
	if ((keyCode === UP_ARROW || keyCode === 32) && dino.onGround) // jump if possible
		inputDelayState = setTimeout(InputDelay, delay_val);
}

function InputDelay(){
	var rnd = Math.floor((Math.random() * 1000))/10;
	if ((dino.onGround) && (rnd >= PL))
	{		
		if (feedback >= 2){
			if (!sound.paused) {
				sound.pause();
				sound.currentTime = 0;
				sound.play();
			} else {
				sound.play();
			}
		}
		jumpCounter++;
		dino.jump();
	}
}


function endGame() {

	noLoop();
	noStroke();
	sound_crash.play();
	restart_counter = 5;	
	document.getElementById("RestartDiv").style.padding = "10px";
	document.getElementById("Restart_Text").textContent="You Lost!";
	playTime = round(frameCount/60) - previousTime;
	timeLog.push(playTime);
	previousTime = round(frameCount/60);
	if (timeLeft > 3)
		restartState = setInterval(RestartCountdown, 666);

}

//Steven
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
			RestartGame();
			// QuitGame();
			clearTimeout(restartState);
			break;
	}
} 

//Steven
function RestartGame(){
	// stats
	scoreLog.push(score);
	boxesLog.push(obstaclesCounter);
	jumpLog.push(jumpCounter);
	difficultyLog.push(round(10*obstacleSpeed)/10);
	keyLog.push("|");
	if (score > highscore)
		highscore = score;
	numberOfTries++;
	// reset
	obstacles = [];
	myFrameCount = 0;
	score = 0;
	obstaclesCounter = 0;
	obstacleSpeed = obstacleSpeed_default;
	jumpCounter = 0;
	textSize(40);
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
	boxesLog.push(obstaclesCounter);
	jumpLog.push(jumpCounter);
	difficultyLog.push(round(10*obstacleSpeed)/10);
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

//babak
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

//babak
function getPlayStats(){
	stats= "test::dur:{0};ntry:{1};hs:{2};scores:{3};playingtime:{4};difficulties:{5};boxes:{6};jumps:{7};keys:{8};system:wiw:{9};wih:{10};nacn:{10};np:{11}";
	return stats.f(testDuration,numberOfTries,highscore,JSON.stringify(scoreLog),JSON.stringify(timeLog),JSON.stringify(difficultyLog),JSON.stringify(boxesLog),JSON.stringify(jumpLog),JSON.stringify(keyLog),window.innerWidth,window.innerHeight,navigator.appCodeName,navigator.platform);
}

function updateTimer(){
	var now=  new Date();
	var seconds = Math.floor((now.getTime() - gameStartDate.getTime()) / 1000);
	timeLeft = testDuration - seconds;
	if (timeLeft <= 0)
		testPeriodisOver();
}