'use strict';
const game = new Game({

});

const ground = new game.Thing({
  background: 'green',
  width: 10000,
  height: 100,
  bottom: game.bottom
});
var player = new game.Thing({
  background: 'blue',
  width: 20,
  height: 30,
  bottom: ground.top
});
loadScene(player, [new game.Thing({name:'block', background:'red', custom: {physics: true}})]);
reset();
function reset() {
  player.collided(Physics, (axis, side, p, P)=>{
    if (axis=='x')
      player.vel.x=0;
      P.vel.x=0;
    if (axis=='y')
      player.vel.y = 0;
      P.vel.y=0;
    switch (side) {
      case 'left':
        player.left = P.right;
      case 'right':
        player.right = player.left;
      case 'top':
        player.top = P.bottom;
      case 'bottom':
        P.top = player.bottom;
    }
  })
}
KEYS.bindKeyHold(['w', 'ArrowUp'], (e) => {
  for (let door of Doors) {
    if (player.touching(door)) {
      for (let p of Physics) {
        if (![player, ground].includes(p)) 
          p.delete();
      }
      loadScene(door.scene);
      reset();
    }
  }
});

console.log(game.all.things);
KEYS.bindKeyHold(['a', 'ArrowLeft'], (e) => { player.vel.x = -200; })
KEYS.bindKeyHold(['d', 'ArrowRight'], (e) => { player.vel.x = 200; })
KEYS.bindKeyPressed(' ', (e) => {
  player.moveY(1); 
  if (player.touching(ground)) {
    player.vel.y = -400;
    player.moveY(-2);
  }
});
const friction = 0.5;
game.hook('gameloop', function(elapsed) {
  game.camera.offsetX = -player.x;
  game.camera.offsetY = -player.y + game.bottom-100;
  for (let p of Physics) {
    let f = friction;
    if (p.touching(ground)) {
      f *= 2;
      if (p.vel.y>0) p.vel.y=0;
    } else p.vel.y += 1 * elapsed;
    if (p.bottom>ground.top+1) {
      p.bottom = ground.top+1
    }
    if (p.vel.x > 0) p.vel.x += -f * elapsed;
    if (p.vel.x < 0) p.vel.x += f * elapsed;
    if (p.vel.y > 0) p.vel.y += -f * elapsed;
    if (p.vel.y < 0) p.vel.y += f * elapsed;
  }
});
game.start();