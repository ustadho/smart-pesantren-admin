import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FoundationService {
  private resourceUrl = '/api/setting/foundation';

  constructor(private http: HttpClient) { }
  getMyFoundation(): Observable<any> {
    return this.http.get(`${this.resourceUrl}`);
  }

  update(data: any): Observable<any> {
    return this.http.put(`${this.resourceUrl}`, data);
  }
}
