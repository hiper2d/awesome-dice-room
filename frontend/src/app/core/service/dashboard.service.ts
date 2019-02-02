import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  public roomIds: Array<String> = [];

  public addRoom = (roomId: string) => this.roomIds.unshift(roomId);
  public removeRoom = (id: string) => this.roomIds.splice(this.roomIds.indexOf(id), 1);
}
