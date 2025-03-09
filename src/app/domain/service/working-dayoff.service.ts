import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WorkingDayoffService {
  private resourceUrl = '/api/hr/working-dayoff';

  constructor(private http: HttpClient) { }

  findAll(param: any): Observable<any> {
    return this.http.get(`${this.resourceUrl}/all`, {params: param, observe: 'response'})
  }

  update(data: any): Observable<any> {
    return this.http.put(`${this.resourceUrl}`, data);
  }

}
