class Ingredient {
  constructor(spiciness, name, img, imgScale) {
    this.spiciness = spiciness; //–10 — 10
    this.imgScale = imgScale || 1;
    this.name = name;
    this.img = img || '';
  }
}
class Pepper extends Ingredient {
  constructor(spiciness, name, growth) {
    super(spiciness, name + ' pepper');
    this.imgScale = 1.25;
    this.img = 'pepper.png';
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
    this.imgScale = 0.85;
    this.name=''
    for (let i=0; i<Math.min(list.length, 2);i++) {
      this.name += list[i][0] + '-'
    }
    this.name = this.name.substring(0, this.name.length-1) + ' Hotsauce';
    this.spiciness /= ingredients.length;
    this.img = 'Hotsauces/mild.png'
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