import {Injectable} from '@angular/core';
import {Generator} from '../../util/generator';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  id = Generator.uuid();
  name = Generator.str(10); // todo: each user should have a username, Issue #7
}
