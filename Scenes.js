var Doors = [];
let Scenes = [];
let Grounds = [];
class Door {
  constructor(name, image, x, y, scene) {
    this.scene = scene;
    this.name = name;
    this.thing = new game.Thing({
      background: image,
      width: 50,
      height: 70,
      x: x,
      y: y,
      custom: {
        physics: true,
        pass: true,
        funcText: `To ${name}`,
        funct: () => {
          loadScene(player, scene);
          reset();
          actionBtn.style.display = 'none';
        }
      }
    });
    Doors.push(this)
  }
}
class Scene {
  constructor(scene, width = 2000, spawnX = 0, spawnY = 0) {
    this.spawnX = spawnX;
    this.spawnY = spawnY;
    let last = Scenes[Scenes.length - 1];
    if (last) {
      this.x = last.ground.right + game.width + width / 2;
      this.y = last.ground.bottom + game.height + 200;
    } else {
      this.x = 0;
      this.y = 0;
    }
    Scenes.push(this);
    this.width = width;
    this.ground = new game.Thing({
      background: 'green',
      x: this.x,
      top: this.y,
      width: width,
      height: 200,
    });
    Grounds.push(this.ground);
    const self = this;
    this.loaded = false;
    this.load = () => {
      if (!self.loaded) {
        scene(self.x, self.y, self.ground);
        self.loaded = true;
      }
    }
    this.scene = () => {
      ground = self.ground;
      self.load();
      player.x = self.x+self.spawnX;
      player.bottom = self.ground.top+self.spawnY;
      game.camera.offsetX = -player.x;
      game.camera.offsetY = -player.y + game.bottom - 100;
    };
  }
}
function loadScene(player, scene) {
  scene.scene();
  for (let t of game.all.things) {
    if (t.custom.physics) Physics.add(t);
  }
  ground.collided(Physics, event => {
    event.other.bottom = ground.top;
    event.other.vel.y = 0;
  });
}