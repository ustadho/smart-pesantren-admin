import { Component, inject, signal } from '@angular/core';
import { BaseInputComponent } from '../../../components/base-input/base-input.component';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AcademicYearService } from '../../../domain/service/academic-year.service';
import { ClassRoomService } from '../../../domain/service/class-room.service';
import { InstitutionService } from '../../../domain/service/institution.service';
import { StudentCategoryService } from '../../../domain/service/student-category.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { SubjectSchedule2Service } from '../../../domain/service/subject-schedule2.service';
import { EmployeeService } from '../../../domain/service/employee.service';
import { SubjectService } from '../../../domain/service/subject.service';
import { AcademicActivityTimeService } from '../../../domain/service/academic-activity-time.service';
import { DayService } from '../../../domain/service/day.service';
import { SubjectScheduleEditDialog2Component } from './subject-schedule-edit-dialog2/subject-schedule-edit-dialog2.component';

export interface SubjectTeacher {
  id: string;
  teacherId: string;
  teacherName: string;
  subjectId: string;
  subjectName: string;
}

export interface Schedule {
  id: string;
  classRoomId: string;
  activityStartId: string;
  activityStartTime: string;
  activityEndId: string;
  activityEndTime: string;
  duration: number;
  subjectTeachers: SubjectTeacher[];
}

export interface DaySchedule {
  dayId: number;
  dayName: string;
  schedules: Schedule[];
}

@Component({
  selector: 'app-subject-schedule2',
  standalone: true,
  imports: [BaseInputComponent, ReactiveFormsModule, CommonModule],
  providers: [BsModalService],
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
  data: DaySchedule[] = [];
  days: any[] = [];
  subjects: any[] = [];
  teachers: any[] = [];
  activityTimes: any[] = [];

  private fb = inject(FormBuilder);
  private dayService = inject(DayService);
  private academicYearService = inject(AcademicYearService);
  private classRoomService = inject(ClassRoomService);
  private institutionService = inject(InstitutionService);
  private categoryService = inject(StudentCategoryService);
  private subjectScheduleService = inject(SubjectSchedule2Service);
  private subjectService = inject(SubjectService);
  private bsModalService = inject(BsModalService);
  private toast = inject(ToastrService);
  private employeeService = inject(EmployeeService);

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
    this.subjectService.findAll('').subscribe((res) => {
      this.subjects = res.body;
    });
    this.employeeService.findAll('').subscribe((res) => {
      this.teachers = res.body;
    });
    this.dayService.findAll().subscribe((res) => {
      this.days = res.body;
    });
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
    this.isLoading.set(true);
    this.activityTimes = [];
    const schedules = this.form.get('schedules') as FormArray;
    schedules?.clear();
    if (
      this.form.value.classRoomId == null ||
      this.selectedClassRoom == null ||
      this.form.value.institutionId == null
    ) {
      return;
    }
    this.activityTimeService
      .findAll({
        iid: this.form.getRawValue().institutionId,
        sex: this.selectedClassRoom.sex,
      })
      .subscribe({
        next: (res: any) => {
          this.activityTimes = res.body;
        },
        error: (err: any) => {
          this.isLoading.set(false);
        },
      });

    this.subjectScheduleService
      .findAllByClassRoomIdPerDay(this.form.value.classRoomId)
      .subscribe({
        next: (res: any) => {
          this.data = res.body;
          console.log(this.data);
          this.isLoading.set(false);
        },
        error: (err: any) => {
          this.isLoading.set(false);
        },
      });
  }

  onPreviewReport() {
    this.subjectScheduleService.previewByClassRoom(
      this.form.get('classRoomId')?.value,
      'pdf'
    );
  }

  onPreviewAuditLog() {}

  onSelectSchedule(d: any) {
    console.log(d);

    const initialState: ModalOptions = {
      initialState: {
        data: d,
        name: this.form.getRawValue().name,
        subjects: this.subjects,
        teachers: this.teachers,
        activityTimes: this.activityTimes,
        title: `Update Jadwal Pelajaran`,
      },
    };

    this.modalRef = this.bsModalService.show(
      SubjectScheduleEditDialog2Component,
      initialState
    );
    this.modalRef.setClass('modal-lg');
    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.onClose.subscribe((data: any) => {
      if (data != null) {
        this.onLoadAllSchedules();
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
            this.onLoadAllSchedules();
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

  getDataSchedule(i: number, j: number) {
    if (this.data == null || i < 0 || j < 0) {
      return;
    }
    const d = this.data.find((e) => e.dayId == this.days[j].id);
    if (d == null) {
      return null;
    }
    const s = d.schedules.find(
      (e: any) => e.activityStartId == this.activityTimes[i].id
    );
    console.log('s', s);
    return s;
  }

  getScheduleData(timeIndex: number, dayIndex: number): any {
    if (!this.data || !this.activityTimes) return null;

    const activityTime = this.activityTimes[timeIndex];
    if (!activityTime) return null;

    const daySchedule = this.data.find(d => d.dayId === this.days[dayIndex]?.id);
    if (!daySchedule || !daySchedule.schedules) return null;

    // Find schedule for this activity time
    const schedule = daySchedule.schedules.find((s: Schedule) =>
      s.activityStartId === activityTime.id
    );

    if (schedule && schedule.subjectTeachers?.length > 0) {
      // Get unique subject names and teacher names
      const uniqueSubjects = [...new Set(schedule.subjectTeachers.map(t => t.subjectName))];
      const uniqueTeachers = [...new Set(schedule.subjectTeachers.map(t => t.teacherName))];

      return {
        ...schedule,
        subject: {
          name: uniqueSubjects.join(', ')
        },
        teacher: {
          name: uniqueTeachers.join(', ')
        }
      };
    }

    return null;
  }

  shouldShowCell(timeIndex: number, dayIndex: number): boolean {
    if (!this.data || !this.activityTimes) return true;

    const activityTime = this.activityTimes[timeIndex];
    if (!activityTime) return true;

    // Cek jadwal di atas cell ini
    for (let i = timeIndex - 1; i >= 0; i--) {
      const aboveSchedule = this.getScheduleData(i, dayIndex);
      if (aboveSchedule) {
        const startIndex = this.activityTimes.findIndex(time => time.id === aboveSchedule.activityStartId);
        if (startIndex >= 0 && timeIndex < startIndex + aboveSchedule.duration) {
          return false;
        }
      }
    }

    return true;
  }

  getCellRowspan(timeIndex: number, dayIndex: number): number {
    const schedule = this.getScheduleData(timeIndex, dayIndex);
    if (!schedule) return 1;

    // If this is the starting cell, apply the duration as rowspan
    const activityTime = this.activityTimes[timeIndex];
    if (schedule.activityStartId === activityTime?.id) {
      return schedule.duration || 1;
    }
    return 1;
  }

  /////////////////////////////
  // rows = Array(20).fill(0);  // Simulasi 20 baris
  isDragging = false;
  startRow: number | null = null;
  endRow: number | null = null;
  targetColumn: number | null = null;

  startSelection(row: number, col: number): void {
    // Cek apakah cell sudah memiliki jadwal
    if (this.getScheduleData(row, col)) {
      return;
    }

    this.isDragging = true;
    this.startRow = row;
    this.endRow = row;
    this.targetColumn = col;
  }

  onMouseMove(row: number, col: number): void {
    if (!this.isDragging || col !== this.targetColumn) {
      return;
    }

    // Cek apakah ada jadwal di antara range yang dipilih
    const minRow = Math.min(this.startRow!, row);
    const maxRow = Math.max(this.startRow!, row);

    // Cek setiap cell dalam range
    for (let i = minRow; i <= maxRow; i++) {
      if (this.getScheduleData(i, col)) {
        // Jika ada jadwal, hentikan di batas terakhir yang valid
        this.endRow = i - 1;
        return;
      }
    }

    this.endRow = row;
  }

  endSelection(row: number, col: number): void {
    if (!this.isDragging || col !== this.targetColumn) {
      this.isDragging = false;
      return;
    }

    this.isDragging = false;

    if (this.startRow === null || this.endRow === null) {
      return;
    }

    const minRow = Math.min(this.startRow, this.endRow);
    const maxRow = Math.max(this.startRow, this.endRow);

    // Validasi final sebelum membuka dialog
    for (let i = minRow; i <= maxRow; i++) {
      if (this.getScheduleData(i, col)) {
        return;
      }
    }

    const day = this.days[col];
    const activityTimeStart = this.activityTimes[minRow];
    const activityTimeEnd = this.activityTimes[maxRow];
    const selectedRows = maxRow - minRow + 1;

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
          duration: selectedRows,
          subjectTeachers: [],
        },
        name: this.form.getRawValue().name,
        subjects: this.subjects,
        teachers: this.teachers,
        activityTimes: this.activityTimes,
        title: `Tambah Jadwal Pelajaran`,
      },
    };

    this.modalRef = this.bsModalService.show(
      SubjectScheduleEditDialog2Component,
      initialState
    );
    this.modalRef.setClass('modal-lg');
    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.onClose.subscribe((data: any) => {
      if (data != null) {
        this.onLoadAllSchedules();
      }
    });
  }

  isCellSelected(row: number, col: number): boolean {
    if (
      this.startRow !== null &&
      this.endRow !== null &&
      this.targetColumn !== null &&
      col === this.targetColumn
    ) {
      const minRow = Math.min(this.startRow, this.endRow);
      const maxRow = Math.max(this.startRow, this.endRow);
      return row >= minRow && row <= maxRow;
    }
    return false;
  }
}
