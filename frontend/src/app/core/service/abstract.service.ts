import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

interface Args<T> {
  url: string;
  body?: T;
  params?: HttpParams;
}

export abstract class AbstractService {

  protected constructor(private http: HttpClient) {}

  protected get<R>(url: string, params?: HttpParams): Observable<R> {
    return this.http.get<R>(url, { params: params });
  }

  protected post<T>(url: string, body: T, params?: HttpParams): Observable<T> {
    return this.http.post<T>(url, body, { params: params });
  }

  protected postFunction<T, R>(url: string, body: T, params?: HttpParams): Observable<R> {
    return this.http.post<R>(url, body, { params: params });
  }

  protected postForText<T>(url: string, body: T): Observable<string> {
    return this.http.post(url, body, { responseType: 'text' });
  }

  protected put<T>(args: Args<T>): Observable<T> {
    return this.http.put<T>(args.url, args.body, { params: args.params });
  }

  protected delete<T>(args: Args<T>): Observable<T> {
    return this.http.delete<T>(args.url, { params: args.params });
  }

  protected text(url: string): Observable<string> {
    return this.http.get(url, { responseType: 'text' });
  }
}
