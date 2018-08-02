// game elements
var obstacleSpeed;
var score;
var obstacles = [];
var col = 0;

// states and counter
var restartState;
var inputDelayState;
var testloop;
var targetCounter = 0;
var jumpCounter = 0;
var myFrameCount = 0;
//in second
var testDuration = 90;
var gameStarted = false;
var gameStartDate = null;
var timeLeft = testDuration;
var LastHitTime = null;
var numberOfTries = 1;
var scoreLog = [];
var boxesLog = [];
var jumpLog = [];
var keyLog = [];
var timeLog = [];
var playTime = 0;
var previousTime = 0;
var difficultyLog = [];
var highscore = 0;
var targetHitCounter = 0;
var acceptHit = false;
var MouseCrossX = 0;
var MouseCrossY = 0;
var mousePositionQ=[];


// draw flag
var drawit = true;

var gameID = "TREX_C0";
var gameVersion = "05072018v1";
var baseURL = "http://gamingqoe.qu.tu-berlin.de/store/verification.php?"

// Network parameters
var delay_val = 1000;
var delayedFrames = Math.ceil(60*delay_val/1000);
var PL = 0;
var fps = 60;


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
	
	score = 0;
	obstacleSpeed = 1;
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
	mp = new MousePosition(mouseX,mouseY);
	mousePositionQ.push(mp);
	if (mousePositionQ.length >= delayedFrames){
		oldP = mousePositionQ.shift();
		MouseCrossX = oldP.x;
		MouseCrossY = oldP.y;
		var now = new Date();
		var logTime = Math.floor((now.getTime() - oldP.mouseTime.getTime()) / 1000);
		console.log("dT: " + logTime);
	}else{
		MouseCrossX = mousePositionQ[0].x;
		MouseCrossY = mousePositionQ[0].y;
	}
	
	handleLevel(frameCount);
	handleObstacles();
	//setTimeout(myMouseMove, delay_val);
}

function drawHUD() {

	stroke(255);
	strokeWeight(5);

	/* draw score */
	fill(255,255,255);
	noStroke();
	text("Score: " + round(score/10)*10,  0.5*(width), 0.1*windowHeight);
	text("Boxes: " + targetCounter,  0.8*(width), 0.1*windowHeight);
	text("Time left: " + timeLeft + " sec",  0.2*(width), 0.1*windowHeight);
}

function handleObstacles() {
	
	for (var i = 0; i < obstacles.length; i++) {

		obstacles[i].update(obstacleSpeed);
		// skip drawing in case of frame drop
		if (drawit)
			obstacles[i].draw();
	}
	
	strokeWeight(0);
	fill(255, 0, 0);
	ellipse(MouseCrossX, MouseCrossY, 8, 8);
	
	for (var i = 0; i < obstacles.length; i++) {	
		//end if obstacle reaches left screen border
		if (!obstacles[0].onScreen) // if it's no longer showing
		{
			endGame();
		}

		if (obstacles[i].hits(3)) // if target is hitted n times
			obstacles.splice(i, 1);
			
		// put slice in hits ?????? what is i,1?	
		DelayShotState = setInterval(DelayShot, delay_val);		
	}
}

function DelayShot (){
}

function myMouseMove (){
	var now =  new Date();
	var keyStamp = Math.floor(now.getTime() - gameStartDate.getTime());
	console.log(keyStamp);
	MouseCrossX = mouseX;
	MouseCrossY = mouseY;
}

function MousePosition(x,y){
	this.mouseTime = new Date();
	this.x=x;
	this.y=y;
}

/**
	* speeds game up, pushes new obstacles, & handles score
	*/
function handleLevel(n) {
	myFrameCount += 1;
	if (n % 60 === 0) { // every x seconds
		var n = noise(n); // noisey
		if (n > 0.5){
			newObstacle(); // push new obstacle
		}
	}
	if (n % 240 === 0) // every 4 seconds
		obstacleSpeed *= 1.025; // speed up
	score = round((myFrameCount * Math.pow(obstacleSpeed,2.5))/1000);
}

/**
	* pushes random obstacle
	*/
function newObstacle() {
	var size = random(30) + 150;
	var obs = new Obstacle(width + size, random(0.4,0.66)*height, size);
	obstacles.push(obs);
}

function keyPressed() {
	var now =  new Date();
	var keyStamp = Math.floor(now.getTime() - gameStartDate.getTime());
	if (keyCode === 32)
		keyLog.push("up,"+keyStamp);
	if ((keyCode === UP_ARROW || keyCode === 32)) // jump if possible
		inputDelayState = setTimeout(InputDelay, delay_val);
}

function InputDelay(){
	this.rnd = Math.floor((Math.random() * 1000))/10;
	if (this.rnd >= PL)
	{
		jumpCounter++;
	}
}


function endGame() {
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
	boxesLog.push(targetCounter);
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
	targetCounter = 0;
	obstacleSpeed = 10;
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
	boxesLog.push(targetCounter);
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
	return
	// call to the finish page..
	query="?pid=NN&gid={0}&gv={1}&c={2}&pd={3}&pt={4}:{5}&gs={6}";
	call=query.f(gameID,gameVersion,vcode,gameStartDate.toISOString().split('T')[0],gameStartDate.getHours(),gameStartDate.getMinutes(),stats);
	console.log(call);
	setTimeout(function() {
	window.location.href=baseURL+call;
	}, 1000);   
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