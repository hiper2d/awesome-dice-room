import {PlayerModel} from './player.model';

export class RoomModel {
  constructor(public players: Array<PlayerModel>) {
    this.players = players;
  }
}
