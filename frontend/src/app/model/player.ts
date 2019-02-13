import {Inventory} from './inventory';
import {Avatar} from '../util/avatar';
import {Color} from '../util/color';

export class Player {
  private _system = false;

  constructor(
      public id: string,
      public userId: string,
      public roomId: string,
      public name: string,
      public avatar?: string,
      public color?: string,
      public inventory?: Inventory
  ) {
    this.color = color || Color.getColor();
    this.avatar = avatar || Avatar.getAvatar();
    this.inventory = inventory || new Inventory();
  }

  static systemPlayer(): Player {
    const player = new Player(
        '0',
        '0',
        '0',
        'System',
        'assets/avatars/admin.png',
        'red'
    );
    player._system = true;
    return player;
  }

  get system(): boolean {
    return this._system;
  }
}
