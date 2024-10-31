import { CommonModule, formatDate } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BaseInputComponent } from '../../../../components/base-input/base-input.component'
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
import { WorkingHourService } from 'src/app/domain/service/working-hour.service';

@Component({
  selector: 'app-employee-edit-unor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BaseInputComponent,
  ],
  templateUrl: './employee-edit-unor.component.html',
})
export class EmployeeEditUnorComponent implements OnInit {
  @Input() activeTab?: ITab;
  @Input() form!: FormGroup;
  @Output() onRemove = new EventEmitter<any>();

  categories: any[] = [];
  organizations: any[] = [];
  jobPositions: any[] = [];
  jobLevels: any[] = [];
  sections: any[] = [];
  employeeStatus: any[] = [];
  employees: any[] = [];
  cities: any[] = [];
  workingHours: any[] = [];
  isSubmitting = signal(false);
  sexs = [
    {id: "M", name: "Laki-Laki"},
    {id: "F", name: "Perempuan"}
  ]

  private service = inject(EmployeeService);
  private organizationService = inject(OrganizationService);
  private employeeCategoryService = inject(EmployeeCategoryService);
  private jobLevelService = inject(JobLevelService);
  private cityService = inject(CityService);
  private jobPositionService = inject(JobPositionService);
  private sectionService = inject(SectionService);
  private employeeStatusService = inject(EmployeeStatusService);
  private employeeService = inject(EmployeeService);
  private workingHourService = inject(WorkingHourService);
  private toast = inject(ToastrService);


  constructor(
    private fb : FormBuilder
  ) {
    this.form = fb.group({
      id: [null],
      categoryId: [null, [Validators.required]],
      employeeNo: [null, [Validators.required]],
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      sex: [null, [Validators.required]],
      active: [true, [Validators.required]],
      nik: [null],
      pob: [null],
      dob: [formatDate(new Date(), 'yyyy-MM-dd','en-US') , [Validators.required]],
      organizationId: [null, [Validators.required]],
      sectionId: [null, [Validators.required]],
      jobPositionId: [null, [Validators.required]],
      educationLevelId: [null, [Validators.required]],
      permanentAddress: [null],
      permanentRT: [null],
      permanentRW: [null],
      permanentSubdistrictId: [null, [Validators.required]],
      residentialAddress: [null],
      residentialRT: [null],
      residentialRW: [null],
      residentialSubdistrictId: [null],
      programStudy: [null],
      faculty: [null],
      institutionId: [null],
    });
  }

  ngOnInit(): void {
    if (this.activeTab?.data != null) {
      this.form.patchValue(this.activeTab.data);
    }
    this.organizationService.findAll('').subscribe((res: any) => {
      this.organizations = res.body
    })
    this.sectionService.findAll('').subscribe((res: any) => {
      this.sections = res.body
    })
    this.jobPositionService.findAll('').subscribe((res: any) => {
      this.jobPositions = res.body
    })
    this.jobLevelService.findAll('').subscribe((res: any) => {
      this.jobLevels = res.body;
    });
    this.employeeStatusService.findAll('').subscribe((res: any) => {
      this.employeeStatus = res.body;
    });
    this.cityService.findAll('').subscribe((res: any) => {
      this.cities = res.body;
    });
    this.employeeCategoryService.findAll('').subscribe((res: any) => {
      this.categories = res.body;
    });
    this.employeeService.findAll('').subscribe((res: any) => {
      this.employees = res.body;
    });
    this.workingHourService.findAll('').subscribe((res: any) => {
      this.workingHours = res.body;
    })
  }
  onParentKeyUp(e: any) {
    this.jobLevelService.findAll(e).subscribe((res: any) => {
      this.jobLevels = res.body;
    });
  }

  onManagerKeyup(e: any) {
    this.employeeService.findAll(e).subscribe((res: any) => {
      this.employees = res.body;
    });
  }

  onSelectChange() {
    console.group('onSelectChange');
  }


  onSubmit() {
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
    this.form.patchValue({
      id: null,
      code: null,
      name: null,
      jobPositionId: null,
      description: null,
    });
  }
}

