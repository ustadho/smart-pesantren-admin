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
import { AcademicActivityTimeService } from 'src/app/domain/service/academic-activity-time.service';

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
  subjectScheduleService = inject(SubjectScheduleService);
  private toastService = inject(ToastrService);
  modalRef = inject(BsModalRef);

  constructor() {
    this.form = this.fb.group({
      id: [null],
      classRoomId: [null, [Validators.required]],
      classRoomName: [null, [Validators.required]],
      subjectId: [null, [Validators.required]],
      dayId: [null, [Validators.required]],
      dayName: [null, [Validators.required]],
      teachers: this.fb.array([]),
      activityTimeStartId: [null, [Validators.required]],
      activityTimeEndId: [null, [Validators.required]],
    });
  }

  ngOnInit() {
  }


  ngAfterViewInit() {
    this.form.patchValue(this.data);
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
      }, (err: any) => {
        this.toastService.error(err.error)
        this.isSubmiting.set(false);
      });
  }

  onAddTeacher() {
    const teacherGroup = this.fb.group({
      id: [null],
      name: [null],
    });
    this.teachersControls.push(teacherGroup);
  }

  onAddActivityTime() {
    this.activityTimesControls.push(
      this.fb.group({
        id: [null],
        name: [null],
      })
    )
  }

  addSelectedTeacher() {
    const teacherId = this.form.get('teacherId')?.value;
    const teacherName = this.teachers.find(t => t.id === teacherId)?.name || 'Unknown Teacher';

    const teacherGroup = this.fb.group({
      id: [teacherId],
      name: [teacherName],
    });

    this.teachersControls.push(teacherGroup);
    // Reset pilihan di ng-select
    this.form.get('teacherId')?.reset();
  }

  removeTeacher(index: number) {
    this.teachersControls.removeAt(index);
  }

  removeActivityTime(index: number) {
    this.activityTimesControls.removeAt(index);
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


  get activityTimesControls() {
    const control = this.form.get('activityTimes') as FormArray;
    return control;
  }
}
