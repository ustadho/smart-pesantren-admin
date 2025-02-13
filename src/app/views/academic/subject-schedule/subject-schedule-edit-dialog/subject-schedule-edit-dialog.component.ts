import { Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubjectService } from '../../../../domain/service/subject.service';
import { EmployeeService } from '../../../../domain/service/employee.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BaseInputComponent } from '../../../../components/base-input/base-input.component';
import { SubjectScheduleService } from '../../../../domain/service/subject-schedule.service';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-subject-schedule-edit-dialog',
  standalone: true,
  imports: [BaseInputComponent, CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './subject-schedule-edit-dialog.component.html',
  styleUrl: './subject-schedule-edit-dialog.component.scss',
})
export class SubjectScheduleEditDialogComponent {
  activityTime: any;
  classRoomId: any;
  selectedClassRoom: any;
  form!: FormGroup;
  data: any;
  rowIndex = -1;
  className = '';
  subjects: any[] = [];
  teachers: any[] = [];
  isSubmiting = signal(false);
  public onClose: Subject<Object> = new Subject();
  showComboboxTeacher = false

  fb = inject(FormBuilder);
  subjectService = inject(SubjectService);
  subjectScheduleService = inject(SubjectScheduleService);
  private toastService = inject(ToastrService);
  modalRef = inject(BsModalRef);

  constructor() {
    this.form = this.fb.group({
      id: [null],
      classRoomId: [null, [Validators.required]],
      activityTimeId: [null, [Validators.required]],
      subjectId: [null, [Validators.required]],
      dayId: [null, [Validators.required]],
      teacherId: [null, [Validators.required]],
      teachers: this.fb.array([]),
    });
  }

  ngOnInit() {
  }


  ngAfterViewInit() {
    this.form.patchValue({
      id: this.data?.id,
      classRoomId: this.data.classRoomId,
      activityTimeId: this.activityTime.activityId,
      subjectId: this.data?.subjectId,
      dayId: this.data?.dayId,
      teacherId: this.data?.teacherId,
      teachers: this.data.teachers,
    });
    if (this.data.teachers.length > 0) {
      const teachersArray = this.form.get('teachers') as FormArray;
      teachersArray.clear();
      this.data.teachers.forEach((t: any) => {
        teachersArray.push(this.fb.group(t));
      });
    }
  }

  onSave() {
    this.isSubmiting.set(true);
    this.subjectScheduleService
      .save(this.form.getRawValue())
      .subscribe((res) => {
        this.onClose.next(res);
        this.modalRef.hide();
        this.toastService.success('Simpan/update jadwal sukses');
        this.isSubmiting.set(false);
      });
  }

  onShowComboboxTeacher() {
    this.showComboboxTeacher = true;
  }

  addTeacher() {

    const teacherGroup = this.fb.group({
      teacherId: [null],
      teacherName: ['Nama Baru'],  // Placeholder atau nama default
    });
    this.teachersControls.push(teacherGroup);
  }

  addSelectedTeacher() {
    const teacherId = this.form.get('teacherId')?.value;
    const teacherName = this.teachers.find(t => t.id === teacherId)?.name || 'Unknown Teacher';

    const teacherGroup = this.fb.group({
      id: [teacherId],
      name: [teacherName],
    });

    this.teachersControls.push(teacherGroup);
    this.showComboboxTeacher = false
    // Reset pilihan di ng-select
    this.form.get('teacherId')?.reset();
  }

  removeTeacher(index: number) {
    this.teachersControls.removeAt(index);
  }

  onDelete() {
    this.isSubmiting.set(true);
    this.subjectScheduleService.deleteById(this.data.id).subscribe((res) => {
      this.onClose.next('confirmDeleteItem');
      this.modalRef.hide();
      this.toastService.success('Hapus jadwal sukses');
      this.isSubmiting.set(false);
    });
  }

  get teachersControls() {
    const control = this.form.get('teachers') as FormArray;
    return control;
  }
}
