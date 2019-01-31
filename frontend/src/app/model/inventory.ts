export class Inventory {
  constructor(
    public items: Array<Item> = []
  ) {}
}

export class Item {
  constructor(
    public name = '',
    public description = ''
  ) {}
}
