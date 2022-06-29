'use strict';
const game = new Game({

});
window.onscroll = function() {
  window.scrollTo(0, 0);
};
const ground = new game.Thing({
  background: 'green',
  width: 2000,
  height: 100,
  bottom: game.bottom
});
var player = new game.Thing({
  background: 'blue',
  width: 20,
  height: 30,
  bottom: ground.top
});
loadScene(player, [
  new game.Thing({ name: 'block', background: 'red', custom: { physics: true } })
]);
reset();
function reset() {
  player.collided(Physics, event => {
    //looks weird because when player is in P, you can't really tell where the collision happened, so it guesses based on how deep it is each direction, so a left collision may trigger it to think it collided from the top, because thats where its deepest.
    if (event.axis == 'x')
      player.vel.x = 0;
    if (event.axis == 'y')
      player.vel.y = 0;
    switch (event.side) {
      case 'left':
        player.left = event.other.right;
      case 'right':
        player.right = event.other.left;
      case 'top':
        player.top = event.other.bottom;
      case 'bottom':
        player.bottom = event.other.top;
    }
  })
}
KEYS.bindKeyHold(['w', 'ArrowUp'], (e) => {
  for (let door of Doors) {
    if (player.touching(door)) {
      for (let p of game.things.all) {
        if (![player, ground].includes(p))
          p.delete();
      }
      loadScene(door.scene);
      reset();
    }
  }
});

function Jump(amt = -400) {
  player.moveY(1);
  if (rectCollide(player, ground)) {
    player.vel.y = amt;
    player.moveY(-2);
  }
}
KEYS.bindKeyPressed('i', e => inventory.toggle());
KEYS.bindKeyHold(['a', 'ArrowLeft'], e => player.vel.x = -200)
KEYS.bindKeyHold(['d', 'ArrowRight'], e => player.vel.x = 200)
KEYS.bindKeyPressed(' ', e => Jump());
const friction = 0.5;
game.hook('gameloop', function(elapsed) {
  console.log(player.y);
  game.camera.offsetX = -player.x;
  game.camera.offsetY = -player.y + game.bottom - 100;
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
});
game.start();