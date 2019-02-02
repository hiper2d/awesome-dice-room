import {Inventory} from './inventory';
import {Avatar} from '../util/avatar';
import {Color} from '../util/color';

export class Player {
  private system = false;

  constructor(
      public id: string,
      public name: string,
      public connected = true,
      public color?: string,
      public avatar?: string,
      public inventory?: Inventory
  ) {
    this.color = color || Color.getColor();
    this.avatar = avatar || Avatar.getAvatar();
    this.inventory = inventory || new Inventory();
  }

  static newPlayer(player: Player): Player {
    return new Player(player.id, player.name, player.connected, player.color, player.avatar);
  }

  static systemPlayer(): Player {
    const player = new Player('0', 'System');
    player.system = true;
    return player;
  }

  isSystem(): boolean {
    return this.system;
  }
}
