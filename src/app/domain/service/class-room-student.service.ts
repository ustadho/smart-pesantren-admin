import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOption } from '../../shared/util/request-util';

@Injectable({ providedIn: 'root' })
export class ClassRoomStudentService {
  private resourceUrl = '/api/academic/class-room-student';

  constructor(private http: HttpClient) { }

  findByClassRoomId(id: string): Observable<any> {
    return this.http.get(`${this.resourceUrl}/${id}`, {observe: 'response'})
  }

  save(data: any): Observable<any> {
    return this.http.put(`${this.resourceUrl}`, data);
  }

}
