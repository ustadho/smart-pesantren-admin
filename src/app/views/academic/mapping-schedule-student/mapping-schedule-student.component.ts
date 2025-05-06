import { Component, inject, signal } from '@angular/core';
import { AcademicYearService } from '../../../domain/service/academic-year.service';
import { CommonModule } from '@angular/common';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { SubmitButtonComponent } from '../../../components/submit-button/submit-button.component';
import { ToastrService } from 'ngx-toastr';
import { BaseInputComponent } from '../../../components/base-input/base-input.component';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SubjectScheduleService } from '../../../domain/service/subject-schedule.service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { catchError, of } from 'rxjs';

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
  templateUrl: './mapping-schedule-student.component.html',
  styleUrl: './mapping-schedule-student.component.scss',
})
export class MappingScheduleStudentComponent {
  form!: FormGroup;
  sourceForm!: FormGroup;
  academicYears: any[] = [];
  subjectSchedules: any[] = [];
  teachers: any[] = [];
  categories: any[] = [];
  selectedClassRoom: any = null;
  isSubmitting = signal(false);
  selectedSchedule: any = null;
  public days = [
    { id: 1, name: 'Senin' },
    { id: 2, name: 'Selasa' },
    { id: 3, name: 'Rabu' },
    { id: 4, name: 'Kamis' },
    { id: 5, name: 'Jumat' },
    { id: 6, name: 'Sabtu' },
    { id: 7, name: 'Ahad' },
  ];

  private fb = inject(FormBuilder);
  private academicYearService = inject(AcademicYearService);
  private subjectScheduleService = inject(SubjectScheduleService);
  private toastrService = inject(ToastrService);
  modalRef?: BsModalRef;
  private availableStudents: any[] = [];

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      academicYearId: [null],
      dayId: [new Date().getDay()],
      teacherId: [null],
      filterText: [null],
      selectAll: [false, [Validators.required]],
      students: this.fb.array([], Validators.required),
    });
    this.sourceForm = this.fb.group({
      selectAll: [false, [Validators.required]],
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
  }

  onLoadTeachers() {
    const students = this.form.get('students') as FormArray;
    students.clear();
    this.teachers = [];
    this.form.patchValue({
      teacherId: null,
      id: null,
    });
    students.clear();
    const p = {
      academicYear: this.form.get('academicYearId')?.value,
      dayId: this.form.get('dayId')?.value,
    };
    this.subjectScheduleService
      .findAllTeacherByAcademicYearId(p)
      .subscribe((data: any) => {
        this.teachers = data.body;
      });
  }

  onLoadSubjectScheduleClassRoom() {
    const students = this.form.get('students') as FormArray;
    students.clear();

    this.subjectSchedules = [];
    this.form.get('id')?.setValue(null);
    this.subjectScheduleService;
    this.subjectScheduleService
      .findSubjectScheduleClassroomByTeacher({
        teacherId: this.form.get('teacherId')?.value,
        dayId: this.form.get('dayId')?.value,
      })
      .pipe(
        catchError((err: any) => {
          console.error(err);
          return of(null);
        })
      )
      .subscribe((data: any) => {
        this.subjectSchedules = data.body;
      });
  }

  onSave() {
    this.isSubmitting.set(true); // Atur menjadi true sebelum request dimulai

    this.subjectScheduleService.updateSubjectTeacher(this.form.getRawValue()).subscribe({
      next: (data: any) => {
        this.toastrService.success('Simpan absen sukses');
      },
      error: (err: any) => {
        this.toastrService.error('Gagal menyimpan absen');
        this.isSubmitting.set(false); // Hanya ubah menjadi false jika error
      },
      complete: () => {
        this.isSubmitting.set(false); // Pastikan false setelah request selesai
      },
    });
  }

  onMappingStudent(e: any) {
    if (this.form.value.id == null) {
      return;
    }
    this.selectedSchedule = e;
    const sourceStudents = this.sourceForm.get('students') as FormArray;
    sourceStudents.clear();

    const mappedStudents = this.form.get('students') as FormArray;
    mappedStudents.clear();

    this.subjectScheduleService
      .lookupUnmappedStudentInClassRoom(this.form.value?.id)
      .subscribe((res: any) => {
        this.availableStudents = res.body;
        this.availableStudents.forEach((s: any) => {
          sourceStudents.push(
            this.fb.group({
              ...s,
              selected: false,
            })
          );
        });
      });

      this.subjectScheduleService
      .lookupMappedStudentInClassRoom(this.form.value?.id)
      .subscribe((res: any) => {
        res.body.forEach((s: any) => {
          mappedStudents.push(
            this.fb.group({
              ...s,
              selected: false,
            })
          );
        });
      });
  }

  onSelectAllSource() {
    const lineItems = <FormArray>this.sourceForm.get('students');
    lineItems.markAsDirty();
    lineItems.markAsTouched();
    lineItems.markAsPending();

    lineItems.controls.forEach((x) => {
      x.get('selected')?.setValue(this.sourceForm.get('selectAll')?.value);
    });
  }

  get hasSelectedSourceStudent(): boolean {
    return this.getSourceStudentsControl.controls.some(
      (control) => control.get('selected')?.value
    );
  }

  get hasSelectedDestStudent(): boolean {
    return this.getDestStudentsControl.controls.some(
      (control) => control.get('selected')?.value
    );
  }

  onSelectAllDest() {
    const lineItems = <FormArray>this.form.get('students');
    lineItems.markAsDirty();
    lineItems.markAsTouched();
    lineItems.markAsPending();

    lineItems.controls.forEach((x) => {
      x.get('selected')?.setValue(this.form.get('selectAll')?.value);
    });
  }

  moveSelectedToForm() {
    const sourceStudents = this.sourceForm.get('students') as FormArray;
    const targetStudents = this.form.get('students') as FormArray;

    // Ambil semua students yang dipilih
    const selectedStudents = sourceStudents.controls
      .filter((student) => student.get('selected')?.value) // Hanya yang selected = true
      .map((student) => this.fb.group({ ...student.value, selected: true })); // Buat copy-nya

    // Tambahkan ke form.students
    selectedStudents.forEach((student) => targetStudents.push(student));

    // Hapus dari sourceForm.students yang sudah dipindahkan
    this.sourceForm.setControl(
      'students',
      this.fb.array(
        sourceStudents.controls.filter(
          (student) => !student.get('selected')?.value
        )
      )
    );
  }

  moveSelectedBackToSource() {
    const sourceStudents = this.form.get('students') as FormArray;
    const targetStudents = this.sourceForm.get('students') as FormArray;

    // Ambil semua students yang dipilih
    const selectedStudents = sourceStudents.controls
      .filter((student) => student.get('selected')?.value) // Hanya yang selected = true
      .map((student) => this.fb.group({ ...student.value, selected: true })); // Buat copy-nya

    selectedStudents.forEach((student) => targetStudents.push(student));
    this.form.setControl(
      'students',
      this.fb.array(
        sourceStudents.controls.filter(
          (student) => !student.get('selected')?.value
        )
      )
    );
  }

  moveBackToSource(index: number) {
    const sourceStudents = this.sourceForm.get('students') as FormArray;
    const targetStudents = this.form.get('students') as FormArray;

    // Ambil student dari form.students
    const studentToMove = targetStudents.at(index);

    // Tambahkan kembali ke sourceForm.students
    sourceStudents.push(
      this.fb.group({ ...studentToMove.value, selected: false })
    );

    // Hapus dari form.students
    targetStudents.removeAt(index);
  }

  get getSourceStudentsControl() {
    const control = this.sourceForm.get('students') as FormArray;
    return control;
  }

  get getDestStudentsControl() {
    const control = this.form.get('students') as FormArray;
    return control;
  }
}
