import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { createRequestOption } from '../../shared/util/request-util';

@Injectable({ providedIn: 'root' })
export class UserService {
  public resourceUrl = '/api/users';

  constructor(private http: HttpClient) { }

  create(user: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.resourceUrl, user, { observe: 'response' });
  }

  update(user: any): Observable<HttpResponse<any>> {
    return this.http.put<any>(this.resourceUrl, user, { observe: 'response' });
  }

  find(login: string): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.resourceUrl}/${login}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<any[]>> {
    const options = createRequestOption(req);
    return this.http.get<any[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(login: string): Observable<HttpResponse<any>> {
    return this.http.delete(`${this.resourceUrl}/${login}`, { observe: 'response' });
  }

  authorities(): Observable<string[]> {
    return this.http.get<string[]>('/api/users/authorities');
  }
}
