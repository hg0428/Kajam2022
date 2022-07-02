'use strict';
let goaway = document.getElementById('goaway');
let goaway2 = document.getElementById('goaway2');
goaway.onclick = () => {
  document.getElementById('instructions').style.display = 'none';
}
goaway2.onclick = () => {
  document.getElementById('story').style.display = 'none';
}
var ground = null;
const game = new Game();
window.onscroll = function() {
  window.scrollTo(0, 0);
}
game.loadSprite('e2l', 'e2l.png');
game.loadSprite('e2r', 'e2r.png');
game.loadSprite('enemyl', 'enemy-left.png');
game.loadSprite('chest', 'chest.png');
game.loadSprite('sugar-cane', 'sugar-cane.png');
game.loadSprite('enemyr', 'enemy-right.png');
game.loadSprite('pepper-plant', 'pepper-plant.png');
const healthcontainer = document.getElementById('health-container');
const healthbar = document.getElementById('health-bar');
const actionBtn = document.getElementById('action-btn');
let Enemies = [];
class Enemy {
  constructor(x, bottom, width, height, health = 100, left='enemyl', right='enemyr') {
    console.log(left, right);
    this.left = left;
    this.right = right;
    let thing = this.thing = new game.Thing({
      x,
      bottom,
      width,
      height,
      background: Sprite(this.left),
      custom: {
        physics: true,
        pass: true,
        enemy: this,
      }
    });
    this._health = health;
    const self = this;
    thing.when('draw', () => {
      if (thing.vel.x > 0) {
        thing.colorScheme = { draw: Sprite(self.right) };
      } else if (thing.vel.x < 0) {
        thing.colorScheme = { draw: Sprite(self.left) };
      }
      if (game.numberDistance(player.x, thing.x) < game.width * 2 && game.numberDistance(player.y, thing.y) < game.height * 2)
        thing.to(player.x, 0, 100, 0);
      else
        thing.vel.x = 0;
    });
    Enemies.push(thing);
  }
  get health() {
    return this._health;
  }
  set health(val) {
    this._health = val
    if (this._health <= 0) {
      this.thing.delete();
      delete this.thing;
    }
  }
}
function EnemyWall(x, bottom, height = 200) {
  let thing = new game.Thing({
    x,
    bottom,
    height,
    width: 65,
    background: 'rgba(0, 0, 0, 0.1)',
    custom: {
      physics: true,
      pass: true,
    }
  });
  thing.collided(Enemies, event => {
    switch (event.side) {
      case 'left':
        event.other.right = thing.left;
      case 'right':
        event.other.left = thing.right;
    }
  });
  return thing;
}
function Chest(x, bottom, contents) {
  let thing = new game.Thing({
    x,
    bottom,
    width: 70,
    height: 50,
    background: Sprite('chest'),
    custom: {
      physics: true,
      pass: true,
      funcText: 'Open',
      funct: () => {
        for (let c of contents) {
          inventory.add(c);
        }
        thing.delete();
      }
    }
  })
}
function Message(x, bottom, message) {
  new game.Thing({
    x,
    width:5,
    height:5,
    background:'transparent',
    custom: {
      physics: true,
      pass: true,
      funcText: message,
      funct: () => {

      }
    }
  });
}
game.loadSprite('dirt', 'dirt.png');
game.loadSprite('door-back', 'door-back.png');
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
function cow(x, bottom) {
  new game.Thing({
    background: Sprite('cow'),
    width: 200,
    height: 135,
    x,
    bottom,
    custom: {
      physics: true,
      pass: true,
      funcText: 'Milk',
      funct: function() {
        inventory.add(milk.copy());
        this.funct = null;
      }
    }
  });
}
function sugarcane(x, bottom) {
  let tx0 = new game.Thing({
    x,
    bottom,
    background: Sprite('sugar-cane'),
    width: 200,
    height: 120,
    custom: { 
      physics: true,
      pass: true,
      funcText: 'Collect Sugar',
      funct: () => {
        inventory.add(Sugar.copy());
        tx0.custom.funct = null;
      }
    }
  })
}
let level9 = new Scene((x, y, ground) => {
  new Door('Paradise', Sprite('door-back'), x-975, ground.top - 35, paradise);
  new Enemy(x + 300, ground.top, 70, 70, 100);
  new Enemy(x + 500, ground.top, 70, 70, 100);
  new Enemy(x + 300, ground.top, 70, 70, 100);
  new Enemy(x - 200, ground.top, 70, 70, 100);
  new Enemy(x - 600, ground.top, 70, 70, 100);
  new Enemy(x + 200, ground.top, 300, 300, 800, 'e2l', 'e2r');
  Chest(x + 700, ground.top, [ghost.copy(0)]);
}, 2000, -975);
let level8 = new Scene((x, y, ground) => {
  new Door('Paradise', Sprite('door-back'), x-975, ground.top - 35, paradise);
  cow(x-200, ground.top);
  Chest(x, ground.top, [Aji.copy(0)]);
  new Enemy(x + 600, ground.top, 30, 30, 80);
  new Door('Level 9', Sprite('door'), x + 310, ground.top - 25, level9)
  new Enemy(x + 500, ground.top, 60, 60, 210);
  new Enemy(x + 420, ground.top, 60, 60, 210);
  new Enemy(x + 300, ground.top, 100, 100, 400);
  new Enemy(x + 280, ground.top, 20, 20, 210);
  new Enemy(x + 220, ground.top, 50, 50, 120)
  new Enemy(x + 200, ground.top, 60, 60, 210);
  new Enemy(x + 180, ground.top, 60, 60, 210);
  new Enemy(x + 160, ground.top, 60, 60, 210);
  new Enemy(x + 120, ground.top, 60, 60, 210);
  new Enemy(x + 100, ground.top, 60, 60, 210);
}, 2000, -975)
let level7 = new Scene((x, y, ground) => {
  new Door('Paradise', Sprite('door-back'), x-475, ground.top - 35, paradise);
  new Enemy(x - 280, ground.top, 20, 20, 210);
  new Enemy(x - 220, ground.top, 50, 50, 120)
  new Enemy(x - 200, ground.top, 60, 60, 210);
  new Enemy(x - 180, ground.top, 60, 60, 210);
  new Enemy(x - 160, ground.top, 60, 60, 210);
  new Enemy(x - 120, ground.top, 60, 60, 210);
  new Enemy(x - 100, ground.top, 60, 60, 210);
  new Door('Level 8', Sprite('door'), x+50, ground.top - 35, level8);
  Chest(x + 100, ground.top, [ghost.copy(10)]);
  Chest(x + 200, ground.top, [LemonJuice.copy()]);
  new game.Thing({x:x,bottom:ground.top,width:70,height:100, custom:{physics:true}, background:'red'});
  new Enemy(x + 300, ground.top, 100, 100, 400);
  new Enemy(x + 420, ground.top, 60, 60, 210);
  new Enemy(x + 500, ground.top, 60, 60, 210);
  new EnemyWall(x - 400, ground.top);
}, 1000, -475)
let level6 = new Scene((x, y, ground) => {
  new Door('Paradise', Sprite('door-back'), x, ground.top - 35, paradise);
  new Enemy(x-1000, ground.top, 100, 100, 200);
  new Enemy(x+1000, ground.top, 100, 100, 200);
  new Enemy(x-800, ground.top, 20, 20, 75);
  new Enemy(x+800, ground.top, 20, 20, 75);
  new Enemy(x-600, ground.top, 20, 20, 75);
  new Enemy(x+600, ground.top, 20, 20, 75);
  new Enemy(x-400, ground.top, 200, 200, 250);
  new Enemy(x+400, ground.top, 200, 200, 250);
  new Chest(x+500, ground.top, [ghost.copy(10)]);
  new Door('Level 7', Sprite('door'), x+600, ground.top-25, level7);
}, 2000);
let level5 = new Scene((x, y, ground) => {
  new Door('Paradise', Sprite('door-back'), x, ground.top - 35, paradise);
  new Enemy(x-400, ground.top, 100, 100, 200);
  new Enemy(x+400, ground.top, 100, 100, 200);
  new Chest(x+425, ground.top, [Aji.copy(0)]);
  new Door('Level 6', Sprite('door'), x+475, ground.top - 35, level6)
}, 1000)
let paradise = new Scene((x, y, ground) => {
  cow(x-300, ground.top);
  sugarcane(x-700, ground.top);
  sugarcane(x+300, ground.top);
  cow(x+700, ground.top);
  new Dirt(x+900, ground.top+50);
  new Dirt(x-900, ground.top+50);
  new Door('Level 5', Sprite('door'), x+80, ground.top - 35, level5);
  new Door('Home', Sprite('door-back'), x-80, ground.top - 35, mainScene);
}, 3000, 0);
let level4 = new Scene((x, y, ground) => {
  new Message(x - 950, ground.bottom, 'The door home is at the end');
  new Enemy(x - 200, ground.top, 50, 50, 120);
  new Enemy(x - 220, ground.top, 40, 40, 100);
  new Enemy(x - 240, ground.top, 200, 200, 1000, 'e2l', 'e2r');
  Chest(x + 200, ground.top, [Aji.copy(0)]);
  new Door('Paradise', Sprite('door'), x + 100, ground.top - 35, paradise);
  new Door('Home', Sprite('door-back'), x, ground.top - 35, mainScene);
}, 2000, -950);
let level3 = new Scene((x, y, ground) => {
  new Door('Home', Sprite('door-back'), x - 2200, ground.top - 35, mainScene);
  Chest(x - 2350, ground.top, [Aji.copy(10)]);
  new Enemy(x - 1900, ground.top, 100, 100, 300);
  new Enemy(x - 1800, ground.top, 85, 85, 230);
  new Enemy(x - 1300, ground.top, 50, 50, 120);
  new Enemy(x - 1300, ground.top, 40, 40, 100);
  new EnemyWall(x - 2100, ground.top);
  new Door('Level 4', Sprite('door'), x - 800, ground.top - 35, level4);
}, 5000, -2450);
let level2 = new Scene((x, y, ground) => {
  new Door('Home', Sprite('door-back'), x - 900, ground.top - 35, mainScene);
  new Enemy(x - 300, ground.top, 80, 80, 200);
  EnemyWall(x - 500, ground.top);
  sugarcane(x+50, ground.top);
  new Door('Level 3', Sprite('door'), x + 250, ground.top - 35, level3);
}, 2000, -800)
let otherland = new Scene((x, y, ground) => {
  new Door('Home', Sprite('door-back'), x, ground.top - 35, mainScene);
  new Enemy(600 + x, ground.top, 50, 50, 100);
  EnemyWall(x + 200, ground.top);
  Chest(x + 700, ground.top, [jalapeno.copy()]);
  new Door('Level 2', Sprite('door'), x + 600, ground.top - 35, level2);
}, 2000);
let mainScene = new Scene((x, y, ground) => {
  cow(x - 200, ground.top);
  new game.Thing({
    background: 'yellow',
    x: x + 500,
    bottom: y,
    width: 200,
    height: 150,
    custom: {
      physics: true
    }
  });
  new Dirt(-500 + x, y);
  new Dirt(-625 + x, y);
  new Dirt(-750 + x, y);
  new Door('Another Land', Sprite('door'), 200 + x, ground.top - 35, otherland);
  Chest(x + 50, ground.top, [sweet.copy()]);
}, 2000);
var player = new game.Thing({
  name: 'player',
  background: 'blue',
  width: 20,
  height: 30,
});
var Physics = new Set();
Physics.add(player);
game.loadSprite('cow', 'cow.png');
player.health = 100;
player.setHealth = (val) => {
  player.health = val;
  healthbar.style.width = `${val}%`;
  healthbar.innerText = `${val}`;
  if (player.health == 0)
    restart();
  if (player.health > 100) {
    healthcontainer.style.width = `${2 * player.health}px`;
    healthcontainer.style.border = '2px solid gold';
  } else {
    healthcontainer.style.width = `200px`;
    healthcontainer.style.border = '1px solid black';
  }
}
player.weapon = null;
player.drink = function(what) {
  player.setHealth(player.health - what.spiciness * 5);
  what.use(20);
};
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
        //console.log("left")
        player.left = event.other.right + 1;
      case 'right':
        //console.log("right")
        player.right = event.other.left - 1;
      case 'top':
        //console.log("top")
        player.top = event.other.bottom + 1;
      case 'bottom':
        //console.log("bottom")
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
KEYS.bindKeyPressed(['w', 'ArrowUp'], (e) => {
  if (actionBtn.style.display !== 'none') {
    actionBtn.click();
    actionBtn.style.display = 'none';
    actionBtn.onclick = null;
  }
});

function Jump(amt = -400) {
  player.moveY(1);
  if (rectCollide(player, ground)) {
    player.vel.y = amt;
    player.moveY(-2);
  } else {
    for (let p of Physics) {
      if (!p.custom.pass && rectCollide(player, p) && game.numberDistance(player.bottom, p.top) < 2 && game.numberDistance(player.x, p.x) < player.width / 2 + p.width / 2) {
        player.vel.y = amt;
        player.moveY(-2);
        break;
      }
    }
  }
}

function lerp(start, end, percentage) {
  return start + (end - start) * percentage;
}

let playerDir = "right";

KEYS.bindKeyPressed('i', e => inventory.toggle());
KEYS.bindKeyHold(['a', 'ArrowLeft'], e => { player.vel.x = -200; playerDir = "left"; });
KEYS.bindKeyHold(['d', 'ArrowRight'], e => { player.vel.x = 200; playerDir = "right"; })
let lastShot = 0;
function Shoot() {
  if (player.weapon && Date.now()-lastShot>10) {
    lastShot = Date.now();
    player.weapon.use();
    let hs = new game.Thing({
      width: 12,
      height: 5,
      background: 'orange',
      x: player.x,
      y: player.y,
      custom: {
        hotsauce: player.weapon
      }
    });
    hs.when('draw', () => {
      if (game.numberDistance(hs.x, player.x) > ground.width) {
        hs.delete();
      }
    });
    hs.collided(player, event => {
      player.drink(hs.custom.hotsauce);
      hs.delete();
    });
    hs.collided(Enemies, event => {
      event.other.custom.enemy.health -= hs.custom.hotsauce.spiciness * 7;
      hs.delete();
    });
    if (playerDir === "left") {
      hs.x -= player.width;
      hs.vel.x = -500;
    } else {
      hs.x += player.width
      hs.vel.x = 500;
    }
  } else {
    //alert('No hotsauce equipped');
  }
}
// game.canvas.addEventListener("mousedown", event => {
//   if (event.pointerType === "mouse")
//     Shoot();
// })

KEYS.bindKeyPressed('s', e => { Shoot(); });
KEYS.bindKeyPressed(' ', e => { Jump(); });
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
    } else {
      let gravity = true;
      for (let p2 of Physics) {
        if (!p2.custom.pass && rectCollide(p, p2) && game.numberDistance(p.bottom, p2.top) < 2 && game.numberDistance(p.x, p2.x) < p.width / 2 + p2.width / 2) {
          gravity = false;
          break;
        }
      }
      if (gravity && game.numberDistance(ground.x, p.x) < ground.width && game.numberDistance(ground.y, p.y) < ground.width + ground.height)
        p.vel.y += 1.2 * elapsed;
    }
    if (p.vel.x > 0) p.vel.x -= Math.min(f * elapsed, p.vel.x);
    if (p.vel.x < 0) p.vel.x += Math.min(f * elapsed, -p.vel.x);
    if (p.vel.y > 0) p.vel.y -= Math.min(f * elapsed, p.vel.y);
    if (p.vel.y < 0) p.vel.y += Math.min(f * elapsed, -p.vel.y);
  }
  if (player.vel.y > 800 && player.top > ground.bottom && player.top < ground.bottom + ground.height * 20) {
    player.bottom = ground.top;
    if (game.numberDistance(player.x, ground.left) < game.numberDistance(player.x, ground.right))
      player.x = ground.left;
    else
      player.x = ground.right
  };
});
game.start();
setInterval(() => {
  document.zoom = 1;
  window.zoom = 1;
  document.body.style.zoom = 1;
  document.body.style.webkitTransform = 'scale(1)';
  document.body.style.msTransform = 'scale(1)';
  document.body.style.transform = 'scale(1)';
}, 100);