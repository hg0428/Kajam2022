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
let savedInventory;
//localStorage.setItem('inventory', JSON.stringify({contents:[]}))
try {
  savedInventory = JSON.parse(localStorage.getItem('inventory') || '{contents:[]}');
}
catch {
  savedInventory = { contents: [] };
}
function saveInventory() {
  let contents = [];
  for (let i in inventory.slots) {
    let val = inventory.slots[i].contains;
    if (!val) continue;
    let type = '';
    if (val.isPepper) type = "Pepper";
    else if (val.isIngredient) type = "Ingredient";
    else if (val.isHotsauce) type = "Hotsauce";
    contents.push({ type, val });
  }
  localStorage.setItem('inventory', JSON.stringify({ contents }))
};
const Done = document.getElementById('craft-done');
const menu = document.getElementById('menu');
const Equip = document.getElementById('Equip');
const Drink = document.getElementById('Drink');
const Discard = document.getElementById('Discard');
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
      slot.element.onclick = () => {
        let rect = slot.element.getBoundingClientRect();
        menu.style.display = 'block';
        menu.style.left = `${rect.right+10}px`;
        menu.style.top = `${rect.bottom+10}px`;
        Drink.onclick = () => {
          if (!slot.contains.isHotsauce) return alert('You can only drink Hotsauces. Press c to craft a Hotsauce');
          player.drink(slot.contains);
          inventory.hide();
        };
        Equip.onclick = () => {
          if (!slot.contains.isHotsauce) return alert('You can only equip Hotsauces');
          player.weapon = slot.contains;
          player.weapon.ammo = 10;
          inventory.hide();
        };
        Discard.onclick = () => {
          slot.contains = null;
          this.updateAll();
        };
      }
    }
  },
  updateAll() {
    for (let i in this.slots) {
      this.updateSlot(i);
    }
    saveInventory();
  },
  show() {
    this.element.style.display = 'grid';
    this.updateAll();
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
    for (let i in this.slots) {
      //loop to remove it from the first slot it can find that contains it.
      let slot = this.slots[i];
      if (slot.contains === item || slot.contains == item) {
        slot.contains = null;
        this.updateAll();
        return true;
      }
    }
    return false;
  },
  select(complete, max = 100) {
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
          } else if (selections.size < max) {
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
let Aji = new Pepper(5, 'Aji Fantasy');
let ghost = new Pepper(8, 'Ghost');
let Moruga = new Pepper(10, 'Moruga Scorpion');
let creaper = new Pepper(11, 'Carolina Reaper');
let Sugar = new Ingredient(-2, 'Sugar');
let milk = new Ingredient(-5, 'Milk', 'milk.png');
let LemonJuice = new Ingredient(-8, 'Lemon Juice');
for (let val of savedInventory.contents) {
  if (val) {
    if (val.type == 'Pepper') {
      val = Object.assign(new Pepper(), val.val)
    } else if (val.type == 'Ingredient') {
      val = Object.assign(new Ingredient(), val.val)
    } else if (val.type == 'Hotsauce') {
      val = Object.assign(new Hotsauce(), val.val)
    }
  }
  inventory.add(val);
}
setInterval(saveInventory, 100);