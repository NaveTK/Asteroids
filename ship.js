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
  this.ported = false;
  this.skip = false;
  for (var i = 0; i < this.outlineColor.length; i++) {
    this.outlineColor[i] = new Array(2);
    this.outlineColor[i][0] = 0;
    this.outlineColor[i][1] = 0;
  }
  this.lastPos = new Array(15);
  for (var i = 0; i < this.lastPos.length; i++) {
    this.lastPos[i] = new Array(3);
    this.lastPos[i][0] = createVector(this.pos.x, this.pos.y);
    this.lastPos[i][1] = this.heading;
    this.lastPos[i][2] = 1;
  }

  this.boosting = function(b) {
    this.drive = b;
  }

  this.update = function() {
    this.boost(this.drive, this.rotation);
    this.pos.add(this.vel);
    this.vel.mult(0.975);

    //outline color
    for (var i = this.outlineColor.length - 1; i > 0; i--) {
      this.outlineColor[i][0] = this.outlineColor[i - 1][0];
      this.outlineColor[i][1] = this.outlineColor[i - 1][1];
    }
    this.outlineColor[0][0] = this.outlineColor[1][0];
    this.outlineColor[0][1] = this.outlineColor[1][1] - 5;
    if (this.outlineColor[0][1] < 0) {
      this.outlineColor[0][1] = 0;
    }

    this.skip = !this.skip;
    if (this.skip === false) {
      //tail color
      for (var i = this.lastPos.length - 1; i > 0; i--) {
        this.lastPos[i][0] = this.lastPos[i - 1][0];
        this.lastPos[i][1] = this.lastPos[i - 1][1];
        this.lastPos[i][2] = this.lastPos[i - 1][2];
      }
      this.lastPos[0][0] = createVector(this.pos.x - this.r * cos(this.heading), this.pos.y - this.r * sin(this.heading));
      this.lastPos[0][1] = this.heading;
      if (this.ported) {
        this.lastPos[0][2] = 0;
        this.ported = false;
      } else {
        this.lastPos[0][2] = 1;
      }
      this.tailHue += this.vel.mag() * 1.5;
    }
  }

  this.boost = function(a, b) {
    var force = p5.Vector.fromAngle(this.heading);
    force.mult(0.2 * a);
    this.vel.add(force);
    force = p5.Vector.fromAngle(this.heading - (PI * b));
    force.mult(0.2 * abs(b));
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


  this.render = function() {
    //render tail
    for (var i = this.lastPos.length - 2; i >= 0; i--) {
      stroke((this.tailHue + ((this.lastPos.length - i) / this.lastPos.length * 0.5) * 360) % 360, 100, (this.lastPos.length - i) / this.lastPos.length * 100, this.lastPos[i][2]);
      fill((this.tailHue + ((this.lastPos.length - i) / this.lastPos.length * 0.5) * 360) % 360, 100, (this.lastPos.length - i) / this.lastPos.length * 100, this.lastPos[i][2]);

      beginShape();
      vertex(this.lastPos[i][0].x + sin(this.lastPos[i][1]) * -1 * ((this.lastPos.length - i / 1.25) / this.lastPos.length) * this.r, this.lastPos[i][0].y - cos(this.lastPos[i][1]) * -1 * ((this.lastPos.length - i / 1.25) / this.lastPos.length) * this.r);

      vertex(this.lastPos[i + 1][0].x + sin(this.lastPos[i + 1][1]) * -1 * ((this.lastPos.length - (i + 1) / 1.25) / this.lastPos.length) * this.r, this.lastPos[i + 1][0].y - cos(this.lastPos[i + 1][1]) * -1 * ((this.lastPos.length - (i + 1) / 1.25) / this.lastPos.length) * this.r);

      vertex(this.lastPos[i + 1][0].x + sin(this.lastPos[i + 1][1]) * (+1) * ((this.lastPos.length - (i + 1) / 1.25) / this.lastPos.length) * this.r, this.lastPos[i + 1][0].y - cos(this.lastPos[i + 1][1]) * (+1) * ((this.lastPos.length - (i + 1) / 1.25) / this.lastPos.length) * this.r);

      vertex(this.lastPos[i][0].x + sin(this.lastPos[i][1]) * (+1) * ((this.lastPos.length - i / 1.25) / this.lastPos.length) * this.r, this.lastPos[i][0].y - cos(this.lastPos[i][1]) * (+1) * ((this.lastPos.length - i / 1.25) / this.lastPos.length) * this.r);
      endShape(CLOSE);
    }

    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading + PI / 2);
    fill(0);
    noStroke();
    strokeWeight(2);
    triangle(-this.r, this.r, this.r, this.r, 0, -this.r);
    //render outlines
    for (var i = 0; i < this.outlineColor.length; i++) {
      stroke(this.outlineColor[i][0], this.outlineColor[i][1], 100);
      line(i * -this.r / this.outlineColor.length, -this.r + i * this.r * 2 / this.outlineColor.length, (i + 1) * -this.r / this.outlineColor.length, -this.r + (i + 1) * this.r * 2 / this.outlineColor.length);
      line(i * this.r / this.outlineColor.length, -this.r + i * this.r * 2 / this.outlineColor.length, (i + 1) * this.r / this.outlineColor.length, -this.r + (i + 1) * this.r * 2 / this.outlineColor.length);
    }
    stroke(this.outlineColor[this.outlineColor.length - 1][0], this.outlineColor[this.outlineColor.length - 1][1], 100);
    line(-this.r, this.r, this.r, this.r);
    pop();
  }

  this.edges = function() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
      this.ported = true;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
      this.ported = true;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
      this.ported = true;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
      this.ported = true;
    }
  }

  this.setRotation = function(a) {
    this.rotation = a;
  }

  this.turn = function() {
    var prefHeading = p5.Vector.sub(createVector(mouseX, mouseY), this.pos).heading();
    if (this.heading - prefHeading > PI) {
      prefHeading += TWO_PI;
    } else if (this.heading - prefHeading < -PI) {
      prefHeading -= TWO_PI;
    }
    this.heading += (prefHeading - this.heading) * 0.25;
    this.heading %= TWO_PI;
  }

}