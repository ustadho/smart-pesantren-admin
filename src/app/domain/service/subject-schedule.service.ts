import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportService } from './report.service';

@Injectable({ providedIn: 'root' })
export class SubjectScheduleService {
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  private resourceUrl = '/api/academic/subject-schedule';

  constructor(private http: HttpClient, private reportService: ReportService) { }

  findAllByClassRoomId(id: string): Observable<any> {

    return this.http.get(`${this.resourceUrl}/${id}`, {
      params: { timeZone: this.timeZone },
      observe: 'response'
    })
  }

  save(data: any): Observable<any> {
    return this.http.put(`${this.resourceUrl}`, data);
  }

  deleteById(id: any) : Observable<HttpResponse<any>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, {
      observe: 'response',
    });
  }

  previewByClassRoom(id: string, format: string) {
    const params = {
      crid: id,
      tz: this.timeZone
    }
    this.reportService.getReport(`${this.resourceUrl}/report/by-classroom`, 'Jadwal Kelas', params, format)
  }

  findAllTeacherByAcademicYearId(id: string) {
    return this.http.get(`${this.resourceUrl}/teachers/${id}`, {observe: 'response'})
  }

  findSubjectScheduleClassroomByTeacher(id: string) {
    return this.http.get(`${this.resourceUrl}/by-teacher/${id}`, {observe: 'response'})
  }

}
