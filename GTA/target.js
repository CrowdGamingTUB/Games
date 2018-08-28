function Target(x, y, size) {
	this.x = x;
	this.y = y;
	this.direction = -1;
	this.size = size;
	this.numberRings = 4;
}

Target.prototype.update = function(speed) {
	/* check if offscreen */
	if (((this.direction == -1) || (this.direction == 0))&& (this.x - 0.5*this.size - 0.2*width< 0)){
		turnCounter++;
		if (turnCounter == 1){
			hits_x = [];
			hits_y = [];
		}
		if (turnCounter > turnTime*60){
			turnCounter = 0;
			this.direction = 1;
		}else
			this.direction = 0;
	}else if (((this.direction == 1) || (this.direction == 0)) && (this.x + 0.5*this.size > 0.8*width)){
		turnCounter++;
		if (turnCounter == 1){
			hits_x = [];
			hits_y = [];
		}
		if (turnCounter > turnTime*60){
			turnCounter = 0;
			this.direction = -1;
		}else
			this.direction = 0;
	}
	
	if (this.direction == -1){
		this.x = this.x - speed;
		for (var i = 0; i < hits_x.length; i++)
			hits_x[i] = hits_x[i] - speed;
	}
	else if (this.direction == 1){
		this.x = this.x + speed;
		for (var i = 0; i < hits_x.length; i++)
			hits_x[i] = hits_x[i] + speed;
	}
};

Target.prototype.draw = function() {

	stroke(255);
	strokeWeight(2);
	var steps = this.size/this.numberRings;
	
	if (this.direction == 0)
	{
		col = color(81,77,69);
		fill(col);
		rect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
	}else{
		col = color(81,77,69);
		fill(col);
		rect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
		for (var i = 0; i < this.numberRings; i++) {
			if (i == 0)
				col = color(71,68,64);
			else if (i == 1)
				col = color(92,172,238);
			else if (i == 2)
				col = color(205,51,51);
			else if (i == 3)
				col = color(255,193,37);
			fill(col);
			ellipse(this.x, this.y, this.size - i*steps, this.size - i*steps);
		}		
	}
	
	for (var i = 0; i < hits_x.length; i++){
		fill(51, 51, 77);
		if (drawit)
			ellipse(hits_x[i], hits_y[i], 8, 8);
	}
	
};

Target.prototype.hits = function() {
	if (this.direction == 0)
		return
	shotCounter += 1;
	// calculate if click was on target
	var distance = dist(this.x, this.y, mouseCrossX, mouseCrossY);
	var radius = (this.size)/2;
	
	//log actions
	var now =  new Date();
	var keyStamp = Math.floor(now.getTime() - gameStartDate.getTime());
	keyLog.push("(" + round(10*mouseCrossX)/10 + "," + round(10*mouseCrossY)/10 + "," + round(10*this.x)/10 + "," + round(10*this.y)/10 + "," + keyStamp);
	
	if (distance < radius){
		hitCounter += 1;
		if (Math.floor((Math.random() * 1000))/10 >= PL){
			hits_x.push(mouseCrossX);
			hits_y.push(mouseCrossY);
				
			if (distance < 1/this.numberRings*radius){
				// console.log("max");
				score += multiplier*100;
				maxPoint += 1;
			}else if (distance < 2/this.numberRings*radius){
				// console.log("medium");
				score += multiplier*50;
				mediumPoint += 1;
			}else if (distance < 3/this.numberRings*radius){
				// console.log("low");
				score += multiplier*25;
				lowPoint += 1;
			}else if (distance < radius){
				// console.log("min");
				score += multiplier*10;
				minPoint += 1;
			}		
		}
	}
};
