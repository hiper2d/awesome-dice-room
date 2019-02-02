import {Injectable} from '@angular/core';
import {UuidUtil} from '../../util/uuid.util';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userId = UuidUtil.generateUuid();
}
