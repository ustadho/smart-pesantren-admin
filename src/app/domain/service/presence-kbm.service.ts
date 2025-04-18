import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOption } from '../../shared/util/request-util';

@Injectable({ providedIn: 'root' })
export class PresenceKBMService {

  private resourceUrl = '/api/academic/presence-kbm';

  constructor(private http: HttpClient) { }

  save(data: any): Observable<any> {
    return this.http.put(`${this.resourceUrl}`, data);
  }

  deleteById(id: any) : Observable<HttpResponse<any>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, {
      observe: 'response',
    });
  }

  findDetailStudents(id: string): Observable<any> {
    return this.http.get(`${this.resourceUrl}/detail-students/${id}`, {observe: 'response'})
  }

}
