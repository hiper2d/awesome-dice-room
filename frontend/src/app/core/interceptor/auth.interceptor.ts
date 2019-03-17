import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SystemConst} from '../../util/constant/system.const';
import {ApiConst} from '../../util/constant/api.const';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem(SystemConst.LOCAL_STORAGE_TOKEN);
    if (token) {
      const authRequest = this.cloneAndAuthHeader(req, token);
      return next.handle(authRequest);
    }
    return next.handle(req);
  }

  private cloneAndAuthHeader(req: HttpRequest<any>, token) {
    return req.clone({
      headers: req.headers.set(ApiConst.HEADER_AUTH, `${ApiConst.HEADER_AUTH_PREFIX} ${token}`)
    });
  }
}
