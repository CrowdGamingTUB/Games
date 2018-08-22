function Wall(x, w) {

	this.x = x;
	this.w = w;

	this.leftBound = this.x - (this.w / 2);
	this.rightBound = this.x + (this.w / 2);
}

/**
 * draws walls
 */
Wall.prototype.draw = function(y, previousWall) {
	
	// Color for center
	var R = 0;
	var G = 0;
	var B = 255;
    stroke(R,G,B);
	strokeWeight(15);
	noFill();
	
	// Drawing center
	beginShape();
	vertex(this.leftBound, y * 10);
	vertex(this.rightBound, y * 10);
	endShape();
	
	
	//Color for borders
	var R = 255;
	var G = 255;
	var B = 255;
    stroke(R,G,B);
	strokeWeight(8);
	noFill();
	
	
	/* drawing left */
	beginShape();
	vertex(this.leftBound, y * 10);
	vertex(previousWall.leftBound, y * 10 + 10);
	endShape();

	
	/* drawing right */
	beginShape();
	vertex(this.rightBound, y * 10);
	vertex(previousWall.rightBound, y * 10 + 10);
	endShape();
	
	
	//Color and size for the center line
	var R = 255;
	var G = 255;
	var B = 255;
	stroke(R,G,B);
	strokeWeight(2);
	noFill();
		
	/* drawing Center Line */
	beginShape();
	vertex(this.leftBound  + 150, y * 10);
	vertex(this.leftBound  + 150, y * 10 + 40);
	endShape();
	
};
