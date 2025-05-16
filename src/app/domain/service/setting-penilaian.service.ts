import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SettingPenilaianService {
  private resourceUrl = '/api/setting/penilaian';

  constructor(private http: HttpClient) { }
  getSettingPenilaian(institutionId: string): Observable<any> {
    return this.http.get(`${this.resourceUrl}/${institutionId}`);
  }

  update(data: any): Observable<any> {
    return this.http.put(`${this.resourceUrl}`, data);
  }
}
