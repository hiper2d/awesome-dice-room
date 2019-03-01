import {Injectable} from '@angular/core';
import {AbstractService} from './abstract.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Credentials} from '../../model/credentials';
import {ApiConst} from '../../util/api.const';
import {tap} from 'rxjs/operators';
import {Token} from '../../model/token';
import {Generator} from '../../util/generator';

@Injectable({
  providedIn: 'root'
})
export class UserService extends AbstractService {

  authenticated = false;
  id = Generator.uuid(); // todo: we won't send user id from backend, need to get rid of it
  name = 'Guest' + Generator.str(5);

  constructor(http: HttpClient) {
    super(http);
  }

  signUp(credentials: Credentials): Observable<any> {
    return this.postFunction<Credentials, any>(ApiConst.API_SIGN_UP, credentials);
  }

  getAuthToken(credentials: Credentials): Observable<string> {
    return this.postForText<Credentials>(ApiConst.API_TOKEN, credentials)
      .pipe(
        tap(token => {
          this.storeToken(token);
          localStorage.setItem(ApiConst.LOCAL_STORAGE_TOKEN, token);
        })
      );
  }

  logout() {
    this.authenticated = false;
    this.name = 'Guest' + Generator.str(5);
    localStorage.removeItem(ApiConst.LOCAL_STORAGE_TOKEN);
  }

  storeToken(token: String) {
    const parts = token.split('.');
    const tokenObj = JSON.parse(atob(parts[1])) as Token;
    this.authenticated = true;
    this.name = tokenObj.sub;
  }
}
