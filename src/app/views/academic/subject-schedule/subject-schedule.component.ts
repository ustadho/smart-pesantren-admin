import { Component, inject, signal } from '@angular/core';
import { BaseInputComponent } from '../../../components/base-input/base-input.component';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SubmitButtonComponent } from '../../../components/submit-button/submit-button.component';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AcademicYearService } from '../../../domain/service/academic-year.service';
import { ClassRoomService } from '../../../domain/service/class-room.service';
import { InstitutionService } from '../../../domain/service/institution.service';
import { StudentCategoryService } from '../../../domain/service/student-category.service';
import { ClassRoomStudentService } from '../../../domain/service/class-room-student.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { SubjectScheduleService } from '../../../domain/service/subject-schedule-student.service';
import { SubjectScheduleEditDialogComponent } from './subject-schedule-edit-dialog/subject-schedule-edit-dialog.component';

@Component({
  selector: 'app-subject-schedule',
  standalone: true,
  imports: [
    BaseInputComponent,
    ReactiveFormsModule,
    CommonModule,
    SubmitButtonComponent,
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

  private fb = inject(FormBuilder);
  private academicYearService = inject(AcademicYearService);
  private classRoomService = inject(ClassRoomService);
  private institutionService = inject(InstitutionService);
  private categoryService = inject(StudentCategoryService);
  private subjectScheduleService = inject(SubjectScheduleService);
  private bsModalService = inject(BsModalService);
  private toast = inject(ToastrService);
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
  }

  onSelectClassRoom(e: any) {
    this.selectedClassRoom = e;
    this.onLoadAllSchedules();
  }

  loadClassRoom() {
    this.classRooms = [];
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
    const schedules = this.form.get('schedules') as FormArray;
    schedules?.clear();
    if(this.form.value.classRoomId == null) {
      return;
    }

    this.subjectScheduleService
      .findAllByClassRoomId(this.form.value.classRoomId)
      .subscribe((data) => {
        this.data = data.body
        this.isLoading.set(false)
      });
  }

  onPreviewReport() {
    this.subjectScheduleService.previewByClassRoom(this.form.get('classRoomId')?.value, 'pdf')
  }

  onSelectSchedule(activityId: string, d: any) {
    const initialState: ModalOptions = {
      initialState: {
        classRoomId: this.form.getRawValue().classRoomId,
        activityTimeId: activityId,
        data: d,
        name: this.form.getRawValue().name,
        title: `${activityId == null? 'Tambah': 'Ubah'} Jadwal Pelajaran`,
      },
    };

    this.modalRef = this.bsModalService.show(
      SubjectScheduleEditDialogComponent,
      initialState
    );
    this.modalRef.setClass('modal-md');
    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.onClose.subscribe((data: any) => {
      console.log('modal closed', data)
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
}
