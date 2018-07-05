
var horizon;
var obstacleSpeed;

var score;
var obstacles = [];
var ObstaclesCounter = 0;

var dino;
var RestartState;
var InputDelayState;
// draw flag
var drawit=true;

// Network parameters
var delay_val = 0;
var PL = 0;
var fps = 60;


String.prototype.format = String.prototype.f = function() {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};
function getCookie(cname)
{
   var name = cname + "=";
   var ca = document.cookie.split(';');
   for(var i=0; i<ca.length; i++) 
   {
      var c = ca[i].trim();
      if (c.indexOf(name)==0) return c.substring(name.length,c.length);
   }
   return "";
}

function setCookie(cname,cvalue,exdays)
{
   var d = new Date();
   d.setTime(d.getTime()+(exdays*24*60*60*1000));
   var expires = "expires="+d.toGMTString();
   document.cookie = cname + "=" + cvalue + "; " + expires;
}

function setup() {


	var cnv = createCanvas(0.9*windowWidth, 0.8*windowHeight);
	var x = 0.05*windowWidth;
	var y = (windowHeight - height) / 2;
	cnv.position(x, y);
	document.getElementById("RestartDiv").style.padding = "0px";
	textAlign(CENTER);

	horizon = height - 0.2*windowHeight;

	score = 0;
	obstacleSpeed = 12;

	var size = 20;
	dino = new TRex(0.1*windowWidth, height - horizon, 1.5*size);

	textSize(40);
}

function draw() {
	frameCount++;
	if (frameCount % round(60/fps) == 0)
		doit=true;
	else	
		doit=false;
	if (doit){
		background(51);
		drawHUD();
	}
	
	handleLevel(frameCount);
	dino.update(horizon);
	handleObstacles();
}

/**
	* draws horizon & score
	*/
function drawHUD() {

	/* draw horizon */
	stroke(255);
	strokeWeight(5);
	line(0, horizon, width, horizon);

	/* draw score */
	noStroke();
	text("Score: " + score,  0.5*(width), 0.1*windowHeight);
	text("Boxes: " + ObstaclesCounter,  0.8*(width), 0.1*windowHeight);
	

	/* draw T-Rex */
	dino.draw();
}

/**
	*	updates, draws, and cleans out the obstacles
	*/
function handleObstacles() {
	
	for (var i = obstacles.length - 1; i >= 0; i--) {

		obstacles[i].update(obstacleSpeed);
		// skip drawing in case of frame drop
		if (doit)
			obstacles[i].draw();

		if (obstacles[i].hits(dino)) // if there's a collision
			endGame();

		if (!obstacles[i].onScreen) // if it's no longer showing
		{
			obstacles.splice(i, 1); // delete from array
			ObstaclesCounter += 1;
		}
	}
}


/**
	* speeds game up, pushes new obstacles, & handles score
	*/
function handleLevel(n) {
	
	if (n % 50 === 0) { // every 0.5 seconds
		var n = noise(n); // noisey
		if (n > 0.5){
			newObstacle(); // push new obstacle
		}
	}
	if (n % 240 === 0) // every 2 seconds
		obstacleSpeed *= 1.025; // speed up
	score++;
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

	if ((keyCode === UP_ARROW || keyCode === 32) && dino.onGround) // jump if possible
	{
		InputDelayState = setTimeout(InputDelay, delay_val);
	}	
}

function InputDelay(){
	this.rnd = Math.floor((Math.random() * 1000))/10;
	if ((dino.onGround) && (this.rnd >= PL))
		dino.jump();
}


function endGame() {

	noLoop();
	noStroke();
	restart_counter = 5;	
	document.getElementById("RestartDiv").style.padding = "10px";
	document.getElementById("Restart_Text").textContent="GAME OVER";
	RestartState = setInterval(RestartCountdown, 666);

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
			RestartGame();
			// QuitGame();
			clearTimeout(RestartState);
			break;
	}
} 

function RestartGame(){
	obstacles = [];
	frameCount = 0;
	score = 0;
	ObstaclesCounter = 0;
	obstacleSpeed = 12;
	textSize(40);
	loop();
}

// function QuitGame()
// {
	
// }

function showTimer(remaining){
	var s1=Math.floor(remaining /10);
	var s2= remaining%10;
	text("Time left: " + s2,  0.1*(width), 0.1*windowHeight);
}

function testPeriodisOver()
{
   playerDead();
   clearInterval(testloop);
   testloop = null;	
   $("#finished").transition({ opacity: 1 }, 1000, 'snap').transition({ scale: [1.2, 1.2] });   
   stats=getPlayStats();
   vcode=uuidv4();
   console.log(stats);
   //call to the finish page..
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
	stats= "test::dur:{0};ntry:{1};hs:{2};scores{3};;system::wiw:{4};wih:{5};nacn:{6};np:{7}";
	return stats.f(testDuration,numberOfTries,highscore,JSON.stringify(scoreLog),window.innerWidth,window.innerHeight,navigator.appCodeName,navigator.platform);
}

//babak
function updateTimer(){

	if (!gameStarted) 
		return;
	var now=  new Date();
	var seconds = Math.floor((now.getTime() - gameStartDate.getTime()) / 1000);
	
	if (seconds<=testDuration){
		showTimer(testDuration-seconds);
	}else{
		gameStarted=false;
		testPeriodisOver();
	}
}