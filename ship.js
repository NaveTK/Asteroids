function Ship() {
  this.pos = createVector(width / 2, height / 2);
  this.r = 20;
  this.heading = 0;
  this.rotation = 0;
  this.vel = createVector(0, 0);
  this.drive = 0;
  this.firingHue = 0;
  this.outlineColor = new Array(15);
  this.tailHue = 0;
  for (var i = 0; i < this.outlineColor.length; i++) {
    this.outlineColor[i] = new Array(2);
    this.outlineColor[i][0] = 0;
    this.outlineColor[i][1] = 0;
  }
  this.maxX = 3;
  this.lastPos = new Array(20);
  for (var i = 0; i < this.lastPos.length; i++) {
    this.lastPos[i] = new Array(3);
    this.lastPos[i][0] = createVector(this.pos.x, this.pos.y);
    this.lastPos[i][1] = this.heading;
    this.lastPos[i][2] = createVector(this.vel.x, this.vel.y)
  }

  this.boosting = function(b) {
    this.drive = b;
  }

  this.update = function() {
    if (this.drive !== 0) {
      this.boost(this.drive);
    }
    this.pos.add(this.vel);
    this.vel.mult(0.99);
    
    //outline color
    for(var i = this.outlineColor.length - 1; i > 0; i--) {
      this.outlineColor[i][0] = this.outlineColor[i-1][0];
      this.outlineColor[i][1] = this.outlineColor[i-1][1];
    }
    this.outlineColor[0][0] = this.outlineColor[1][0];
    this.outlineColor[0][1] = this.outlineColor[1][1] - 5;
    if ( this.outlineColor[0][1] < 0 ) {
      this.outlineColor[0][1] = 0;
    }
    
    //tail color
    for(var i = this.lastPos.length - 1; i > 0; i--) {
      this.lastPos[i][0] = this.lastPos[i-1][0];
      this.lastPos[i][1] = this.lastPos[i-1][1];
      this.lastPos[i][2] = this.lastPos[i-1][2];
    }
    this.lastPos[0][0] = createVector(this.pos.x - this.r * cos(this.heading), this.pos.y - this.r * sin(this.heading));
    this.lastPos[0][1] = this.heading;
    this.lastPos[i][2] = createVector(this.vel.x, this.vel.y)
    this.tailHue += 10;
  }

  this.boost = function(a) {
    var force = p5.Vector.fromAngle(this.heading);
    force.mult(0.1*a);
    this.vel.add(force);
  }

  this.hits = function(asteroid) {
    var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    if (d < this.r + asteroid.r) {
      return true;
    } else {
      return false;
    }
  }
  
  this.nextColor = function() {
    this.firingHue += 45;
    this.firingHue %= 360;
    this.outlineColor[0][0] = this.firingHue;
    this.outlineColor[0][1] = 100;
    return this.firingHue;
  }
  
  this.lengthAt = function(x) {
    return this.lastPos.length - abs(x);
  }

  this.render = function() {
    //render tail
    noStroke();
    for(var x = -this.maxX; x < this.maxX; x++) {
      for(var i = 0; i < this.lengthAt(x)-1; i++) {
        stroke((this.tailHue + ((this.lengthAt(x) - i) / this.lengthAt(x)) * 360) % 360, 100, (this.lengthAt(x) - i) / this.lengthAt(x) * 100);
        fill((this.tailHue + ((this.lengthAt(x) - i) / this.lengthAt(x)) * 360) % 360, 100, (this.lengthAt(x) - i) / this.lengthAt(x) * 100);
        //point(this.lastPos[i][0].x, this.lastPos[i][0].y);
        beginShape();
        vertex(this.lastPos[i][0].x + sin(this.lastPos[i][1]) * x * ((this.lengthAt(x) - i / 1.25) / this.lengthAt(x)) * this.r / this.maxX, this.lastPos[i][0].y - cos(this.lastPos[i][1]) * x * ((this.lengthAt(x) - i / 1.25) / this.lengthAt(x)) * this.r / this.maxX);
        vertex(this.lastPos[i][0].x - this.lastPos[i][2].x + sin(this.lastPos[i+1][1]) * x * ((this.lengthAt(x) - (i + 1) / 1.25) / this.lengthAt(x)) * this.r / this.maxX, this.lastPos[i][0].y - this.lastPos[i][2].y - cos(this.lastPos[i+1][1]) * x * ((this.lengthAt(x) - (i + 1) / 1.25) / this.lengthAt(x)) * this.r / this.maxX);
        vertex(this.lastPos[i][0].x - this.lastPos[i][2].x + sin(this.lastPos[i+1][1]) * (x+1) * ((this.lengthAt(x+1) - (i + 1) / 1.25) / this.lengthAt(x+1)) * this.r / this.maxX, this.lastPos[i][0].y - this.lastPos[i][2].y - cos(this.lastPos[i+1][1]) * (x+1) * ((this.lengthAt(x+1) - (i + 1) / 1.25) / this.lengthAt(x+1)) * this.r / this.maxX);
        vertex(this.lastPos[i][0].x + sin(this.lastPos[i][1]) * (x+1) * ((this.lengthAt(x+1) - i / 1.25) / this.lengthAt(x+1)) * this.r / this.maxX, this.lastPos[i][0].y - cos(this.lastPos[i][1]) * (x+1) * ((this.lengthAt(x+1) - i / 1.25) / this.lengthAt(x+1)) * this.r / this.maxX);
        endShape();
      }
    }
    
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading + PI / 2);
    fill(0);
    noStroke();
    strokeWeight(2);
    triangle(-this.r, this.r, this.r, this.r, 0, -this.r);
    //render outlines
    for(var i = 0; i < this.outlineColor.length; i++) {
      stroke(this.outlineColor[i][0], this.outlineColor[i][1], 100);
      line(i * -this.r / this.outlineColor.length, -this.r + i * this.r * 2 / this.outlineColor.length, (i+1) * -this.r / this.outlineColor.length, -this.r + (i+1) * this.r * 2 / this.outlineColor.length);
      line(i * this.r / this.outlineColor.length, -this.r + i * this.r * 2 / this.outlineColor.length, (i+1) * this.r / this.outlineColor.length, -this.r + (i+1) * this.r * 2 / this.outlineColor.length);
    }
    stroke(this.outlineColor[this.outlineColor.length - 1][0], this.outlineColor[this.outlineColor.length - 1][1], 100);
    line(-this.r, this.r, this.r, this.r);
    pop();
  }

  this.edges = function() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }

  this.setRotation = function(a) {
    this.rotation = a;
  }

  this.turn = function() {
    this.heading += this.rotation;
    this.heading %= TWO_PI;
  }

}