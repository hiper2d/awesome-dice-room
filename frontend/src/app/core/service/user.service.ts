import {Injectable} from '@angular/core';
import {AbstractService} from './abstract.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Credentials} from '../../model/credentials';
import {ApiConst} from '../../util/api.const';
import {tap} from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import {Token} from '../../model/token';
import {Generator} from '../../util/generator';

@Injectable({
  providedIn: 'root'
})
export class UserService extends AbstractService {

  id = Generator.uuid(); // todo: we won't send user id from backend, need to get rid of it
  name = 'Guest';

  private helper = new JwtHelperService();

  constructor(http: HttpClient) {
    super(http);
  }

  signUp(credentials: Credentials): Observable<any> {
    return this.postFunction<Credentials, any>(ApiConst.API_SIGN_UP, credentials);
  }

  getAuthToken(credentials: Credentials): Observable<string> {
    return this.postForText<Credentials>(ApiConst.API_TOKEN, credentials)
      .pipe(
        tap(tokenStr => {
          const tokenObj = this.helper.decodeToken(tokenStr) as Token;
          this.name = tokenObj.sub;
        })
      );
  }
}
