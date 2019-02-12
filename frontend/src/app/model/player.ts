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

  static newPlayer(player: Player): Player {
    return new Player(player.id, player.userId, player.roomId, player.name, player.avatar);
  }

  static systemPlayer(): Player {
    const player = new Player('0', '0', '0', 'System');
    player._system = true;
    return player;
  }

  static addColorIfMissing(player: Player): void {
    if (!player.color) {
      player.color = Color.getColor();
    }
  }

  get system(): boolean {
    return this._system;
  }
}
