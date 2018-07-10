// game elements
var player;
var projectiles = []; // track on-screen Squares
var difficulty; // difficulty of the projectiles

// states and counter
var restartState;
var InputDelayState=0;
var testloop;
var projectilesCounter = 0;
//in second
var testDuration = 20;
var gameStarted = false;
var gameStartDate = null;
var timeLeft = testDuration;
var numberOfTries = 1;
var score=0;
var scoreLog = [];
var projectileLog = [];
var keyLog = [];
var highscore = 0;
var projectileCounter = 0;

// draw flag
var drawit = true;

var gameID = "Dodge_C0";
var gameVersion = "08072018v1";
var baseURL = "http://gamingqoe.qu.tu-berlin.de/store/verification.php?"

// Network parameters
var delay_val = 0;
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
	
	difficulty = 2;

	/* initialize player */
	player = new Square(width / 2, height / 2, 30, color("#FFFFFF"), null, difficulty * 0.8);

	textAlign(CENTER);
	textSize(40);
}

function draw() {

	if (frameCount % round(60/fps) == 0)
		drawit=true;
	else	
		drawit=false;
	
	if (drawit)
		background(51);
	
	handleProjectiles();
	handlePlayer();
	handleKeys();
	attemptNewProjectile(frameCount);
	drawScore();
}

/**
 * attempt to push a new projectile to the projectiles array
 */
function attemptNewProjectile(frame) {
	// every 0.5 seconds
	if (frame % 30 === 0) {
		// based upon difficulty
		if (random(difficulty) > 1.25) {
			projectiles.push(generateSquare());
		}
		// increase difficulty
		difficulty += 0.075;
	}
}

/**
 * handles user input
 */
function keyPressed() {
	var now =  new Date();
	var keyStamp = Math.floor(now.getTime() - gameStartDate.getTime());
	if (keyCode === 38)
		keyLog.push("up,"+keyStamp);
	else if(keyCode === 40)
		keyLog.push("down,"+keyStamp);
	else if(keyCode === 39)
		keyLog.push("right,"+keyStamp);
	else if(keyCode === 37)
		keyLog.push("left,"+keyStamp);
}


function handleKeys() {

	var speed = difficulty * 0.8;

	if (keyIsDown(UP_ARROW))
		InputDelayState = setTimeout(InputDelay, delay_val, 0, -speed);

	if (keyIsDown(DOWN_ARROW))
		InputDelayState = setTimeout(InputDelay, delay_val, 0, speed);

	if (keyIsDown(LEFT_ARROW))
		InputDelayState = setTimeout(InputDelay, delay_val, -speed, 0);

	if (keyIsDown(RIGHT_ARROW))
		InputDelayState = setTimeout(InputDelay, delay_val, speed, 0);

}

function InputDelay(speed_x, speed_y){
	this.rnd = Math.floor((Math.random() * 1000))/10;
	if (this.rnd >= PL)
		player.move(speed_x, speed_y);
}

/**
 * draws the player's score
 */
function drawScore() {
	score = frameCount;
	noStroke();
	if (drawit){
		text("Score: " + score, width / 2, 0.1*windowHeight);
		text("Projectiles: " + projectileCounter,  0.8*(width), 0.1*windowHeight);
		text("Time left: " + timeLeft + " sec",  0.2*(width), 0.1*windowHeight);
	}
}

/**
 * updates, draws, checks collision for Squares
 * manages projectiles array
 */
function handleProjectiles() {

	for (var i = projectiles.length - 1; i >= 0; i--) {
		/* update & draw */
		projectiles[i].update(false); // false = not-the-player
		if (drawit)
			projectiles[i].draw();
		
		// check for game over
		if (projectiles[i].collidesWith(player))
			endGame();

		// delete from array
		if (projectiles[i].isOffscreen())
			projectiles.splice(i, 1);
	}
}

/**
 * updates, draws, and constrains the player
 */
function handlePlayer() {

	/* update & draw */
	player.update(true);
	if (drawit)
		player.draw();

	/* constrain the player */
	if (player.isOffscreen()) {
		endGame();
	}
}

/**
 * stops the loop, draws game over message
 */
function endGame() {

	noLoop();
	fill(255);
	noStroke();
	restart_counter = 5;	
	document.getElementById("RestartDiv").style.padding = "10px";
	document.getElementById("Restart_Text").textContent="GAME OVER";
	restartState = setInterval(RestartCountdown, 666);
}


/**
 * returns a randomly generated Square
 */
function generateSquare() {

  /* create square */
  var plane = (random() > 0.5);
	// true = randomize x-axis & keep y-axis constant
	// false = randomize y-axis & keep x-axis constant

	/* only allow squares to spawn at edges */
  var x = (plane) ? random(width) : ((random() > 0.5) ? 0 : width);
  var y = (plane) ? ((random() > 0.5) ? 0 : height) : random(height);
  projectileCounter++;
  this.rndSquareSize = Math.floor((Math.random() * 25)+10);
  return new Square(x, y, this.rndSquareSize, randomColor(), player.position, difficulty);
}

/**
 * returns a random color
 */
function randomColor() {
  return color(random(255), random(255), random(255));
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
	projectileLog.push(projectileCounter);
	if (score > highscore)
		highscore = score;
	numberOfTries++;
	// reset
	projectiles = [];
	difficulty = 2;
	frameCount = 0;
	score = 0;
	frameCount = 0;
	projectileCounter = 0;
	textSize(40);
	player = new Square(width / 2, height / 2, 30, color("#FFFFFF"), null, difficulty * 0.8);
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
	projectileLog.push(projectileCounter);
	if (score > highscore)
		highscore = score;
	stats=getPlayStats();
	vcode=uuidv4();
	console.log(stats);
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
	stats= "test::dur:{0};ntry:{1};hs:{2};scores:{3};projectiles:{4};keys:{5};system:wiw:{6};wih:{7};nacn:{8};np:{9}";
	return stats.f(testDuration,numberOfTries,highscore,JSON.stringify(scoreLog),JSON.stringify(projectileLog),JSON.stringify(keyLog),window.innerWidth,window.innerHeight,navigator.appCodeName,navigator.platform);
}

//babak
function updateTimer(){

	if (!gameStarted) 
		return;
	var now=  new Date();
	var seconds = Math.floor((now.getTime() - gameStartDate.getTime()) / 1000);
	if (seconds<=testDuration){
		timeLeft=	testDuration-seconds;
	}else{
		gameStarted=false;
		testPeriodisOver();
	}
}