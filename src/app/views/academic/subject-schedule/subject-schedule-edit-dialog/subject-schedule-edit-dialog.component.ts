import { Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubjectService } from '../../../../domain/service/subject.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BaseInputComponent } from '../../../../components/base-input/base-input.component';
import { SubjectScheduleService } from '../../../../domain/service/subject-schedule.service';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import Utils from '../../../../shared/util/util';

@Component({
  selector: 'app-subject-schedule-edit-dialog2',
  standalone: true,
  imports: [BaseInputComponent, CommonModule, ReactiveFormsModule, NgSelectModule, AccordionModule],
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
  activityTimeStart: any = null;
  activityTimeEnd: any = null;

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
      classRoomName: [null, [Validators.required]],
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
    console.log('this.data', this.data)
    this.form.patchValue(this.data);
    const subjectTeachersArray = this.form.get('subjectTeachers') as FormArray;
    if (this.data.subjectTeachers.length > 0) {
      subjectTeachersArray.clear();
      this.data.subjectTeachers.forEach((t: any) => {
        subjectTeachersArray.push(this.fb.group({
          ...t,
          mappingStudent: false,
          showLookupStudent: false,
        }));
      });
    } else {
      this.onAddTeacher();
    }
  }

  onSave() {
    Utils.validateAllFormFields(this.form);
    for (let el in this.form.controls) {
      if (
        this.form.controls[el].errors ||
        this.form.controls[el].status === 'INVALID'
      ) {
        this.toastService.error(`${el} harus diisi!`)
        console.log(el);
      }
    }

    if (this.form.valid) {
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
  }

  onAddTeacher() {
    const teacherGroup = this.fb.group({
      id: [null],
      subjectId: [null, [Validators.required]],
      subjectName: [null],
      teacherId: [null, [Validators.required]],
      teacherName: [null],
      mappingStudent: [false],
      showLookupStudent: [false],
      students: this.fb.array([]),
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
