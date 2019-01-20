import {PlayerModel} from './player.model';

export class RoomModel {
  chatbox = '';

  private names = {};

  constructor(public players: PlayerModel[] = []) {
    this.players = players;
  }

  addPlayer(id: string, name: string, isItYou: boolean = false) {
    this.players.push(new PlayerModel(name, id, true));
    this.names[id] = name;
  }

  removePlayer(id: string) {
    this.players.splice(this.players.findIndex(p => p.id === id), 1);
    delete this.names[id];
  }

  pushMessage = (message: string, author: string = 'System') => this.chatbox = this.chatbox.concat(`\n ${new Date().toLocaleString()} ${author}:  ${message}`);
  getNameById = (id: string): string => this.names[id];
}
