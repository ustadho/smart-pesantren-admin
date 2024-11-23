import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PersonTitleService {
  private resourceUrl = '/api/person-title';

  constructor(private http: HttpClient) { }

  findAll(q: string): Observable<any> {
    return this.http.get(`${this.resourceUrl}/all`, {params: {q: q}, observe: 'response'})
  }

}
