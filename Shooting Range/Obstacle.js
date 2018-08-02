function Obstacle(x, y, size) {

	this.x = x;
	this.y = y;
	this.x_hit1 = x;
	this.y_hit1 = y;
	this.x_hit2 = x;
	this.y_hit2 = y;

	this.size = size;
	this.r = 0;
	this.g = 0;
	this.b = 150;
	this.targetHitCounter = 0;

	this.onScreen = true;
}

/**
	*	handle x and onScreen values
	*/
Obstacle.prototype.update = function(speed) {

	/* check if offscreen */
	this.onScreen = (this.x > 0);

	/* movement */
	this.x -= speed;
	this.x_hit1 -= speed;
	this.x_hit2 -= speed;
};

Obstacle.prototype.draw = function() {

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
			ellipse(this.x_hit1, this.y_hit1, 8, 8);
		}else if (this.targetHitCounter == 2)
		{	
			fill(51, 51, 77);
			ellipse(this.x_hit1, this.y_hit1, 8, 8);
			fill(51, 51, 77);
			ellipse(this.x_hit2, this.y_hit2, 8, 8);
		}
	}
};

/** checks for collisions */
Obstacle.prototype.hits = function(n) {
	if (mouseIsPressed === true){
		// calculate if click was on a target and increase counter
		var distance = dist(this.x, this.y, MouseCrossX, MouseCrossY);
		var radius = (this.size)/2;
			
		if (distance < radius){
			// only accept a new click after some time passed (keyPressed != new action)
			if (this.targetHitCounter == 0){
				LastHitTime = new Date();
				acceptHit = true;
			}else if (this.targetHitCounter >= 1){
				var HitTime = new Date();
				var TimeBetweenHits = Math.floor(HitTime.getTime() - LastHitTime.getTime());
				if (TimeBetweenHits > 300){
					LastHitTime = HitTime;
					acceptHit = true;
				}
			}
				
			if (acceptHit){
				this.targetHitCounter += 1;
				if (this.targetHitCounter == 1){
					this.x_hit1 = MouseCrossX;
					this.y_hit1 = MouseCrossY;
				}else if (this.targetHitCounter == 2){
					this.x_hit2 = MouseCrossX;
					this.y_hit2 = MouseCrossY;
				}
					
				if (distance < 0.33*radius){
					// console.log("bull eye");
					targetCounter += 3;
				}else if (distance < 0.66*radius){
					// console.log("medium");
					targetCounter += 2;
				}else if (distance < radius){
					// console.log("hitted");
					targetCounter += 1;
				}	
				acceptHit = false;
			}
		}
		if (this.targetHitCounter >= n)	
			return true;
		else
			return false;
	}
};
