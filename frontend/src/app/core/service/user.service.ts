import {Injectable} from '@angular/core';
import {Generator} from '../../util/generator';
import {AbstractService} from './abstract.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Credentials} from '../../model/credentials';
import {ApiConst} from '../../util/api.const';

@Injectable({
  providedIn: 'root'
})
export class UserService extends AbstractService {

  id = Generator.uuid();
  name = Generator.str(10); // todo: each user should have a username, Issue #7

  constructor(http: HttpClient) {
    super(http);
  }

  signUp(credentials: Credentials): Observable<any> {
    return this.postFunction<Credentials, any>(ApiConst.API_SIGN_UP, credentials);
  }

  login(credentials: Credentials): Observable<User> {
    return this.postFunction<Credentials, User>(ApiConst.API_TOKEN, credentials);
  }
}
