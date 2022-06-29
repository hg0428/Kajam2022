var Doors = [];
class Door {
  constructor(image, x, y, scene) {
    this.image = new Image();
    this.image.src = image;
    this.scene = scene;
    this.thing = new game.Thing({
      image: image,
      width: 50,
      height: 60,
      x: x,
      y: y
    });
    Doors.push(this)
  }
}
var Physics = [];
function loadScene(player, things = []) {
  player.teleport(0, 0);
  Physics = [player];
  for (let t of things) {
    if (t.custom.physics) Physics.push(t);
  }
  ground.collided(Physics, event => {
    event.other.bottom = ground.top;
    event.other.vel.y = 0;
  });
}