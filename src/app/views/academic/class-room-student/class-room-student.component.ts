import { Component, inject, signal } from '@angular/core';
import { BaseInputComponent } from '../../../components/base-input/base-input.component';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { AcademicYearService } from '../../../domain/service/academic-year.service';
import { ClassRoomService } from '../../../domain/service/class-room.service';
import { ClassRoomStudentService } from '../../../domain/service/class-room-student.service';
import { InstitutionService } from '../../../domain/service/institution.service';
import { StudentCategoryService } from '../../../domain/service/student-category.service';
import { CommonModule } from '@angular/common';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { StudentLookupComponent } from '../student/student-lookup/student-lookup.component';
import { SubmitButtonComponent } from '../../../components/submit-button/submit-button.component';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-class-room-student',
  standalone: true,
  imports: [
    BaseInputComponent,
    ReactiveFormsModule,
    CommonModule,
    SubmitButtonComponent,
  ],
  providers: [BsModalService],
  templateUrl: './class-room-student.component.html',
  styleUrl: './class-room-student.component.scss',
})
export class ClassRoomStudentComponent {
  form!: FormGroup;
  academicYears: any[] = [];
  classRooms: any[] = [];
  institutions: any[] = [];
  categories: any[] = [];
  selectedClassRoom: any = null;
  isSubmitting = signal(false);

  private fb = inject(FormBuilder);
  private academicYearService = inject(AcademicYearService);
  private classRoomService = inject(ClassRoomService);
  private institutionService = inject(InstitutionService);
  private categoryService = inject(StudentCategoryService);
  private classRoomStudentService = inject(ClassRoomStudentService);
  private bsModalService = inject(BsModalService);
  private toast = inject(ToastrService);
  modalRef?: BsModalRef;

  ngOnInit(): void {
    this.form = this.fb.group({
      academicYearId: [null],
      institutionId: [null],
      classRoomId: [null],
      students: this.fb.array([]),
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
    this.loadStudent();
  }

  onSave() {
    this.isSubmitting.set(true);
    this.classRoomStudentService
      .save(this.form.getRawValue())
      .subscribe((data: any) => {
        console.log('success');
      });
    this.isSubmitting.set(false);
  }

  onStudentLookup() {
    if (this.selectedClassRoom == null) {
      return;
    }
    const initialState: ModalOptions = {
      initialState: {
        param: {
          sex: this.selectedClassRoom?.sex,
          institutionId: this.form.value.institutionId,
        },
        academicYears: this.academicYears,
        categories: this.categories,
        title: 'Lookup Santri',
      },
    };

    this.modalRef = this.bsModalService.show(
      StudentLookupComponent,
      initialState
    );
    this.modalRef.setClass('custom-modal-width');
    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.onClose.subscribe((arr: any) => {
      for (let index = 0; index < arr.length; index++) {
        const details = this.form.get('students') as FormArray;
        const el = arr[index];
        details.push(
          this.fb.group({
            id: null,
            studentId: el.id,
            nis: el.nis,
            nisn: el.nisn,
            name: el.name,
            joinYear: el.joinYear,
          })
        );
      }
    });
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

  loadStudent() {
    const students = this.form.get('students') as FormArray;
    students?.clear();
    if(this.form.value.classRoomId == null) {
      return;
    }

    this.classRoomStudentService
      .findByClassRoomId(this.form.value.classRoomId)
      .subscribe((data) => {
        this.form.patchValue(data.body);
        const students = this.form.get('students') as FormArray;
        students.clear();
        students.clear();
        data.body.students.forEach((s: any) => {
          students.push(this.fb.group(s));
        });
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
        this.classRoomStudentService.deleteById(a.id).subscribe((response) => {
          if (this.form.getRawValue().id != null) {
            this.toast.success('Hapus data sukses');
            this.loadStudent()
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
