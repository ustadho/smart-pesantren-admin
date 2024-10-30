import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SubDistrictService {
  private resourceUrl = '/api/sub-district';

  constructor(private http: HttpClient) { }

  search(q: string): Observable<any> {
    return this.http.get(`${this.resourceUrl}/search`, {params: {q: q}, observe: 'response'})
  }

  findBy(id: number): Observable<any> {
    return this.http.get(`${this.resourceUrl}/${id}`, {observe: 'response'})
  }
}
