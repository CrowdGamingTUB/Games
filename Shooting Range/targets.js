function Target(x, y, size) {

	this.x = x;
	this.y = y;
	this.x_hit1 = x;
	this.y_hit1 = y;
	this.x_hit2 = x;
	this.y_hit2 = y;

	this.size = size;
	this.targetHitCounter = 0;

	this.onScreen = true;
}

/**
	*	handle x and onScreen values
	*/
Target.prototype.update = function(speed) {

	/* check if offscreen */
	this.onScreen = (this.x > 0);

	/* movement */
	this.x -= speed;
	this.x_hit1 -= speed;
	this.x_hit2 -= speed;
};

Target.prototype.draw = function() {

	stroke(255);
	strokeWeight(2);
	var steps = this.size/3;
	for (var i = 0; i < 3; i++) {
		if (i == 0)
			col = color(92,172,238);
		else if (i == 1)
			col = color(205,51,51);
		else if (i == 2)
			col = color(255,193,37);
			
		fill(col);
		ellipse(this.x, this.y, this.size - i*steps, this.size - i*steps);
		if (this.targetHitCounter == 1)
		{	
			fill(51, 51, 77);
			if (drawit)
				ellipse(this.x_hit1, this.y_hit1, 8, 8);
		}else if (this.targetHitCounter == 2)
		{	
			fill(51, 51, 77);
			if (drawit)
				ellipse(this.x_hit1, this.y_hit1, 8, 8);
			fill(51, 51, 77);
			if (drawit)
				ellipse(this.x_hit2, this.y_hit2, 8, 8);
		}
	}
};

/** checks for collisions */
Target.prototype.hits = function(i,n) {
	shotCounter += 1;
	lasthitTime = now;
	// calculate if click was on a target and increase counter
	var distance = dist(this.x, this.y, mouseCrossX, mouseCrossY);
	var radius = (this.size)/2;
	
	//log actions
	var keyStamp = Math.floor(now.getTime() - gameStartDate.getTime());
	keyLog.push("(" + round(10*mouseCrossX)/10 + "," + round(10*mouseCrossY)/10 + "," + round(10*this.x)/10 + "," + round(10*this.y)/10 + "," + keyStamp);
	
	if (distance < radius){
		hitCounter += 1;
		this.targetHitCounter += 1;
		if (this.targetHitCounter == 1){
			this.x_hit1 = mouseCrossX;
			this.y_hit1 = mouseCrossY;
		}else if (this.targetHitCounter == 2){
			this.x_hit2 = mouseCrossX;
			this.y_hit2 = mouseCrossY;
		}
			
		if (distance < 0.33*radius){
			showPoints = 100;
			score += multiplier*100;
			maxPoint += 1;
		}else if (distance < 0.66*radius){
			showPoints = 50;
			score += multiplier*50;
			mediumPoint += 1;
		}else if (distance < radius){
			showPoints = 25;
			score += multiplier*25;
			minPoint += 1;
		}	
		showPoints_x = this.x;
		showPoints_y = this.y - this.size/1.7;
	}else{
		showPoints = -25;
		showPoints_x = mouseCrossX;
		showPoints_y = mouseCrossY + 20;
		score -= 25;
	}
	showPointsState = setTimeout(showPointsTimer, 1000);
	
	if (this.targetHitCounter >= n)
		Targets.splice(i, 1);
};
