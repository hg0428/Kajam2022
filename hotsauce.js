class Ingredient {
  constructor(spiciness, name, img, imgScale) {
    this.spiciness = spiciness; //–10 — 10
    this.imgScale = imgScale || 1;
    this.name = name;
    this.img = img || '';
    this.growth = 10;
  }
}
var Peppers = [];
class Pepper extends Ingredient {
  constructor(spiciness, name, growth = 10) {
    let add = ' pepper';
    if (growth === 0) add += ' seeds';
    super(spiciness, name + add);
    this.baseName = name;
    this.imgScale = 1.25;
    this.img = 'pepper.png';
    this.growth = growth; //out of 10
    this.iSeeds = growth === 0; //is seeds
    if (this.iSeeds)
      this.img = 'pepper-seeds.png';
    this.planted = false;
    this.thing = null;
    this.plant = null;
    Peppers.push(this);
  }
  Plant(plant) {
    this.plant = plant;
    this.planted = true;
    this.thing = new game.Thing({
      background: Sprite('pepper-plant'),
      height: 20,
      width: 5,
      x: plant.thing.x,
      bottom: plant.thing.top + 10,
    })
  }
  grow(elapsed) {
    if (this.planted && this.growth<10) {
      this.growth += elapsed / 2000;
      this.iSeeds = this.growth === 0;
      this.thing.height+=elapsed/200;
      this.thing.width+=elapsed/400;
      this.thing.bottom = this.plant.thing.top + 10 + this.growth*2;
    }
    if (this.planted && this.growth>=10) {
      this.plant.thing.custom.funcText = 'Harvest';
      const self = this;
      this.plant.thing.custom.funct = () => {
        self.growth = 10;
        self.planted = false;
        self.plant.hasPlant = false;
        self.plant.isTilled();
        self.plant = null;
        self.img = 'pepper.png';
        self.thing.delete();
        self.thing = null;
        self.name = self.name.substring(0, self.name.length - ' seeds'.length);
        inventory.add(new Pepper(self.spiciness, self.baseName, 0));
        inventory.add(self);
      }
    }
  }
}
class Hotsauce {
  constructor(...ingredients) {
    if (ingredients.length == 0) return;
    this.spiciness = 0;
    let names = []
    for (let ing of ingredients) {
      if (ing instanceof Hotsauce) {
        alert('"Hotsauce" can not be an ingredient for Hotsauce');
        return;
      } if (ing.growth < 10 || ing.iSeeds) {
        alert('Peppers must be fully grown before they can be used in a Hotsauce');
        return;
      }
      this.spiciness += ing.spiciness;
      let n = ing.name;
      if (n.endsWith(' pepper'))
        n = n.substring(0, n.length - ' pepper'.length)
      names.push(n);
    }
    let count = {};
    for (const item of names) {
      if (count[item])
        count[item] += 1;
      else
        count[item] = 1;
    }
    let list = [];
    for (var item in count)
      list.push([item, count[item]]);
    list.sort((a, b) => {
      return b[1] - a[1];
    });
    this.imgScale = 0.85;
    this.name = '';
    for (let i of list) {
      if (this.name.length + i[0].length > 15) break;
      this.name += i[0] + '-';
    }
    this.name = this.name.substring(0, this.name.length - 1) + ' Hotsauce';
    this.img = 'Hotsauces/mild.png';
    if (this.spiciness > 8) {
      this.img = 'Hotsauces/fiery.png';
      this.name = 'Fiery ' + this.name;
    }
    else if (this.spiciness >= 6) {
      this.img = 'Hotsauces/hot.png'
      this.name = 'Spicy ' + this.name;
    }
    else if (this.spiciness >= 3) this.name = 'Mild ' + this.name;
    else if (this.spiciness <= -8) this.name = 'Restoritive ' + this.name;
    else if (this.spiciness <= -6) this.name = 'Mending ' + this.name;
    else if (this.spiciness <= -3) this.name = 'Refreshing ' + this.name;
    else if (this.spiciness < 3) this.name = 'Blunt ' + this.name;
  }
}