import { Component, inject, signal } from '@angular/core';
import { AcademicYearService } from '../../../domain/service/academic-year.service';
import { CommonModule } from '@angular/common';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { SubmitButtonComponent } from '../../../components/submit-button/submit-button.component';
import { PRESENCE_STATUS } from '../../../shared/constant/presence.constants';
import { ToastrService } from 'ngx-toastr';
import { BaseInputComponent } from '../../../components/base-input/base-input.component';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PresenceKBMService } from '../../../domain/service/presence-kbm.service';
import { SubjectScheduleService } from '../../../domain/service/subject-schedule.service';
import { PresenceKbmIzinComponent } from './presence-kbm-izin/presence-kbm-izin.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AccountService } from '../../../core/auth/account.service';
import { ROLE_PENDIDIKAN } from '../../../shared/constant/role.constant'

@Component({
  selector: 'app-presence-kbm',
  standalone: true,
  imports: [
    BaseInputComponent,
    ReactiveFormsModule,
    CommonModule,
    SubmitButtonComponent,
    TabsModule,
  ],
  providers: [BsModalService],
  templateUrl: './presence-kbm.component.html',
  styleUrl: './presence-kbm.component.scss'
})
export class PresenceKbmComponent {
  form!: FormGroup;
  academicYears: any[] = [];
  subjectSchedules: any[] = [];
  teachers: any[] = [];
  categories: any[] = [];
  selectedClassRoom: any = null;
  isSubmitting = signal(false);

  private fb = inject(FormBuilder);
  private academicYearService = inject(AcademicYearService);
  private presenceKBMService = inject(PresenceKBMService);
  private subjectScheduleService = inject(SubjectScheduleService);
  private accountService = inject(AccountService);
  private bsModalService = inject(BsModalService);
  modalRef?: BsModalRef;
  private currentAccount: any

  ngOnInit(): void {
    this.form = this.fb.group({
      academicYearId: [null],
      teacherId: [null],
      subjectScheduleId: [null],
      filterText: [null],
      selectAll: [true, [Validators.required]],
      students: this.fb.array([]),
    });

    this.academicYearService.findAll('').subscribe((data) => {
      this.academicYears = data.body;
      this.academicYears.map((item: any) => {
        if (item.isDefault == true) {
          this.form.get('academicYearId')?.setValue(item.id);
          this.onLoadTeachers();
        }
      });
    });

    this.accountService.identity().then(account => {
      this.currentAccount = account;
      if(account != null && account.personData.id != null) {
        if(account.authorities.indexOf(ROLE_PENDIDIKAN)) {
          this.subjectScheduleService.myCurrentSchedule().subscribe((res: any) => {
            console.log('mySchedules', res)
            this.subjectSchedules = res.body
          })
        }
      }
    });
  }

  onLoadTeachers() {
    this.teachers = []
    this.subjectScheduleService.findAllTeacherByAcademicYearId(this.form.get('academicYearId')?.value).subscribe((data: any) => {
      this.teachers = data.body
    })
  }

  onLoadSubjectScheduleClassRoom() {
    this.subjectSchedules = []
    this.form.get('subjectScheduleId')?.setValue(null)
    this.subjectScheduleService.findSubjectScheduleClassroomByTeacher(this.form.get('teacherId')?.value).subscribe((data: any) => {
      this.subjectSchedules = data.body
    })
  }

  onSave() {
    this.isSubmitting.set(true);
    this.presenceKBMService
      .save(this.form.getRawValue())
      .subscribe((data: any) => {
        console.log('success');
      });
    this.isSubmitting.set(false);
  }

  onSelectAll() {
    const lineItems = <FormArray>this.form.get('students');
    lineItems.markAsDirty();
    lineItems.markAsTouched();
    lineItems.markAsPending();

    lineItems.controls.forEach((x) => {
      x.get('selected')?.setValue(this.form.get('selectAll')?.value);
    });
  }

  loadStudent(e: any) {
    console.log('e', e)
    const students = this.form.get('students') as FormArray;
    students?.clear();
    if(e.classRoomId == null) {
      return;
    }

    this.presenceKBMService
      .findDetailStudents(e.classRoomId)
      .subscribe((data) => {
        console.log('data', data)
        const students = this.form.get('students') as FormArray;
        students.clear();
        data.body.forEach((s: any) => {
          students.push(this.fb.group({
            ...s,
            selected: s.presenceStatusId == PRESENCE_STATUS.HADIR,
          }));
        });
      });
  }

  onIzin(index: number) {
    const d = this.form.get('students')?.value[index];
    const initialState: ModalOptions = {
      initialState: {
        data: d,
        name: this.form.getRawValue().name,
        title: `Izin/Sakit/Lainnya`,
      },
    };

    this.modalRef = this.bsModalService.show(
      PresenceKbmIzinComponent,
      initialState
    );
    this.modalRef.setClass('modal-md');
    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.onClose.subscribe((data: any) => {
      const students = this.form.get('students') as FormArray;
      console.log('modal closed', data)
      if(data == 'deleteIzin') {
        students.at(index).patchValue({
          presenceStatusId: PRESENCE_STATUS.HADIR,
          presenceStatusName: 'HADIR',
          note: null,
          attachment: null
        })
      } else {
        students.at(index).patchValue({
          presenceStatusId: data.presenceStatusId,
          presenceStatusName: data.presenceStatusName,
          note: data.note,
          attachment: data.attachment
        })
      }

    });
  }
  onSelected() {
    const lineItems = <FormArray>this.form.get('students');
    lineItems.markAsDirty();
    lineItems.markAsTouched();
    lineItems.markAsPending();
  }

  get getFormDetailControls() {
    const control = this.form.get('students') as FormArray;
    return control;
  }

  trackIdentity(index: number, d: any) {
    return d.id;
  }
}
