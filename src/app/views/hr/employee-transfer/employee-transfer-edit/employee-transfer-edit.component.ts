import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ToastrService } from 'ngx-toastr';
import { BaseInputComponent } from 'src/app/components/base-input/base-input.component';
import { SubmitButtonComponent } from 'src/app/components/submit-button/submit-button.component';
import { ITab } from 'src/app/domain/model/tab.model';
import { EmployeeTransferService } from 'src/app/domain/service/employee-transfer.service';
import { EmployeeService } from 'src/app/domain/service/employee.service';
import { HRTransferTypeService } from 'src/app/domain/service/hr-transfer-type.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-transfer-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TabsModule,
    SubmitButtonComponent,
    BaseInputComponent,
  ],
  templateUrl: './employee-transfer-edit.component.html',
  styleUrl: './employee-transfer-edit.component.scss'
})
export class EmployeeTransferEditComponent implements OnInit {
  @Input() activeTab?: ITab;
  @Output() onRemove = new EventEmitter<any>();
  form: FormGroup;
  @Input() categories: any[] = [];
  @Input() organizations: any[] = [];
  @Input() jobPositions: any[] = [];
  @Input() jobLevels: any[] = [];
  @Input() sections: any[] = [];
  @Input() employeeStatus: any[] = [];
  isSubmitting = signal(false);

  employees: any[] = []
  transferTypes: any[] = []

  private service = inject(EmployeeTransferService);
  private employeeService = inject(EmployeeService);
  private transferTypeService = inject(HRTransferTypeService);
  private toastService = inject(ToastrService);

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      id: [null],
      employeeId: [null, [Validators.required]],
      effectiveDate: [new Date(), [Validators.required]],
      typeId: [null, [Validators.required]],
      statusId: [null, [Validators.required]],
      organizationId: [null, [Validators.required]],
      sectionId: [null, [Validators.required]],
      positionId: [null, [Validators.required]],
      managerId: [null],
      attachment: [null],
      description: [null],
    });
  }

  ngOnInit(): void {
    this.transferTypeService.findAll('').subscribe(res => {
      this.transferTypes = res.body
    })
    this.employeeService.findAll('').subscribe((res: any) => {
      this.employees = res.body
    })
    if (this.activeTab?.data != null) {
      setTimeout(()=> {
        this.form.patchValue(this.activeTab?.data);
        if(this.activeTab?.data.effectiveDate != null) {
          this.form.get("effectiveDate")?.setValue(new Date(this.activeTab?.data.effectiveDate))
        }
      }, 500)
    }
  }

  onKeyUpEmployee(e: string) {
    this.employeeService.findAll(e).subscribe((res) => {
      this.employees = res.body
    })
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

  onSubmit(){
    this.validateAllFormFields(this.form);
    for (let el in this.form.controls) {
      if (
        this.form.controls[el].errors ||
        this.form.controls[el].status === 'INVALID'
      ) {
        this.toastService.error(`${el} harus diisi!`)
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
    this.toastService.success(message);

    setTimeout(() => {
      this.onReset();
    }, 200);
  }

  onError(e: any) {
    this.toastService.warning(e.error.title);
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
            this.toastService.success('Hapus data sukses');
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
      employeeId: null,
      effectiveDate: new Date(),
      typeId: null,
      statusId: null,
      organizationId: null,
      sectionId: null,
      positionId: null,
      managerId: null,
      attachment: null,
      description: null,
    });

  }

}
