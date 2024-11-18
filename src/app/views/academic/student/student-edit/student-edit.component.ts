import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ITab } from '../../../../domain/model/tab.model';
import { StudentService } from '../../../../domain/service/student.service';
import { ToastrService } from 'ngx-toastr';
import Utils from '../../../../shared/util/util';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { SubmitButtonComponent } from '../../../../components/submit-button/submit-button.component';
import { BaseInputComponent } from '../../../../components/base-input/base-input.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { StudentEditAddressComponent } from './student-edit-address.component';
import { StudentEditNotesComponent } from './student-edit-notes.component';

@Component({
  selector: 'app-student-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SubmitButtonComponent,
    BaseInputComponent,
    TabsModule,
    StudentEditAddressComponent,
    StudentEditNotesComponent,
  ],
  templateUrl: './student-edit.component.html',
  styleUrl: './student-edit.component.scss'
})
export class StudentEditComponent {
  @Input() activeTab?: ITab;
  @Input() academicYears: any[] = []
  @Input() categories: any[] = []
  @Input() cities: any[] = []
  @Input() religions: any[] = []
  @Input() countries: any[] = []
  @Input() institutions: any[] = []

  @Output() onRemove = new EventEmitter<any>();
  form: FormGroup;
  sexs = [
    { id: 'M', name: 'Laki-Laki' },
    { id: 'F', name: 'Perempuan' },
  ];
  isSubmitting = signal(false);

  constructor(
    private fb: FormBuilder,
    private service: StudentService,
    private toast: ToastrService
  ) {
    const today = new Date();
    this.form = fb.group({
      id: [null],
      institutionId: [null, [Validators.required]],
      joinYearId: [null, [Validators.required]],
      categoryId: [null, [Validators.required]],
      nis: [null, [Validators.required]],
      nisn: [null],
      nik: [null],
      name: [null, [Validators.required]],
      email: [null],
      sex: [null, [Validators.required]],
      pobId: [null, [Validators.required]],
      dob: [today.setFullYear(today.getFullYear() - 12), [Validators.required]],
      birthCertificateNo: [null],
      bloodType: [null],
      childNo: [1],
      numberOfSibling: [1],
      religionId: [null, [Validators.required]],
      nationalityId: [null, [Validators.required]],
      address1: [null, [Validators.required]],
      address2: [null],
      address3: [null],
      rt: [null],
      rw: [null],
      subDistrictId: [null, [Validators.required]],
      postalCode: [null],
      kksNo: [null],
      yatim: [false],
      height: [0],
      weight: [0],
      originSchoolId: [null],
      examParticipantNo: [null],
      certificateNo: [null],
      skhunNo: [null],
      fatherId: [null],
      motherId: [null],
      fatherGuardianId: [null],
      motherGuardianId: [null],
      status: [null],
      photo: [null],
      active: [true, [Validators.required]],
      notes: [null]
    });
  }

  ngOnInit(): void {
    if (this.activeTab?.data != null) {
      this.form.patchValue(this.activeTab.data);
    }
    this.categories.map((item: any) => {
      if(item.default == true) {
        this.form.get('categoryId')?.setValue(item.id)
      }
    })
  }

  onSelectChange() {
    console.group('onSelectChange');
  }


  onSubmit() {
    Utils.validateAllFormFields(this.form);
    for (let el in this.form.controls) {
      if (
        this.form.controls[el].errors ||
        this.form.controls[el].status === 'INVALID'
      ) {
        this.toast.error(`${el} harus diisi!`)
        console.log(el);
      }
    }

    if (this.form.valid) {
      this.isSubmitting.set(true);
      if (this.form.getRawValue().id == null) {
        this.service.create(this.form.getRawValue()).subscribe({
          next: (res: any) => {
            this.onSuccess(false)
          },
          error: (e: any) => {
            this.onError(e)
          }
        });
      } else {
        this.service.update(this.form.getRawValue()).subscribe({
          next: (res: any) => {
            this.onSuccess(true)
          },
          error: (e: any) => {
            this.onError(e)
          }
        });
      }
    }
  }

  onSuccess(isUpdate: boolean) {
    let message = 'Tambah data sukses'
    if(isUpdate) {
      message = 'Update data sukses';
      this.onRemove.emit(this.activeTab);
    }
    this.isSubmitting.set(false);
    this.toast.success(message);

    setTimeout(() => {
      this.onReset();
    }, 200);
  }

  onError(e: any) {
    this.toast.warning(e.error.title);
    this.isSubmitting.set(false);
  }

  onDelete() {
    if (this.activeTab == null || this.activeTab.data == null) {
      return;
    }

    Swal.fire({
      title: 'Hapus data',
      text: `Anda yakin untuk menghapus ' ${this.activeTab.data.name}'?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Batal',
      confirmButtonText: 'Ya Benar',
    }).then((result) => {
      if (result.value) {
        this.service.delete(this.activeTab?.data.id).subscribe((response) => {
          if (this.form.getRawValue().id != null) {
            this.toast.success('Hapus data sukses');
            this.onRemove.emit(this.activeTab);
          } else {
            this.onReset();
          }
        });
      }
    });
  }

  onReset() {
    this.form.reset();
    this.form.get('active')?.setValue(true)
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.updateValueAndValidity();
  }
}
