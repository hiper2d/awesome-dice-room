import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

export abstract class AbstractService {

  protected constructor(private http: HttpClient) {}

  protected get<R>(url: string, params?: HttpParams): Observable<R> {
    return this.http.get<R>(url, { params: params });
  }

  protected post<T>(url: string, body: T, params?: HttpParams): Observable<T> {
    return this.http.post<T>(url, body, { params: params });
  }

  protected delete(url: string, params?: HttpParams): Observable<void> {
    return this.http.delete<void>(url, { params: params });
  }

  protected text(url: string): Observable<string> {
    return this.http.get(url, { responseType: 'text' });
  }
}
