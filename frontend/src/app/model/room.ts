import {Player} from './player';
import {RoomMessage} from './room-message';
import {Queue} from '../util/queue';

export class Room {
  messages: Queue<RoomMessage> = new Queue(100);
  players = new Map<string, Player>();

  constructor(
      public id: string
  ) {}

  addPlayer = (player: Player) => this.players.set(player.id, player);

  removePlayer = (id: string) => this.players.delete(id);

  getPlayerById(id: string): Player {
    return this.players.get(id);
  }

  pushMessage(
      message: string,
      author: Player = Player.systemPlayer(),
      timestamp: string = new Date().toLocaleTimeString()
  ) {
    this.messages.push(new RoomMessage(message, author, timestamp));
  }
}
