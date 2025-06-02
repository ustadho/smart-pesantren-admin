import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOption } from '../../shared/util/request-util';

@Injectable({ providedIn: 'root' })
export class TahfidzTargetSantriService {

  private resourceUrl = '/api/pengasuhan/tahfidz/target-santri';

  constructor(private http: HttpClient) { }

  findByClassRoomId(id: string): Observable<any> {
    return this.http.get(`${this.resourceUrl}/by-classroom/${id}`, {observe: 'response'})
  }


}
