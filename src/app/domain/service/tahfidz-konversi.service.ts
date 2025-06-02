import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TahfidzKonversiService {

  private resourceUrl = '/api/tahfidz-konversi';

  constructor(private http: HttpClient) { }

  findAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.resourceUrl}/all`, {observe: 'response'})
      .pipe(
        map(response => response.body || [])
      );
  }

  findByNomor(nomor: number): Observable<any> {
    return this.http.get(`${this.resourceUrl}/by-nomor/${nomor}`, {observe: 'response'})
      .pipe(
        map(response => response.body)
      );
  }

  findByJumlahHalaman(jumlah: number): Observable<any> {
    return this.http.get(`${this.resourceUrl}/by-jumlah-halaman/${jumlah}`, {observe: 'response'})
      .pipe(
        map(response => response.body)
      );
  }
}
