import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TimeZoneInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Ambil zona waktu lokal
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Tambahkan header baru dengan zona waktu
    const modifiedReq = req.clone({
      setHeaders: {
        'Timezone': timeZone,
      },
    });

    // Teruskan request ke handler berikutnya
    return next.handle(modifiedReq);
  }
}
