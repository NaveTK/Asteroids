var ship;
var asteroids = [];
var lasers = [];
var particles = [];
var spaceHeld = false;
var firingDelay;

function setup() {
  createCanvas(windowWidth, windowHeight);
  ship = new Ship();
  for (var i = 0; i < 5; i++) {
    asteroids.push(new Asteroid());
  }
  colorMode(HSB);
}

function draw() {
  background(0);

  firingDelay--;
  if (spaceHeld && firingDelay <= 0) {
    var h = ship.nextColor();
    lasers.push(new Laser(ship.pos, ship.heading, h));
    firingDelay = 10;
    for (var i = 0; i < 3; i++) {
      particles.push(new Particle(createVector(ship.pos.x + cos(ship.heading) * ship.r, ship.pos.y + sin(ship.heading) * ship.r), ship.heading + random(-PI / 2, PI / 2), h));
    }
  }

  for (var i = particles.length - 1; i > 0; i--) {
    particles[i].render();
    particles[i].update();
    if (particles[i].opacity <= 0) {
      particles.splice(i, 1);
    }
  }

  for (var i = 0; i < asteroids.length; i++) {
    if (ship.hits(asteroids[i])) {
      //console.log('ooops!');
    }
    asteroids[i].render();
    asteroids[i].update();
    asteroids[i].edges();
  }

  for (var i = lasers.length - 1; i >= 0; i--) {
    lasers[i].render();
    lasers[i].update();
    if (lasers[i].offscreen()) {
      lasers.splice(i, 1);
    } else {
      for (var j = asteroids.length - 1; j >= 0; j--) {
        if (lasers[i].hits(asteroids[j])) {
          for (var k = 0; k < 3; k++) {
            particles.push(new Particle(lasers[i].pos, lasers[i].angle + PI + random(-PI / 2, PI / 2), lasers[i].h));
          }
          if (asteroids[j].r > 20) {
            var newAsteroids = asteroids[j].breakup();
            asteroids = asteroids.concat(newAsteroids);
          }
          asteroids.splice(j, 1);
          lasers.splice(i, 1);
          break;
        }
      }
    }
  }

  ship.render();
  ship.turn();
  ship.update();
  ship.edges();

}

function keyReleased() {
  if (keyCode == RIGHT_ARROW || keyCode == LEFT_ARROW || key == 'D' || key == 'A') {
    ship.setRotation(0);
  }
  if (keyCode == UP_ARROW || keyCode == DOWN_ARROW || key == 'W' || key == 'S') {
    ship.boosting(0);
  }
}

function mousePressed() {
  spaceHeld = true;
  firingDelay = 0;
}

function mouseReleased() {
  spaceHeld = false;
}

function keyPressed() {
  if (keyCode == RIGHT_ARROW || key == 'D') {
    ship.setRotation(-0.5);
  } else if (keyCode == LEFT_ARROW || key == 'A') {
    ship.setRotation(0.5);
  }
  if (keyCode == UP_ARROW || key == 'W') {
    ship.boosting(1);
  } else if (keyCode == DOWN_ARROW || key == 'S') {
    ship.boosting(-0.5);
  }
}