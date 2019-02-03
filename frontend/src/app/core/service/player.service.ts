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

  getPlayer(id: string): Observable<Player> {
    return this.get<Player>(`${ApiConst.API_PLAYERS}/${id}`);
  }

  getPlayers(ids: Array<string>): Observable<Array<Player>> {
    const params = new HttpParams().set('ids', ids.join(','));
    return this.get<Array<Player>>(`${ApiConst.API_PLAYERS}`, params);
  }

  createPlayer(player: Player): Observable<Player> {
    return this.post<Player>(ApiConst.API_PLAYERS, player);
  }

  removePlayer(id: string): Observable<void> {
    return this.delete<void>({ url: `${ApiConst.API_PLAYERS}/${id}` });
  }
}
