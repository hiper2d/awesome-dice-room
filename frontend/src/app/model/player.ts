import {Inventory} from './inventory';
import {Avatar} from '../util/avatar';
import {Color} from '../util/color';

export interface PlayerParams {
  roomId: string;
  name: string;
  avatar?: string;
  color?: string;
  inventory?: Inventory;
}

export class Player {
  id: string; // todo: check if service sets value to private _id without setter
  roomId: string;
  name: string;
  color: string;
  avatar: string;
  inventory: Inventory;

  constructor(params: PlayerParams) {
    this.roomId = params.roomId;
    this.name = params.name;
    this.color = params.color || Color.getColor();
    this.avatar = params.avatar || Avatar.getAvatar();
    this.inventory = params.inventory || new Inventory();
  }
}
