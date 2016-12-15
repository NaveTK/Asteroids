var ship;
var asteroids = [];
var lasers = [];
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
    lasers.push(new Laser(ship.pos, ship.heading, ship.nextColor()));
    firingDelay = 10;
  }

  for (var i = 0; i < asteroids.length; i++) {
    if (ship.hits(asteroids[i])) {
      console.log('ooops!');
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
          if (asteroids[j].r > 10) {
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
  if (keyCode == RIGHT_ARROW || keyCode == LEFT_ARROW) {
    ship.setRotation(0);
  }
  if (keyCode == UP_ARROW || keyCode == DOWN_ARROW) {
    ship.boosting(0);
  }
  if (key == ' ') {
    spaceHeld = false;
  }
}

function keyPressed() {
  if (key == ' ') {
    spaceHeld = true;
    firingDelay = 0;
  }
  if (keyCode == RIGHT_ARROW) {
    ship.setRotation(0.1);
  } else if (keyCode == LEFT_ARROW) {
    ship.setRotation(-0.1);
  }
  if (keyCode == UP_ARROW) {
    ship.boosting(1);
  }
  else if (keyCode == DOWN_ARROW) {
    ship.boosting(-0.5);
  }
}
