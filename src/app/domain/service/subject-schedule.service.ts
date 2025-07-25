import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportService } from './report.service';

@Injectable({ providedIn: 'root' })
export class SubjectScheduleService {

  private resourceUrl = '/api/academic/subject-schedule';

  constructor(private http: HttpClient, private reportService: ReportService) { }

  findAllByClassRoomId(id: string): Observable<any> {
    return this.http.get(`${this.resourceUrl}/${id}/list`, {
      observe: 'response'
    })
  }

  findAllByClassRoomIdPerDay(id: string): Observable<any> {
    return this.http.get(`${this.resourceUrl}/${id}/list-per-day`, {
      observe: 'response'
    })
  }

  findById(id: string): Observable<any> {
    return this.http.get(`${this.resourceUrl}/${id}`, {
      observe: 'response'
    })
  }

  save(data: any): Observable<any> {
    return this.http.put(`${this.resourceUrl}`, data);
  }

  updateSubjectTeacher(data: any): Observable<any> {
    return this.http.put(`${this.resourceUrl}/subject-teacher`, data);
  }

  deleteById(id: any) : Observable<HttpResponse<any>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, {
      observe: 'response',
    });
  }

  previewByClassRoom(id: string, format: string) {
    const params = {
      crid: id,
    }
    this.reportService.getReport(`${this.resourceUrl}/report/by-classroom`, 'Jadwal Kelas', params, format)
  }

  findAllTeacherByAcademicYearId(p: any) {
    return this.http.get(`${this.resourceUrl}/teachers`, {
      params: p,
      observe: 'response'
    })
  }

  findSubjectScheduleClassroomByTeacher(p: any) {
    return this.http.get(`${this.resourceUrl}/by-teacher`, {params: p, observe: 'response'})
  }

  findAllHistoryByClassRoomId(id: string): Observable<any> {
    return this.http.get(`${this.resourceUrl}/history/${id}`, {
      observe: 'response'
    })
  }


  myCurrentSchedule() {
    return this.http.get(`${this.resourceUrl}/my-current-schedule`, {
      observe: 'response'
    })
  }

  myWeeklySchedule() {
    return this.http.get(`${this.resourceUrl}/my-current-schedule`, {
      observe: 'response'
    })
  }

  lookupUnmappedStudentInClassRoom(id: string) {
    return this.http.get(`${this.resourceUrl}/lookup-unmapped-student/${id}`, {
      observe: 'response'
    })
  }

  lookupMappedStudentInClassRoom(id: string) {
    return this.http.get(`${this.resourceUrl}/lookup-mapped-student/${id}`, {
      observe: 'response'
    })
  }
}
