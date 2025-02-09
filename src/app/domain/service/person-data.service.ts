import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PersonDataService {
  private resourceUrl = '/api/person-data';

  constructor(private http: HttpClient) { }

  findAll(p: any): Observable<any> {
    return this.http.get(`${this.resourceUrl}/all`, {params: p, observe: 'response'})
  }

  findOne(id: string): Observable<any> {
    return this.http.get(`${this.resourceUrl}/${id}`, {observe: 'response'})
  }
}
