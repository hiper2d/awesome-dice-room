import {Player} from './player';

export class Room {

  players = new Map<string, Player>();

  constructor(
      public id: string,
      public name: string = 'awesome', // todo: should be done in a dialog, Issue #27
      public playerIds: Array<string> = []
  ) {}
}
