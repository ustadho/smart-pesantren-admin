import { Component, inject, signal } from '@angular/core';
import { AcademicYearService } from '../../../domain/service/academic-year.service';
import { ClassRoomService } from '../../../domain/service/class-room.service';
import { ClassRoomStudentService } from '../../../domain/service/class-room-student.service';
import { InstitutionService } from '../../../domain/service/institution.service';
import { StudentCategoryService } from '../../../domain/service/student-category.service';
import { CommonModule } from '@angular/common';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SubmitButtonComponent } from '../../../components/submit-button/submit-button.component';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { BaseInputComponent } from '../../../components/base-input/base-input.component';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PresenceKBMService } from '../../../domain/service/presence-kbm.service';

@Component({
  selector: 'app-presence-kbm',
  standalone: true,
  imports: [
    BaseInputComponent,
    ReactiveFormsModule,
    CommonModule,
    SubmitButtonComponent,
  ],
  providers: [],
  templateUrl: './presence-kbm.component.html',
  styleUrl: './presence-kbm.component.scss'
})
export class PresenceKbmComponent {
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
  private presenceKBMService = inject(PresenceKBMService);
  private toast = inject(ToastrService);
  modalRef?: BsModalRef;

  ngOnInit(): void {
    this.form = this.fb.group({
      academicYearId: [null],
      institutionId: [null],
      classRoomId: [null],
      filterText: [null],
      selectAll: [true, [Validators.required]],
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

    const params = {
      date: new Date(),
      schid: this.form.value.classRoomId
    }

    this.presenceKBMService
      .findByPresenceDateAndSchedule(params)
      .subscribe((data) => {
        this.form.patchValue(data.body);
        const students = this.form.get('students') as FormArray;
        students.clear();
        students.clear();
        data.body.students.forEach((s: any) => {
          students.push(this.fb.group({
            ...s,
            selected: true,
          }));
        });
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
