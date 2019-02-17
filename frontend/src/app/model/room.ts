export class Room {

  constructor(
      public id: string,
      public name: string,
      public description: string,
      public playerIds: Array<string> = []
  ) {}
}
