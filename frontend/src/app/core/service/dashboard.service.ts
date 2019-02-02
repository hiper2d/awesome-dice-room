import {Injectable} from '@angular/core';
import {Player} from '../../model/player';
import {HttpClient} from '@angular/common/http';
import {AbstractService} from './abstract.service';
import {Observable} from 'rxjs';
import {Room} from '../../model/room';
import {ApiConst} from '../../util/api.const';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends AbstractService {

  constructor(http: HttpClient) {
    super(http);
  }

  private myPlayers = new Map<string, Player>();

  public addPlayer = (roomId: string, player: Player) => this.myPlayers.set(roomId, player);
  public getPlayer = (roomId: string): Player => this.myPlayers.get(roomId);

  getRoom(id: string): Observable<Room> {
    return this.get<Room>(`${ApiConst.API_ROOMS}/${id}`);
  }

  allRooms(): Observable<Array<Room>> {
    return this.get<Array<Room>>(ApiConst.API_ROOMS);
  }

  createRoom(room: Room): Observable<Room> {
    return this.post(ApiConst.API_ROOMS, room);
  }

  deleteRoom(id: string): Observable<Room> {
    return this.delete(`${ApiConst.API_ROOMS}/${id}`);
  }
}
