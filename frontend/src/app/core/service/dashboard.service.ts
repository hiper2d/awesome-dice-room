import {Injectable} from '@angular/core';
import {Player} from '../../model/player';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  public roomIds: Array<string> = [];
  private myPlayers = new Map<string, Player>();

  public addRoom = (roomId: string) => this.roomIds.unshift(roomId);
  public removeRoom = (id: string) => this.roomIds.splice(this.roomIds.indexOf(id), 1);

  public addPlayer = (roomId: string, player: Player) => this.myPlayers.set(roomId, player);
  public getPlayer = (roomId: string): Player => this.myPlayers.get(roomId);
}
