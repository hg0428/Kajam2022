var Doors = [];
let Scenes = []
class Door {
  constructor(image, x, y, scene) {
    let thisscene = this.scene = scene;
    this.thing = new game.Thing({
      background: image,
      width: 50,
      height: 70,
      x: x,
      y: y,
      custom: {
        physics: true,
        pass: true,
        funcText: 'Open',
        funct: () => {
          loadScene(player, thisscene);
          reset();
          actionBtn.style.display = 'none';
        }
      }
    });
    Doors.push(this)
  }
}
class Scene {
  constructor(scene, width = 2000) {
    let last = Scenes[Scenes.length - 1];
    if (last) {
      this.x = last.ground.right + game.width + width / 2;
      this.y = last.ground.bottom + game.height + 200;
    } else {
      this.x = 0;
      this.y = 0;
    }
    const self = this;
    this.scene = () => {
      ground = self.ground;
      player.x = ground.x;
      player.bottom = ground.top;
      game.camera.offsetX = -player.x;
      game.camera.offsetY = -player.y + game.bottom - 100;
      if (!self.init) {
        scene(self.x, self.y);
        self.init = true;
      }
    };
    Scenes.push(this);
    this.width = width;
    this.init = false;
    this.ground = new game.Thing({
      background: 'green',
      x: this.x,
      top: this.y,
      width: width,
      height:200,
    });
  }
}
var Physics = [];
function loadScene(player, scene) {
  //player.teleport(0, 0);
  Physics = [player];
  scene.scene();
  for (let t of game.all.things) {
    if (t.custom.physics) Physics.push(t);
  }
  ground.collisions = {};
  ground.collided(Physics, event => {
    event.other.bottom = ground.top;
    event.other.vel.y = 0;
  });
}