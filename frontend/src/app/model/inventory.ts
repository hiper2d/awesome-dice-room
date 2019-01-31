export class Inventory {
  constructor(
    public items: Array<Item> = []
  ) {}
}

export class Item {
  constructor(
    public id: number,
    public name = '',
    public description = ''
  ) {}
}
