import {
  HttpClient,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Injectable({ providedIn: 'root' })
export class FileService {
  private resourceUrl = '/api/files';


  constructor(
    private bsModalRef: BsModalRef,
    private http: HttpClient,
  ) { }

  // upload(data: any, file: File): Observable<HttpEvent<any>> {
    upload(data: any, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    formData.append('file', file);

    const req = new HttpRequest(
      'POST',
      `${this.resourceUrl}/upload`,
      formData,
      {
        reportProgress: true,
        responseType: 'json',
      }
    );

    // return this.http.request(req);
    return this.http.post(`${this.resourceUrl}/upload`, formData);
  }

  async getImage(img: string): Promise<string> {
    const imageBlob = await this.http
      .get(`${this.resourceUrl}/${img}`, {
        responseType: 'blob',
      })
      .toPromise();

    if (!imageBlob) {
      throw new Error('Failed to load image');
    }
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(imageBlob);
    });
  }

  downloadImage(img: string) {
    return this.http.get(`${this.resourceUrl}/${img}`, {
      responseType: 'blob',
    });
  }

  previewInNewTab(img: string) {
    this.http
      .get(`${this.resourceUrl}/${img}`, {
        responseType: 'blob',
      })
      .subscribe(
        (value) => {
          const blob = new Blob([value], { type: 'image/jpeg' });
          window.open(window.URL.createObjectURL(blob), '_blank');
        },
        (error1) => { }
      );
  }

  previewInNewWindow(img: string) {
    this.http
      .get(`${this.resourceUrl}/${img}`, {
        responseType: 'blob',
      })
      .subscribe(
        (value) => {
          const blob = new Blob([value], { type: 'image/jpeg' });
          window.open(window.URL.createObjectURL(blob),
            'File Uploaded Preview',
            'toolbar=no,scrollbars=no,resizable=no,top=100,left=500,width=1024,height=768');
        },
        (error1) => { }
      );
  }
}
