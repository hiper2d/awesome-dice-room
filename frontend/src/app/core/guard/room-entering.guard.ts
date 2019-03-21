import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from '../service/user.service';

@Injectable({
  providedIn: 'root'
})
export class RoomEnteringGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.userService.authenticated) {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }
}
