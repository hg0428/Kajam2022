document.addEventListener('touchstart', ()=> {
    let btns = document.getElementsByClassName('touch');
    for (let btn of btns) {
        btn.style.display = 'inline-block';
    }
    let left = document.getElementById('button-left');
    let right = document.getElementById('button-right');
    let jump = document.getElementById('button-jump');
    let shoot = document.getElementById('button-shoot');
    let inv = document.getElementById('button-inventory');
    left.addEventListener('touchstart', () => KEYS.pressed.add('a'));
    left.addEventListener('touchend', () => KEYS.pressed.delete('a'));
    right.addEventListener('touchstart', () => KEYS.pressed.add('d'));
    right.addEventListener('touchend', () => KEYS.pressed.delete('d'));
    jump.addEventListener('touchstart', () => Jump());
    inv.addEventListener('touchstart', e => inventory.toggle());
})
document.addEventListener('pointerdown', event => {
    if (event.pointerType === "mouse") {

        let btns = document.getElementsByClassName('touch');
        for (let btn of btns) {
            btn.style.display = 'none';
        }
    }
})