'use strict';
var ground = null;
const game = new Game();
window.onscroll = function() {
  window.scrollTo(0, 0);
};
let farmScene = new Scene((x, y) => {
  alert('farm');
  new game.Thing({
    background: 'yellow',
    x,
    y,
    width: 300,
    height: 300,
    custom: {
      physics: true
    }
  });
  new Dirt(-500 + x, y);
  new Dirt(-625 + x, y);
  new Dirt(-750 + x, y);
}, 2000);
let mainScene = new Scene((x, y) => {
  new game.Thing({
    x,
    y,
    background: 'red', custom: { physics: true }
  });
  new game.Thing({
    background: Sprite('cow'),
    width: 200,
    height: 135,
    x: 200 + x,
    y,
    custom: {
      physics: true,
      pass: true,
      funcText: 'Milk',
      funct: function() {
        inventory.add(milk);
        this.funct = null;
      }
    }
  });
  new Enemy(700+x, y, 50, 50);
  new Door(Sprite('door'), -200+x, ground.top - 35, farmScene);
}, 2000);
game.loadSprite('enemyl', 'enemy-left.png');
game.loadSprite('enemyr', 'enemy-right.png');
game.loadSprite('pepper-plant', 'pepper-plant.png');
const healthbar = document.getElementById('health-bar');
const actionBtn = document.getElementById('action-btn');
let Enemies = [];
class Enemy {
  constructor(x, bottom, width, height) {
    let thing = this.thing = new game.Thing({
      x,
      bottom,
      width,
      height,
      background: Sprite('enemyl'),
      custom: {
        physics: true,
        pass: true,
      }
    });
    thing.when('draw', () => {
      if (thing.vel.x > 0) {
        thing.colorScheme = { draw: Sprite('enemyr') };
      } else if (thing.vel.x < 0) {
        thing.colorScheme = { draw: Sprite('enemyl') };
      }
      this.thing.to(player.x, 0, 100, 0);
    });
    Enemies.push(thing);
  }
}
game.loadSprite('dirt', 'dirt.png');
game.loadSprite('dirt-tilled', 'dirt-tilled.png');
game.loadSprite('pepper', 'pepper.png');
class Dirt {
  constructor(x, y, tilled = false) {
    this.thing = new game.Thing({
      x,
      y,
      width: 100,
      height: 45,
      custom: {
        physics: true,
        pass: true,
      }
    });
    this.tilled = tilled;
    this.hasPlant = false;
    if (!tilled)
      this.notTilled()
    else
      this.tilled()
  }
  isTilled() {
    const self = this;
    this.thing.colorScheme = { draw: Sprite('dirt-tilled') };
    this.thing.custom.funcText = 'Plant';
    this.thing.custom.funct = () => {
      if (!self.hasPlant) {
        inventory.select((selections) => {
          if (selections.size > 0) {
            let [slot] = selections;
            if (slot.contains instanceof Pepper && slot.contains.growth < 10) {
              self.hasPlant = true;
              self.plant = slot.contains;
              self.plant.Plant(self);
              slot.contains = null;
              self.thing.custom.funct = null;
            } else {
              alert('You only know how to farm Peppers!!!!');
              return;
            }
          }
        }, 1);
      }
    }
  }
  notTilled() {
    const parent = this;
    this.thing.colorScheme = { draw: Sprite('dirt') };
    this.thing.custom.funcText = 'Hoe';
    this.thing.custom.funct = () => {
      parent.tilled = true;
      parent.isTilled();
    }
  }
}
var player = new game.Thing({
  name: 'player',
  background: 'blue',
  width: 20,
  height: 30,
});
game.loadSprite('cow', 'cow.png');
player.health = 100;
player.setHealth = (val) => {
  player.health = val;
  healthbar.style.width = `${val}%`;
  if (player.health == 0)
    restart();
}
function reset() {
  player.collisions = {};
  player.collided(Enemies, event => {
    player.setHealth(player.health - 1);
  });
  player.collided(Physics, event => {
    //looks weird because when player is in P, you can't really tell where the collision happened, so it guesses based on how deep it is each direction, so a left collision may trigger it to think it collided from the top, because thats where its deepest.
    if (event.other.custom.pass) {
      if (event.other.custom.funct) {
        actionBtn.style.display = 'block';
        actionBtn.innerText = event.other.custom.funcText;
        actionBtn.onclick = () => {
          event.other.custom.funct();
          actionBtn.style.display = 'none';
          actionBtn.onclick = null;
        };
        actionBtn.spawner = event.other;
      }
      return;
    };
    if (event.axis == 'x')
      player.vel.x = 0;
    if (event.axis == 'y')
      player.vel.y = 0;
    switch (event.side) {
      case 'left':
        player.left = event.other.right + 1;
      case 'right':
        player.right = event.other.left - 1;
      case 'top':
        player.top = event.other.bottom + 1;
      case 'bottom':
        player.bottom = event.other.top - 1;
    }
  })
}
game.loadSprite('door', 'doored.png');
function restart() {
  player.teleport(0, 0);
  loadScene(player, mainScene)
  reset();
  player.setHealth(100);
}
restart();
KEYS.bindKeyHold(['w', 'ArrowUp'], (e) => {
  if (actionBtn.style.display !== 'none') {
    actionBtn.click();
    actionBtn.style.display = 'none';
    actionBtn.onclick = null;
  }
});

function Jump(amt = -440) {
  player.moveY(1);
  if (rectCollide(player, ground)) {
    player.vel.y = amt;
    player.moveY(-2);
  }
}

function lerp(start, end, percentage) {
  return start + (end - start) * percentage;
}

let playerDir = "right";

KEYS.bindKeyPressed('i', e => inventory.toggle());
KEYS.bindKeyHold(['a', 'ArrowLeft'], e => { player.vel.x = -200; playerDir = "left"; });
KEYS.bindKeyHold(['d', 'ArrowRight'], e => { player.vel.x = 200; playerDir = "right"; })

window.addEventListener("mousedown", () => {
  if (playerDir === "left") {
    //player.colorScheme = {draw: Sprite('')}
  }
})

KEYS.bindKeyPressed(' ', e => { Jump(); playerDir = "up" });
KEYS.bindKeyPressed('c', Craft);
const friction = 0.5;
game.hook('gameloop', function(elapsed) {
  for (let p of Peppers) {
    p.grow(elapsed);
  }
  if (actionBtn.style.display == 'block' && actionBtn.onclick) {
    if (!rectCollide(actionBtn.spawner, player)) {
      actionBtn.style.display = 'none';
      actionBtn.onclick = null;
    }
  }
  // Smoother camera, range 0 - 1
  let cameraSpeed = 0.1;
  game.camera.offsetX = lerp(game.camera.offsetX, -player.x, cameraSpeed);
  game.camera.offsetY = lerp(game.camera.offsetY, -player.y + game.bottom - 100, cameraSpeed);
  for (let p of Physics) {
    let f = friction;
    if (rectCollide(p, ground)) {
      f *= 2;
      if (p.vel.y > 0) p.vel.y = 0;
      if (p.bottom > ground.top + 1)
        p.bottom = ground.top + 1;
    } else p.vel.y += 1 * elapsed;
    if (p.vel.x > 0) p.vel.x -= Math.min(f * elapsed, p.vel.x);
    if (p.vel.x < 0) p.vel.x += Math.min(f * elapsed, -p.vel.x);
    if (p.vel.y > 0) p.vel.y -= Math.min(f * elapsed, p.vel.y);
    if (p.vel.y < 0) p.vel.y += Math.min(f * elapsed, -p.vel.y);
  }
  if (player.vel.y > 500 && player.top > ground.bottom) player.setHealth(player.health - 1);
});
game.start();