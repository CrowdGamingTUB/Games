// game elements
const SIZE = 30;
var fidelity; 	// how detailed the walls are
var walls = [];
var difficulty; // how sharp the curves are
var score;
var rocket;

// states and counter
var restartState;
var InputDelayState=0;
var testloop;
//in second
var testDuration = 90;
var gameStarted = false;
var gameStartDate = null;
var timeLeft = testDuration;
var numberOfTries = 1;
var scoreLog = [];
var keyLog = [];
var timeLog = [];
var playTime = 0;
var previousTime = 0;
var difficultyLog = [];
var highscore = 0;

// draw flag
var drawit = true;

var gameID = "Rocket_C0";
var gameVersion = "08072018v1";
var baseURL = "http://gamingqoe.qu.tu-berlin.de/store/verification.php?"

// Network parameters
var delay_val = 0;
var PL = 0;
var fps = 10;

// store data
String.prototype.format = String.prototype.f = function() {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};


function setup() {

	// ST: might not be necessary
	if (!gameStarted){
		gameStarted=true;
		gameStartDate= new Date();
		testloop= setInterval(updateTimer, 1000);
	}
   
	// collision detection is not working if height cannot be devided by 10 (see fidelity)
	var cnv = createCanvas(0.5*windowWidth, round(0.8*windowHeight/10)*10);
	var x = 0.25*windowWidth;
	var y = (windowHeight - height) / 2;
	cnv.position(x, y);
	document.getElementById("RestartDiv").style.padding = "0px";
	document.getElementById("Restart_Text").style.fontSize = "xx-large"; 
	
	fidelity = height / 10;
	difficulty = 1;
	score = 0;

	var randomColor = color(random(255), random(255), random(255));
	rocket = new Rocket(noise(0) * width, height - SIZE, SIZE, randomColor);

	textSize(30);
	textAlign(CENTER);	
}

function draw() {

	if (frameCount % round(60/fps) == 0)
		drawit=true;
	else	
		drawit=false;
	
	if (drawit)
		background(0);
	
	handleSpeed(frameCount);
	handleKeys();
	handleWalls();

	/* handle rocket */
	rocket.update();
	if (drawit)
		rocket.draw();

	/* draw score */
	if (drawit){
		noStroke();
		text("Score: " + round(score/100), 0.75*width, 0.1*windowHeight);
		text("Time left: " + timeLeft + " sec",  0.33*(width), 0.1*windowHeight);
	}
}

/**
 * draws, deletes, pushes, and handles collision with walls
 */
function handleWalls() {

	var y = 0;
	for (var i = walls.length - 1; i >= 1; i -= 1) {

		if (drawit)
			walls[i].draw(y, walls[i - 1], color);

		/* check collision */
		if (y++ == fidelity) {
			if (rocket.collidesWith(walls[i])) {
				endGame();
			}
		}

		/* keep array clear */
		if (i < walls.length - fidelity * 2)
			walls.splice(i, 2);
	}

	/* move walls */
	// adjust multiplier after noise for difficulty and the last parameter for track width
	var wall1 = new Wall(noise((score/2 + i) * 0.0015) * width, width / 2.5);
	var wall2 = new Wall(noise(((score/2 + i + 1)) * 0.0015) * width, width / 2.5);

	walls.push(wall1);
	walls.push(wall2);

	score += difficulty;
}

/**
 * stops loop, draws game over message
 */
function endGame() {

	noLoop();
	noStroke();
	fill(255);
	restart_counter = 5;	
	document.getElementById("RestartDiv").style.padding = "10px";
	document.getElementById("Restart_Text").textContent="GAME OVER";
	playTime = round(frameCount/60) - previousTime;
	timeLog.push(playTime);
	previousTime = round(frameCount/60);
	if (timeLeft > 3)
		restartState = setInterval(RestartCountdown, 666);
}

/**
 * increases difficulty
 */
function handleSpeed(frame) {

	if (frame % 120 === 0) {

		difficulty += 1;
		rocket.speed *= 1.025;
	}
}

/**
 * handle user input
 */
function keyPressed() {
	var now =  new Date();
	var keyStamp = Math.floor(now.getTime() - gameStartDate.getTime());
	if(keyCode === 39)
		keyLog.push("right,"+keyStamp);
	else if(keyCode === 37)
		keyLog.push("left,"+keyStamp);
}

function handleKeys() {

  if (keyIsDown(LEFT_ARROW)) {
	  InputDelayState = setTimeout(InputDelay, delay_val, -0.5);
  } else if (keyIsDown(RIGHT_ARROW)) {
	  InputDelayState = setTimeout(InputDelay, delay_val, 0.5);
  }
}

function InputDelay(speed){
	this.rnd = Math.floor((Math.random() * 1000))/10;
	if (this.rnd >= PL)
		rocket.move(speed);
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
			clearTimeout(restartState);
			break;
	}
} 

//Steven
function RestartGame(){
	// stats
	scoreLog.push(score);
	difficultyLog.push(difficulty);
	keyLog.push("|");
	if (score > highscore)
		highscore = score;
	numberOfTries++;
	// reset
	frameCount = 0;
	score = 0;
	walls = [];
	difficulty = 1;
	randomColor = color(random(255), random(255), random(255));
	rocket = new Rocket(noise(0) * width, height - SIZE, SIZE, randomColor);

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
	playTime = round(frameCount/60) - previousTime;
	timeLog.push(playTime);
	difficultyLog.push(difficulty);
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
	stats= "test::dur:{0};ntry:{1};hs:{2};scores:{3};playingtime:{4};difficulties:{5};keys:{6};system:wiw:{7};wih:{8};nacn:{9};np:{10}";
	return stats.f(testDuration,numberOfTries,highscore,JSON.stringify(scoreLog),JSON.stringify(timeLog),JSON.stringify(difficultyLog),JSON.stringify(keyLog),window.innerWidth,window.innerHeight,navigator.appCodeName,navigator.platform);
}

//babak
function updateTimer(){
	var now=  new Date();
	var seconds = Math.floor((now.getTime() - gameStartDate.getTime()) / 1000);
	timeLeft = testDuration - seconds;
	if (timeLeft <= 0)
		testPeriodisOver();
}