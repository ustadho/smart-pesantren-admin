import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { createRequestOption } from '../../shared/util/request-util';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class ReportService {
  constructor(private http: HttpClient, private toastr: ToastrService) {}

  downloadReport(resourceUrl: string, params: any, format: string) {
    const p = createRequestOption(params);
    const httpOptions = {
      responseType: 'arraybuffer' as 'json',
      params: p,
    };
    return this.http.get(`${resourceUrl}.${format}`, {
      responseType: 'blob',
      params: p,
    });
  }

  getReport(resourceUrl: string, reportName: string, params: any, format: string) {
    const p = createRequestOption(params);
    const httpOptions = {
      responseType: 'arraybuffer' as 'json',
      params: p,
    };
    this.http.get<any>(`${resourceUrl}.${format}`, httpOptions).subscribe(
      (res) => {
        const file = new Blob([res], { type: 'application/' + format });
        const fileURL = URL.createObjectURL(file);
        if (format === 'pdf') window.open(fileURL);
        else {
          var fileLink = document.createElement('a');
          fileLink.href = fileURL;
          fileLink.download = `${reportName}.xlsx`;
          fileLink.click();
        }
      },
      (res: HttpResponse<any>) => this.onError(res)
    );
  }

  private onError(error: any) {
    console.log(error);
    if (!error.ok) {
      this.toastr.error('Report tidak ditemukan!');
    }
    // this.alertService.error(error.error, error.message, null);
  }
}
