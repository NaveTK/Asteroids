function Particle(spos, angle, h) {
  this.pos = createVector(spos.x, spos.y);
  this.vel = p5.Vector.fromAngle(angle);
  this.vel.mult(random(5, 20));
  this.h = h;
  this.lastPos = [];
  this.opacity = 100;
  this.rot = random(-PI / 15, PI / 15);

  this.update = function() {
    this.lastPos.push(createVector(this.pos.x, this.pos.y));
    if (this.lastPos.length > 8) {
      this.lastPos.splice(0, 1);
    }
    this.pos.add(this.vel);
    this.vel.mult(0.6);
    this.vel.rotate(this.rot);
    this.opacity -= 5;
  }
  this.render = function() {
    push();
    strokeWeight(4);
    for (var i = this.lastPos.length - 1; i > 0; i--) {
      stroke(this.h, 100, (i) / this.lastPos.length * this.opacity);
      if (i === 0) {
        line(this.lastPos[i].x, this.lastPos[i].y, this.pos.x, this.pos.y);
      } else {
        line(this.lastPos[i].x, this.lastPos[i].y, this.lastPos[i - 1].x, this.lastPos[i - 1].y);
      }
    }
    stroke(this.h, 100, this.opacity);
    point(this.pos.x, this.pos.y);
    pop();
  }
}