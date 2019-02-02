import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

export abstract class AbstractService {

  protected constructor(private http: HttpClient) {}

  protected get<R>(url: string, params?: HttpParams): Observable<R> {
    return this.http.get<R>(url, { params: params });
  }

  protected post<T, R>(url: string, body: T, params?: HttpParams): Observable<R> {
    return this.http.post<R>(url, body, { params: params });
  }

  protected delete<R>(url: string, params?: HttpParams): Observable<R> {
    return this.http.delete<R>(url, { params: params });
  }

  protected text(url: string): Observable<string> {
    return this.http.get(url, { responseType: 'text' });
  }
}
