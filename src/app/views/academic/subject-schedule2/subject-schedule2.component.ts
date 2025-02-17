import { Component, inject, signal } from '@angular/core';
import { BaseInputComponent } from '../../../components/base-input/base-input.component';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { EmployeeService } from '../../../domain/service/employee.service';
import { SubjectService } from '../../../domain/service/subject.service';
import { AcademicActivityTimeService } from '../../../domain/service/academic-activity-time.service';
import { DayService } from 'src/app/domain/service/day.service';
import { SubjectScheduleEditDialog2Component } from './subject-schedule-edit-dialog2/subject-schedule-edit-dialog2.component';

@Component({
  selector: 'app-subject-schedule2',
  standalone: true,
  imports: [
    BaseInputComponent,
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [
    BsModalService
  ],
  templateUrl: './subject-schedule2.component.html',
  styleUrl: './subject-schedule2.component.scss',
})
export class SubjectSchedule2Component {
  form!: FormGroup;
  academicYears: any[] = [];
  classRooms: any[] = [];
  institutions: any[] = [];
  categories: any[] = [];
  selectedClassRoom: any = null;
  isLoading = signal(false);
  data : any[] = []
  days : any[] = []
  subjects: any[] = []
  teachers: any[] = []
  activityTimes: any[] = [];

  private fb = inject(FormBuilder);
  private dayService = inject(DayService);
  private academicYearService = inject(AcademicYearService);
  private classRoomService = inject(ClassRoomService);
  private institutionService = inject(InstitutionService);
  private categoryService = inject(StudentCategoryService);
  private subjectScheduleService = inject(SubjectScheduleService);
  private subjectService = inject(SubjectService)
  private bsModalService = inject(BsModalService);
  private toast = inject(ToastrService);
  private employeeService = inject(EmployeeService)

  modalRef?: BsModalRef;

  private activityTimeService = inject(AcademicActivityTimeService);

  constructor() {
    this.form = this.fb.group({
      id: [null],
      classRoomId: [null, [Validators.required]],
      subjectId: [null, [Validators.required]],
      dayId: [null, [Validators.required]],
      teachers: this.fb.array([]),
      activityTimes: this.fb.array([]),
    });
  }
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
      this.teachers = res.body;
    })
    this.dayService.findAll().subscribe(res => {
      this.days = res.body;
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
      .findAllByClassRoomIdPerDay(this.form.value.classRoomId)
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

  }

  onSelectSchedule(activity: any, d: any) {

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





  /////////////////////////////
  // rows = Array(20).fill(0);  // Simulasi 20 baris
  isDragging = false;
  startRow: number | null = null;
  endRow: number | null = null;
  targetColumn: number | null = null;

  startSelection(row: number, col: number): void {
    this.isDragging = true;
    this.startRow = row;
    this.endRow = row;
    this.targetColumn = col;
  }

  onMouseMove(row: number, col: number): void {
    if (this.isDragging && col === this.targetColumn) {
      this.endRow = row;
    }
  }

  endSelection(row: number, col: number): void {
    if (col === this.targetColumn) {
      this.isDragging = false;
      console.log(`Selected from row ${this.startRow} to ${this.endRow} in column ${this.targetColumn}`);
      if(this.startRow == null || this.endRow == null) {
        return
      }
      const day = this.days[col]
      const activityTimeStart = this.activityTimes[this.startRow];
      const activityTimeEnd = this.activityTimes[this.endRow];
      console.log('day', day)
      console.log('activityTimeStart', activityTimeStart)
      console.log('activityTimeEnd', activityTimeEnd)
      console.log('selectedClassRoom', this.selectedClassRoom)

      const initialState: ModalOptions = {
        initialState: {
          selectedClassRoom: this.selectedClassRoom,
          activityTimeStart: activityTimeStart,
          activityTimeEnd: activityTimeEnd,
          data: {
            id: null,
            classRoomId: this.selectedClassRoom.id,
            classRoomName: this.selectedClassRoom.name,
            subjectId: null,
            subjectName: null,
            dayId: day.id,
            dayName: day.name,
            activityTimeStartId: activityTimeStart?.id,
            activityTimeEndId: activityTimeEnd?.id,
            teachers: [],
          },
          name: this.form.getRawValue().name,
          subjects: this.subjects,
          teachers: this.teachers,
          activityTimes: this.activityTimes,
          title: `Tambah Jadwal Pelajaran`,
        },
      };
      console.log('initialState', initialState)

      this.modalRef = this.bsModalService.show(
        SubjectScheduleEditDialog2Component,
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
  }

  isCellSelected(row: number, col: number): boolean {
    if (
      this.startRow !== null &&
      this.endRow !== null &&
      this.targetColumn !== null &&
      col === this.targetColumn
    ) {
      return row >= Math.min(this.startRow, this.endRow) && row <= Math.max(this.startRow, this.endRow);
    }
    return false;
  }
}
