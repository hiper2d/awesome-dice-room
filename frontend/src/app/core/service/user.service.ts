import {Injectable} from '@angular/core';
import {Generator} from '../../util/generator';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  id = Generator.uuid();
  name = Generator.str(10); // todo: each user should have a username, Issue #7

  private roomPlayerMap = new Map<string, string>();

  joinRoom = (roomId: string, playerId: string) => this.roomPlayerMap.set(roomId, playerId);
  leaveRoom = (roomId: string) => this.roomPlayerMap.delete(roomId);
  isInRoom = (roomId) => this.roomPlayerMap.has(roomId);
  getPlayerId = (roomId) => this.roomPlayerMap.get(roomId);
}
