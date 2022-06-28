class Ingredient {
  constructor(spiciness, name) {
    this.spiciness = spiciness; //–10 — 10
    this.name = name;
  }
}
class Pepper extends Ingredient {
  constructor(spiciness, name, growth) {
    super(spiciness, name + ' pepper')
    this.growth = growth; //out of 10
    this.iSeeds = growth === 0; //is seeds
    this.planted = false;
  }
  plant() {
    this.planted = true;
  }
  grow(elapsed) {
    if (this.planted)
      this.growth += elapsed / 1000
  }
}
class Hotsauce {
  constructor(...ingredients) {
    this.spiciness = 0;
    let names = [];
    for (let ing of ingredients) {
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
    this.name = list[0][0] + '-' + list[1][0] + ' Hotsauce';
    this.spiciness /= ingredients.length;
    if (this.spiciness > 8) this.name = 'Fiery ' + this.name;
    else if (this.spiciness >= 6) this.name = 'Spicy ' + this.name;
    else if (this.spiciness >= 3) this.name = 'Mild ' + this.name;
    else if (this.spiciness <= -8) this.name = 'Restoritive ' + this.name;
    else if (this.spiciness <= -6) this.name = 'Mending ' + this.name;
    else if (this.spiciness <= -3) this.name = 'Refreshing ' + this.name;
    else if (this.spiciness < 3) this.name = 'Blunt ' + this.name;
  }
}
let milk = new Ingredient(-5, 'Milk');
let p1 = new Ingredient(3, 'Sweet');
let ghost = new Ingredient(8, 'Ghost');
let hs = new Hotsauce(milk, milk, ghost);
console.log(hs);