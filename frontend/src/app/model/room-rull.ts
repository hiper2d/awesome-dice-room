import {Player} from './player';

export class RoomFull {

  constructor(
    public id: string,
    public name: string,
    public players: Array<Player>
  ) {}
}
