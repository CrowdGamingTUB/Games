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

	var R = random(20);
	var G = random(20);
	var B = random(200);
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
};
