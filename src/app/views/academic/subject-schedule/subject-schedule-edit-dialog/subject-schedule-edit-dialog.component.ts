import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubjectService } from '../../../../domain/service/subject.service';
import { EmployeeService } from '../../../../domain/service/employee.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BaseInputComponent } from '../../../../components/base-input/base-input.component';
import { SubjectScheduleService } from '../../../../domain/service/subject-schedule-student.service';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-subject-schedule-edit-dialog',
  standalone: true,
  imports: [BaseInputComponent],
  templateUrl: './subject-schedule-edit-dialog.component.html',
  styleUrl: './subject-schedule-edit-dialog.component.scss'
})
export class SubjectScheduleEditDialogComponent {
  activityTimeId: any
  classRoomId: any
  form!: FormGroup
  data: any
  rowIndex = -1
  className = ''
  subjects: any[] = []
  teachers: any[] = []
  isSubmiting = signal(false);
  public onClose: Subject<Object> = new Subject();

  fb = inject(FormBuilder)
  subjectService = inject(SubjectService)
  employeeService = inject(EmployeeService)
  subjectScheduleService = inject(SubjectScheduleService)
  private toastService = inject(ToastrService);
  modalRef = inject(BsModalRef)

  constructor() {
    this.form = this.fb.group({
      id: [null],
      classRoomId: [null, [Validators.required]],
      activityTimeId: [null, [Validators.required]],
      subjectId: [null, [Validators.required]],
      dayId: [null, [Validators.required]],
      teacherId: [null, [Validators.required]],
    })
  }

  ngOnInit() {
    this.subjectService.findAll('').subscribe(res => {
      this.subjects = res.body
    })
    this.employeeService.findAll('').subscribe(res => {
      this.teachers = res.body
    })
    this.form.patchValue({
      id: this.data?.id,
      classRoomId: this.classRoomId,
      activityTimeId: this.activityTimeId,
      subjectId: this.data?.subjectId,
      dayId: this.data?.dayId,
      teacherId: this.data?.teacherId,
    })
    console.log(this.data)
  }

  onSave() {
    this.isSubmiting.set(true)
    this.subjectScheduleService.save(this.form.getRawValue()).subscribe(res => {
      this.onClose.next(res);
      this.modalRef.hide()
      this.toastService.success('Simpan/update jadwal sukses')
      this.isSubmiting.set(false)
    })
  }

  onDelete() {
    this.isSubmiting.set(true)
    this.subjectScheduleService.deleteById(this.data.id).subscribe(res => {
      this.onClose.next('confirmDeleteItem');
      this.modalRef.hide();
      this.toastService.success('Hapus jadwal sukses')
      this.isSubmiting.set(false)
    })
  }

}
