import {Injectable} from '@angular/core';
import {AbstractService} from './abstract.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Credentials} from '../../model/credentials';
import {ApiConst} from '../../util/constant/api.const';
import {tap} from 'rxjs/operators';
import {Token} from '../../model/token';
import {Generator} from '../../util/generator';
import {SystemConst} from '../../util/constant/system.const';
import {Roles} from '../../util/constant/role.enum';

@Injectable({
  providedIn: 'root'
})
export class UserService extends AbstractService {

  authenticated = false;
  name = UserService.generateGustName();

  private roles = [];
  private _isAdmin = false;

  constructor(http: HttpClient) {
    super(http);
  }

  private static generateGustName() {
    return 'Guest' + Generator.str(5);
  }

  get isAdmin(): boolean {
    return this._isAdmin;
  }

  signUp(credentials: Credentials): Observable<any> {
    return this.postFunction<Credentials, any>(ApiConst.API_SIGN_UP, credentials);
  }

  getAuthToken(credentials: Credentials): Observable<string> {
    return this.postForText<Credentials>(ApiConst.API_TOKEN, credentials)
      .pipe(
        tap(token => {
          this.storeToken(token);
          localStorage.setItem(SystemConst.LOCAL_STORAGE_TOKEN, token);
        })
      );
  }

  logout() {
    this.authenticated = false;
    this.name = UserService.generateGustName();
    this.roles = [];
    this._isAdmin = false;
    localStorage.removeItem(SystemConst.LOCAL_STORAGE_TOKEN);
  }

  storeToken(tokenStr: String) {
    const parts = tokenStr.split('.');
    const token = JSON.parse(atob(parts[1])) as Token;
    this.authenticated = true;
    this.name = token.sub;
    this.roles = token.roles;
    this._isAdmin = this.roles.indexOf(Roles.ADMIN) > -1;
  }
}
