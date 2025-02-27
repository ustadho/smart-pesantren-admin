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

  fb = inject(FormBuilder);
  subjectService = inject(SubjectService);
  subjectScheduleService = inject(SubjectScheduleService);
  private toastService = inject(ToastrService);
  modalRef = inject(BsModalRef);
  emptyFormGroup: any;

  constructor() {
    this.form = this.fb.group({
      id: [null],
      classRoomId: [null, [Validators.required]],
      activityTimeId: [null, [Validators.required]],
      dayId: [null, [Validators.required]],
      subjects: this.fb.array([]),
    });
    this.emptyFormGroup = this.fb.group({});

  }

  ngOnInit() {
  }


  ngAfterViewInit() {
    if(this.data != null) {
      this.form.patchValue(this.data)
    }
    const subjectsArray = this.form.get('subjects') as FormArray;
    subjectsArray.clear();

    console.log('Data subjects sebelum inisialisasi:', this.data?.subjects);

    if (this.data?.subjects && this.data.subjects.length > 0) {
      this.data.subjects.forEach((t: any) => {
        subjectsArray.push(this.fb.group({
          id: [t.id],
          subjectId: [t.subjectId],
          subjectName: [t.subjectName],
          teacherId: [t.teacherId || null],
          teacherName: [t.teacherName],
        }));
      });

      console.log('Subjects setelah diisi:', subjectsArray.value);
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
      }, (err: any) => {
        this.toastService.error(err.error)
        this.isSubmiting.set(false);
      });
  }

  onAddTeacher() {
    const teacherGroup = this.fb.group({
      id: [null],
      subjectId: [null],
      subjectName: [null],
      teacherId: [null],
      teacherName: [null],
    });
    this.subjectsControls.push(teacherGroup);
  }

  removeSubject(index: number) {
    this.subjectsControls.removeAt(index);
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

  getSubjectFormGroup(index: number): FormGroup | null {
    const formGroup = this.subjectsControls.at(index);
    return formGroup instanceof FormGroup ? formGroup : null;
  }

  get subjectsControls(): FormArray<FormGroup> {
    return this.form.get('subjects') as FormArray<FormGroup>;
  }
}
