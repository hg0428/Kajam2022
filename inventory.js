let inventory = {
  element: document.getElementById('inventory'),
  slots: {},
  updateSlot(i) {
    let slot = this.slots[i];
    if (!slot.contains) {
      slot.imageEl.style.transform = `translateY(-50%) scale(1)`;
      slot.textEl.innerText = '';
      slot.imageEl.src = '';
      slot.spicyEl.innerText = '';
    }
    else
      slot.textEl.innerText = slot.contains.name;
      slot.imageEl.src = slot.contains.img;
      slot.imageEl.style.transform = `translateY(-50%) scale(${slot.contains.imgScale})`;
      slot.spicyEl.innerText = `${Math.round(slot.contains.spiciness)}`;
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
    this.element.style.display = 'none';
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
  select(amt, complete) {
    amt = amt || 5
    this.show();
    let selections = [];
    for (let i of this.slots) {
      let slot = this.slots[i];
      slot.element.onclick = () => {
        selections.push(slot);
        if (selections.length >= amt) {
          complete(selections);
          complete = () => null;
          return;
        }
      }
    }
    //Let them select $amt different inventory items and return it.
  }
}
for (let i = 0; i < 28; i++) {
  inventory.slots[i] = {
    contains: null,
    element: document.getElementById(`slot-${i}`),
    textEl: document.querySelector(`#slot-${i} span`),
    imageEl: document.querySelector(`#slot-${i} img`),
    spicyEl: document.querySelector(`#slot-${i} p`)
  };
}
inventory.hide();
inventory.select(2, (selections) => {
  alert('done');
  console.log(selections);
});
let sweet = new Pepper(1, 'Sweet');
let jalapeno = new Ingredient(2.4, 'jalapeno', 'jalapeno.png', 3)
let ghost = new Pepper(8, 'Ghost');
let Moruga = new Pepper(10, 'Moruga Scorpion');
let creaper = new Pepper(11, 'Carolina Reaper');
let Sugar = new Ingredient(-2, 'Sugar');
let milk = new Ingredient(-5, 'Milk', 'milk.png');
let LemonJuice = new Ingredient(-8, 'Lemon Juice')