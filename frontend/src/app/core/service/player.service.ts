import {Injectable} from '@angular/core';
import {AbstractService} from './abstract.service';
import {Player} from '../../model/player';
import {ApiConst} from '../../util/api.const';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlayerService extends AbstractService {

  private _systemPlayer = Player.systemPlayer();

  constructor(http: HttpClient) {
    super(http);
  }

  get systemPlayer(): Player {
    return this._systemPlayer;
  }

  getPlayer(id: string): Observable<Player> {
    return this.get<Player>(`${ApiConst.API_PLAYERS}/${id}`);
  }

  findOrCreatePlayer(player: Player): Observable<Player> {
    return this.post<Player>(ApiConst.API_PLAYERS_FIND_OR_CREATE, player);
  }

  removePlayer(id: string): Observable<void> {
    return this.delete<void>({ url: `${ApiConst.API_PLAYERS}/${id}` });
  }
}
