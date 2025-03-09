import { Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubjectService } from '../../../../domain/service/subject.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BaseInputComponent } from '../../../../components/base-input/base-input.component';
import { SubjectSchedule2Service } from '../../../../domain/service/subject-schedule2.service';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-subject-schedule-edit-dialog2',
  standalone: true,
  imports: [BaseInputComponent, CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './subject-schedule-edit-dialog2.component.html',
  styleUrl: './subject-schedule-edit-dialog2.component.scss',
})
export class SubjectScheduleEditDialog2Component {
  activityTime: any;
  classRoomId: any;
  selectedClassRoom: any;
  form!: FormGroup;
  data: any;
  rowIndex = -1;
  className = '';
  subjects: any[] = [];
  teachers: any[] = [];
  activityTimeStart: any = null;
  activityTimeEnd: any = null;

  isSubmiting = signal(false);
  public onClose: Subject<Object> = new Subject();

  fb = inject(FormBuilder);
  subjectService = inject(SubjectService);
  subjectScheduleService = inject(SubjectSchedule2Service);
  private toastService = inject(ToastrService);
  modalRef = inject(BsModalRef);
  emptyFormGroup: any;

  constructor() {
    this.form = this.fb.group({
      id: [null],
      classRoomId: [null, [Validators.required]],
      activityStartId: [null, [Validators.required]],
      activityStartTime: [null, [Validators.required]],
      activityEndId: [null, [Validators.required]],
      activityEndTime: [null, [Validators.required]],
      dayId: [null, [Validators.required]],
      dayName: [null, [Validators.required]],
      duration: [0, [Validators.required]],
      subjectTeachers: this.fb.array([]),
    });
    this.emptyFormGroup = this.fb.group({});
  }

  ngOnInit() {
  }


  ngAfterViewInit() {
    this.form.patchValue(this.data);
    if (this.data.subjectTeachers.length > 0) {
      const subjectTeachersArray = this.form.get('subjectTeachers') as FormArray;
      subjectTeachersArray.clear();
      this.data.subjectTeachers.forEach((t: any) => {
        subjectTeachersArray.push(this.fb.group(t));
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
    this.subjectTeachersControls.push(teacherGroup);
  }

  removeSubject(index: number) {
    this.subjectTeachersControls.removeAt(index);
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

  get subjectTeachersControls(): FormArray<FormGroup> {
    return this.form.get('subjectTeachers') as FormArray<FormGroup>;
  }
}
