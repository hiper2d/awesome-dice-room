import {Inventory} from './inventory';
import {Avatar} from '../util/avatar';

export class Player {
  inventory: Inventory = new Inventory();

  private system = false;

  constructor(
      public id: string,
      public name: string,
      public connected = true,
      public color?: string,
      public avatar?: string
  ) {
    this.color = color || Player.generateColor(id);
    this.avatar = avatar || Avatar.getAvatar();
  }

  private static generateColor(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = input.charCodeAt(i) + ((hash << 5) - hash);
    }

    const color = (hash & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return '00000'.substring(0, 6 - color.length) + color;
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
