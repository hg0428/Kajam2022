function Craft() {
  inventory.select((selections) => {
    let l = [];
    for (let slot of selections) {
      if (slot.contains)
        l.push(slot.contains);
    }
    let hs = new Hotsauce(...l);
    if (hs.name) {
      for (let slot of selections) slot.contains = null;
      inventory.updateAll();
      inventory.add(hs);
    }
  });
}
const Done = document.getElementById('craft-done');
const menu = document.getElementById('menu');
const Equip = document.getElementById('Equip');
const Drink = document.getElementById('Drink');
let inventory = {
  element: document.getElementById('inventory'),
  slots: {},
  updateSlot(i) {
    let slot = this.slots[i];
    slot.element.classList.remove('green');
    if (!slot.contains) {
      slot.imageEl.style.transform = `translateY(-50%) scale(1)`;
      slot.textEl.innerText = '';
      slot.imageEl.src = '';
      slot.spicyEl.innerText = '';
    }
    else {
      slot.textEl.innerText = slot.contains.name;
      slot.imageEl.src = slot.contains.img;
      slot.imageEl.style.transform = `translateY(-50%) scale(${slot.contains.imgScale})`;
      slot.spicyEl.innerText = `${Math.round(slot.contains.spiciness)}`;
      if (slot.contains.isHotsauce) {
        slot.element.onclick = () => {
          menu.style.display = 'block';
					Drink.onclick = () => {
            player.drink(slot.contains);
            inventory.hide();
          };
          Equip.onclick = () => {
            player.weapon = slot.contains;
            inventory.hide();
          };
        }
      }
    }
  },
  updateAll() {
    for (let i in this.slots) {
      this.updateSlot(i);
    }
  },
  show() {
    this.element.style.display = 'grid';
  },
  hide() {
    menu.style.display = 'none';
    this.element.style.display = 'none';
    Done.style.display = 'none';
  },
  toggle() {
    if (this.element.style.display == 'none')
      this.show();
    else
      this.hide();
  },
  add(item) {
    for (let i in this.slots) {
      //loop to add it to the first availiable slot
      let slot = this.slots[i];
      if (slot.contains) continue;
      else
        slot.contains = item;
      this.updateSlot(i);
      break;
    }
  },
  remove(item) {
    for (let i = this.slots.length; i > 0; i--) {
      //loop to remove it from the first slot it can find that contains it.
      let slot = this.slots[i];
      if (slot.contains == item)
        slot.contains = null;
      this.updateSlot(i);
      break;
    }
  },
  select(complete, max=100) {
    this.updateAll();
    this.show();
    const self = this;
    Done.style.display = 'block';
    let selections = new Set();
    for (let i in this.slots) {
      let slot = this.slots[i];
      if (slot.contains) {
        slot.element.onclick = () => {
          if (selections.has(slot)) {
            selections.delete(slot);
            slot.element.classList.remove('green');
          } else if (selections.size<max) {
            selections.add(slot);
            slot.element.classList.add('green');
          }
        }
      }
    }
    Done.onclick = () => {
      Done.onclick = null;
      inventory.hide();
      complete(selections);
      complete = () => null;
      Done.style.display = 'none';
      self.updateAll();
    }
  }
}
for (let i = 0; i < 28; i++) {
  inventory.slots[i] = {
    contains: null,
    element: document.getElementById(`slot-${i}`),
    textEl: document.querySelector(`#slot-${i} span`),
    imageEl: document.querySelector(`#slot-${i} img`),
    spicyEl: document.querySelector(`#slot-${i} p`),
    i,
  };
}
inventory.hide();
let sweet = new Pepper(1, 'Sweet', 0);
let jalapeno = new Pepper(2.4, 'jalapeno', 0, 'jalapeno.png', 3)
let ghost = new Pepper(8, 'Ghost');
let Moruga = new Pepper(10, 'Moruga Scorpion');
let creaper = new Pepper(11, 'Carolina Reaper');
let Sugar = new Ingredient(-2, 'Sugar');
let milk = new Ingredient(-5, 'Milk', 'milk.png');
let LemonJuice = new Ingredient(-8, 'Lemon Juice')
inventory.add(sweet.copy());
inventory.add(milk.copy());
inventory.add(sweet.copy());