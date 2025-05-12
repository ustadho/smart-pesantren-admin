import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class KBMAssesmentService {
  private resourceUrl = '/api/kbm-assesment';

  constructor(private http: HttpClient) { }

  save(data: any): Observable<any> {
    return this.http.post<HttpResponse<any>>(`${this.resourceUrl}`, data)
  }

  findStudentByClassRoomId(params: any): Observable<any> {
    return this.http.get<HttpResponse<any>>(`${this.resourceUrl}/class-room`, {params, observe: 'response'})
  }

}
