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
    for (let i = 30; i > 0; i--) {
      //loop to remove it from the first slot it can find that contains it.
      let slot = this.slots[i];
      if (slot.contains == item)
        slot.contains = null;
        this.updateSlot(i);
        break;
    }
  }
}
for (let i = 0; i < 30; i++) {
  inventory.slots[i] = {
    contains: null,
    element: document.getElementById(`slot-${i}`),
    textEl: document.querySelector(`#slot-${i} span`),
    imageEl: document.querySelector(`#slot-${i} img`),
    spicyEl: document.querySelector(`#slot-${i} p`)
  };
}
inventory.hide();
let milk = new Ingredient(-5, 'Milk', 'milk.png');
let p1 = new Pepper(3, 'Sweet');
let ghost = new Pepper(8, 'Ghost');
let hs = new Hotsauce(milk, ghost, ghost);
let jalapeño = new Ingredient(5, 'jalapeño', 'jalapeño.png', 3)
inventory.add(hs);
inventory.add(milk);
inventory.add(milk);
inventory.add(ghost);
inventory.add(p1);
inventory.add(milk);
inventory.add(ghost);
inventory.add(p1);inventory.add(milk);
inventory.add(ghost);
inventory.add(p1);
inventory.add(hs);
inventory.add(jalapeño);