/**
Bryn Mawr College, Department of Computer Science <br>
Classic starfield using 2D transformations and z-scaling.
*/

// Array of stars
Star[] stars = new Star[400];

void setup() {
  size(600, 600);
  smooth();
  stroke(255);
  strokeWeight(5);

  // Init all stars
  for (int i=0; i<stars.length; i++) 
    stars[i] = new Star();
}

void draw() {
  background(0);
  
  // Draw all stars wrt center of screen
  translate(0.5*width, 0.5*height);
  
  // Update and draw all stars
  for (int i=0; i<stars.length; i++) {
    stars[i].update();
    stars[i].draw();
  }
}


class Star {
  // Star coordinates in 3D
  float x;
  float y;
  float z;
  
  Star() {
    x = random(-5000, 5000);
    y = random(-5000, 5000);
    z = random(0, 2000);
  }
  
  void update() {
    z-=10;        // Move star closer to viewport
    if (z <= 0.0) // Reset star if it passes viewport
      reset();
  }
  
  void reset() {
    // Reset star to a position far away
    x = random(-5000, 5000);
    y = random(-5000, 5000);
    z = 2000.0;
  }

  void draw() {
    // Project star only viewport
    float offsetX = 100.0*(x/z);
    float offsetY = 100.0*(y/z);
    float scaleZ = 0.0001*(2000.0-z);

    // Draw this star
    pushMatrix();
    translate(offsetX, offsetY);
    scale(scaleZ);
    ellipse(0,0,20,20);
    popMatrix();
  }
}

