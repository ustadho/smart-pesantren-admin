import { ChangeDetectorRef, Component, inject, signal, ViewChild } from '@angular/core';
import { BaseInputComponent } from '../../../components/base-input/base-input.component';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SubmitButtonComponent } from '../../../components/submit-button/submit-button.component';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AcademicYearService } from '../../../domain/service/academic-year.service';
import { ClassRoomService } from '../../../domain/service/class-room.service';
import { InstitutionService } from '../../../domain/service/institution.service';
import { StudentCategoryService } from '../../../domain/service/student-category.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { SubjectScheduleService } from '../../../domain/service/subject-schedule.service';
import { SubjectScheduleEditDialogComponent } from './subject-schedule-edit-dialog/subject-schedule-edit-dialog.component';
import { SubjectScheduleHistoryComponent } from './subject-schedule-edit-history/subject-schedule-history.component';
import { EmployeeService } from '../../../domain/service/employee.service';
import { SubjectService } from '../../../domain/service/subject.service';
import { AcademicActivityTimeService } from '../../../domain/service/academic-activity-time.service';

@Component({
  selector: 'app-subject-schedule',
  standalone: true,
  imports: [
    BaseInputComponent,
    ReactiveFormsModule,
    CommonModule
],
  providers: [BsModalService],
  templateUrl: './subject-schedule.component.html',
  styleUrl: './subject-schedule.component.scss'
})
export class SubjectScheduleComponent {
  form!: FormGroup;
  academicYears: any[] = [];
  classRooms: any[] = [];
  institutions: any[] = [];
  categories: any[] = [];
  selectedClassRoom: any = null;
  isLoading = signal(false);
  data : any[] = []
  subjects: any[] = []
  teachers: any[] = []
  activityTimes: any[] = [];

  private fb = inject(FormBuilder);
  private academicYearService = inject(AcademicYearService);
  private classRoomService = inject(ClassRoomService);
  private institutionService = inject(InstitutionService);
  private categoryService = inject(StudentCategoryService);
  private subjectScheduleService = inject(SubjectScheduleService);
  private subjectService = inject(SubjectService)
  private bsModalService = inject(BsModalService);
  private toast = inject(ToastrService);
  private employeeService = inject(EmployeeService)
  activityTimeService = inject(AcademicActivityTimeService);

  modalRef?: BsModalRef;

  ngOnInit(): void {
    this.form = this.fb.group({
      academicYearId: [null],
      institutionId: [null],
      classRoomId: [null],
      schedules: this.fb.array([]),
    });

    this.academicYearService.findAll('').subscribe((data) => {
      this.academicYears = data.body;
      this.academicYears.map((item: any) => {
        if (item.isDefault == true) {
          this.form.get('academicYearId')?.setValue(item.id);
        }
      });
    });
    this.institutionService.findAll('').subscribe((data) => {
      this.institutions = data.body;
    });
    this.categoryService.findAll('').subscribe((data) => {
      this.categories = data.body;
    });
    this.subjectService.findAll('').subscribe(res => {
      this.subjects = res.body
    })
    this.employeeService.findAll('').subscribe(res => {
      this.teachers = res.body
    })

  }

  onSelectClassRoom(e: any) {
    this.selectedClassRoom = e;
    this.onLoadAllSchedules();
  }

  loadClassRoom() {
    this.classRooms = [];
    this.data = [];
    if (
      this.form.value.academicYearId == null ||
      this.form.value.institutionId == null
    ) {
      return;
    }
    this.form.get('classRoomId')?.setValue(null);
    this.classRoomService
      .findByAcademicYear(
        this.form.value.institutionId,
        this.form.value.academicYearId
      )
      .subscribe((data) => {
        this.classRooms = data.body;
      });
  }

  onLoadAllSchedules() {
    this.isLoading.set(true)
    this.activityTimes = []
    const schedules = this.form.get('schedules') as FormArray;
    schedules?.clear();
    if(this.form.value.classRoomId == null || this.selectedClassRoom == null || this.form.value.institutionId == null ) {
      return;
    }
    this.activityTimeService.findAll({
      iid: this.form.getRawValue().institutionId,
      sex: this.selectedClassRoom.sex
    }).subscribe({
      next: (res: any) => {
        this.activityTimes = res.body
      },
      error: (err: any) => {
        this.isLoading.set(false)
      }
    })

    this.subjectScheduleService
      .findAllByClassRoomId(this.form.value.classRoomId)
      .subscribe(
        {
          next: (res: any) => {
            this.data = res.body
            this.isLoading.set(false)
          },
          error: (err: any) => {
            this.isLoading.set(false)
          }
        }
      )


  }

  onPreviewReport() {
    this.subjectScheduleService.previewByClassRoom(this.form.get('classRoomId')?.value, 'pdf')
  }

  onPreviewAuditLog() {
    this.subjectScheduleService.findAllHistoryByClassRoomId(this.form.get('classRoomId')?.value)
    .subscribe((res: any) => {
      const logs = res.body
      const initialState: ModalOptions = {
        initialState: {
          data: logs,
          className: this.classRooms.find(e=>e.id == this.form.getRawValue().classRoomId)?.name
        },
      };

      this.modalRef = this.bsModalService.show(
        SubjectScheduleHistoryComponent,
        initialState
      );
      this.modalRef.setClass('modal-lg');
      this.modalRef.content.closeBtnName = 'Close';
    })
  }

  onSelectSchedule(activity: any, d: any) {
    const initialState: ModalOptions = {
      initialState: {
        classRoomName: this.form.getRawValue().classRoomName,
        activityTime: activity,
        selectedClassRoom: this.selectedClassRoom,
        activityTimeId: activity.activityId,
        data: d,
        name: this.form.getRawValue().name,
        subjects: this.subjects,
        teachers: this.teachers,
        activityTimes: this.activityTimes,
        title: `${activity.activityId == null? 'Tambah': 'Ubah'} Jadwal Pelajaran`,
      },
    };

    this.modalRef = this.bsModalService.show(
      SubjectScheduleEditDialogComponent,
      initialState
    );
    this.modalRef.setClass('modal-lg');
    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.onClose.subscribe((data: any) => {
      if(data != null) {
        this.onLoadAllSchedules()
      }
    });
  }

  onDelete(a: any) {
    Swal.fire({
      title: 'Hapus data',
      text: `Anda yakin untuk menghapus ' ${a.name} - ${a.nis}'?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Batal',
      confirmButtonText: 'Ya Benar',
    }).then((result) => {
      if (result.value) {
        this.subjectScheduleService.deleteById(a.id).subscribe((response) => {
          if (this.form.getRawValue().id != null) {
            this.toast.success('Hapus data sukses');
            this.onLoadAllSchedules()
          }
        });
      }
    });
  }

  get getFormDetailControls() {
    const control = this.form.get('students') as FormArray;
    return control;
  }

  trackIdentity(index: number, d: any) {
    return d.id;
  }

  formatTime(time: string): Date {
    return new Date(`1970-01-01T${time}`);
  }
}
