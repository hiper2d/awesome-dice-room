import {Injectable} from '@angular/core';
import {AbstractService} from './abstract.service';
import {Player} from '../../model/player';
import {ApiConst} from '../../util/api.const';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlayerService extends AbstractService {

  constructor(http: HttpClient) {
    super(http);
  }

  getPlayers(ids: Array<string>): Observable<Player> {
    let params = new HttpParams();
    ids.forEach(id => params = params.append('ids', id));
    return this.get<Player>(`${ApiConst.API_PLAYERS}`);
  }

  addPlayer(player: Player): Observable<Player> {
    return this.post<Player>(ApiConst.API_PLAYERS, player);
  }

  removePlayer(id: string): Observable<void> {
    return this.delete(`${ApiConst.API_PLAYERS}/${id}`);
  }
}
