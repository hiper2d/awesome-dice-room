import {PlayerModel} from './player.model';

export class RoomModel {
  chatbox = ''; // todo: redesign this into queue of separate text messages
  private namesCache = new Map<string, string>();

  constructor(public players: Array<PlayerModel> = []) {
    this.players = players;
  }

  addPlayer(player: PlayerModel) {
    this.players.push(player);
    this.namesCache.set(player.id, name);
  }

  removePlayer(id: string) {
    this.players.splice(this.players.findIndex(p => p.id === id), 1);
    this.namesCache.delete(id);
  }

  pushMessage(message: string, author: string = 'System') {
    this.chatbox = this.chatbox.concat(`\n ${new Date().toLocaleString()} ${author}:  ${message}`);
  }

  getPlayerNameById = (id: string): string => this.namesCache.get(id);
}
