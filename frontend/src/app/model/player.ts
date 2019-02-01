import {Inventory} from './inventory';
import {Avatar} from '../util/avatar';

export class Player {
  color: string;
  inventory: Inventory = new Inventory();
  avatar: string;

  private system = false;

  constructor(
      public id: string,
      public name: string,
      public connected = true
  ) {
    this.color = Player.generateColor(id);
    this.avatar = Avatar.getAvatar();
  }

  isSystem(): boolean {
    return this.system;
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

  static systemPlayer(): Player {
    const player = new Player('0', 'System');
    player.system = true;
    return player;
  }
}
