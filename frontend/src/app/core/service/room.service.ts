import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AbstractService} from './abstract.service';
import {Observable} from 'rxjs';
import {Room} from '../../model/room';
import {ApiConst} from '../../util/api.const';

@Injectable({
  providedIn: 'root'
})
export class RoomService extends AbstractService {

  constructor(http: HttpClient) {
    super(http);
  }

  getRoom(id: string): Observable<Room> {
    return this.get<Room>(`${ApiConst.API_ROOMS}/${id}`);
  }

  allRooms(): Observable<Array<Room>> {
    return this.get<Array<Room>>(ApiConst.API_ROOMS);
  }

  createRoom(room: Room): Observable<Room> {
    return this.post<Room>(ApiConst.API_ROOMS, room);
  }

  deleteRoom(id: string): Observable<void> {
    return this.delete(`${ApiConst.API_ROOMS}/${id}`);
  }
}
