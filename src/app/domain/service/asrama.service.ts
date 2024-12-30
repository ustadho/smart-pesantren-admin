import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOption } from '../../shared/util/request-util';

@Injectable({ providedIn: 'root' })
export class AsramaService {
  private resourceUrl = '/api/setting/asrama';

  constructor(private http: HttpClient) { }

  query(req?: any): Observable<HttpResponse<any[]>> {
    const options = createRequestOption(req);
    return this.http.get<any[]>(this.resourceUrl, {
      params: options,
      observe: 'response',
    });
  }

  create(value: any): Observable<any> {
    return this.http.post(`${this.resourceUrl}`, value);
  }

  findAll(req?: any): Observable<any> {
    const p = createRequestOption(req);
    return this.http.get(`${this.resourceUrl}/all`, {params: p, observe: 'response'})
  }

  findOne(id: string): Observable<any> {
    return this.http.get(`${this.resourceUrl}/${id}`, {
      observe: 'response',
    });
  }

  update(data: any): Observable<any> {
    return this.http.put(`${this.resourceUrl}/${data.id}`, data);
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, {
      observe: 'response',
    });
  }

  createOrUpdateSantri(vm: any) {
    return this.http.post(`${this.resourceUrl}/santri`, vm);
  }

  deleteSantri(id: number): Observable<HttpResponse<any>> {
    return this.http.delete(`${this.resourceUrl}/santri/${id}`, {
      observe: 'response',
    });
  }

  findAllSantri(asramaId: string): Observable<any> {
    return this.http.get(`${this.resourceUrl}/santri/${asramaId}`, {observe: 'response'})
  }
}
