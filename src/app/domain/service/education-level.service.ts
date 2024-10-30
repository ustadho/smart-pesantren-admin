import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EducationLevelService {
  private resourceUrl = '/api/hr/education-level';

  constructor(private http: HttpClient) { }

  findAll(q: string): Observable<any> {
    return this.http.get(`${this.resourceUrl}/all`, {observe: 'response'})
  }
}
