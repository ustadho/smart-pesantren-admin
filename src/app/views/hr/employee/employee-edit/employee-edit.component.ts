import { CommonModule, formatDate } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BaseInputComponent } from '../../../../components/base-input/base-input.component';
import { SubmitButtonComponent } from '../../../../components/submit-button/submit-button.component';
import { ITab } from '../../../../domain/model/tab.model';
import { EmployeeService } from '../../../../domain/service/employee.service';
import { JobLevelService } from '../../../../domain/service/job-level.service';
import { JobPositionService } from '../../../../domain/service/job-position.service';
import { EmployeeStatusService } from '../../../../domain/service/employee-status.service';
import { OrganizationService } from '../../../../domain/service/organization.service';
import { SectionService } from '../../../../domain/service/section.service';
import { CityService } from '../../../../domain/service/city.service';
import Swal from 'sweetalert2';
import { EmployeeCategoryService } from '../../../../domain/service/employee-category.service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { EmployeeEditPersonalComponent } from './employee-edit-education.component';
import { EmployeeEditUnorComponent } from './employee-edit-unor.component';
import { EmployeeEditAddressComponent } from './employee-edit-personal.component';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TabsModule,
    SubmitButtonComponent,
    BaseInputComponent,
    EmployeeEditPersonalComponent,
    EmployeeEditUnorComponent,
    EmployeeEditAddressComponent,
  ],
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.scss',
})
export class EmployeeEditComponent implements OnInit {
  @Input() activeTab?: ITab;
  @Output() onRemove = new EventEmitter<any>();
  form: FormGroup;
  @Input() categories: any[] = [];
  @Input() organizations: any[] = [];
  @Input() jobPositions: any[] = [];
  @Input() jobLevels: any[] = [];
  @Input() sections: any[] = [];
  @Input() employeeStatus: any[] = [];
  @Input() cities: any[] = [];
  @Input() referalInstitutions: any[] = [];

  isSubmitting = signal(false);
  sexs = [
    { id: 'M', name: 'Laki-Laki' },
    { id: 'F', name: 'Perempuan' },
  ];

  private service = inject(EmployeeService);
  private jobLevelService = inject(JobLevelService);
  private toast = inject(ToastrService);

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      id: [null],
      managerId: [null, [Validators.required]],
      categoryId: [null, [Validators.required]],
      employeeNo: [null, [Validators.required]],
      name: [null, [Validators.required]],
      description: [null],
      sex: [null, [Validators.required]],
      active: [true, [Validators.required]],
      nik: [null],
      pobId: [null],
      phone: [null, [Validators.required]],
      email: [null, [Validators.required]],
      dob: [null, [Validators.required]],
      organizationId: [null, [Validators.required]],
      sectionId: [null, [Validators.required]],
      maritalStatusId: [null, [Validators.required]],
      jobPositionId: [null, [Validators.required]],
      educationLevelId: [null, [Validators.required]],
      permanentAddress: [null],
      permanentRT: [null],
      permanentRW: [null],
      permanentSubdistrictId: [null, [Validators.required]],
      permanentSubdistrictName: [null],
      residentialAddress: [null],
      residentialRT: [null],
      residentialRW: [null],
      residentialSubdistrictId: [null],
      residentialSubdistrictName: [null],
      programStudy: [null],
      faculty: [null],
      institutionId: [null],
      joinDate: [new Date(), [Validators.required]],
      statusId: [null, [Validators.required]],
      workingHourId: [null, [Validators.required]],
      formalEducations: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    if (this.activeTab?.data != null) {
      this.form.patchValue(this.activeTab.data);
    }


    if (this.activeTab?.data != null) {
      const data = this.activeTab.data;
      data.dob = new Date(data.dob);
      data.joinDate = new Date(data.joinDate);
      this.form.patchValue(data);

      const educations = this.form.get('formalEducations') as FormArray;
      educations.clear();
      data.formalEducations.forEach((e: any) => {
        educations.push(this.fb.group(e));
      });
    }
  }
  onParentKeyUp(e: any) {
    this.jobLevelService.findAll(e).subscribe((res: any) => {
      this.jobLevels = res.body;
    });
  }

  onSelectChange() {
    console.group('onSelectChange');
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  onSubmit() {
    this.validateAllFormFields(this.form);
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
            this.onSuccess(false);
          },
          error: (e: any) => {
            this.onError(e);
          },
        });
      } else {
        this.service.update(this.form.getRawValue()).subscribe({
          next: (res: any) => {
            this.onSuccess(true);
          },
          error: (e: any) => {
            this.onError(e);
          },
        });
      }
    } else {
      console.log('form tidak valid: ', this.form.valid)
      this.form.markAllAsTouched();
    }

  }

  onSuccess(isUpdate: boolean) {
    let message = 'Tambah data sukses';
    if (isUpdate) {
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
    this.form.patchValue({
      id: null,
      managerId: null,
      categoryId: null,
      employeeNo: null,
      name: null,
      description: null,
      sex: null,
      active: true,
      nik: null,
      pobId: null,
      phone: null,
      email: null,
      dob: null,
      organizationId: null,
      sectionId: null,
      maritalStatusId: null,
      jobPositionId: null,
      educationLevelId: null,
      permanentAddress: null,
      permanentRT: null,
      permanentRW: null,
      permanentSubdistrictId: null,
      permanentSubdistrictName: null,
      residentialAddress: null,
      residentialRT: null,
      residentialRW: null,
      residentialSubdistrictId: null,
      residentialSubdistrictName: null,
      programStudy: null,
      faculty: null,
      institutionId: null,
      joinDate: new Date(),
      statusId: null,
      workingHourId: null,
      formalEducations: []
    });

    const formalEducations = this.form.get('formalEducations') as FormArray;
    formalEducations.clear();
  }
}
