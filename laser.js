function Laser(spos, angle, h) {
  this.pos = createVector(spos.x, spos.y);
  this.vel = p5.Vector.fromAngle(angle);
  this.vel.mult(10);
  this.h = h;
  this.angle = angle;

  this.update = function() {
    this.pos.add(this.vel);
  }
  this.render = function() {
    push();
    stroke(this.h, 100, 100);
    strokeWeight(4);
    line(this.pos.x, this.pos.y, this.pos.x - this.vel.x, this.pos.y - this.vel.y);
    pop();
  }

  this.hits = function(asteroid) {
    var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    if (d < asteroid.r) {
      return true;
    } else {
      return false;
    }
  }

  this.offscreen = function() {
    if (this.pos.x > width || this.pos.x < 0) {
      return true;
    }
    if (this.pos.y > height || this.pos.y < 0) {
      return true;
    }
    return false;
  }


}