import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseInputComponent } from '../../../../components/base-input/base-input.component';
import { SubmitButtonComponent } from '../../../../components/submit-button/submit-button.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { ITab } from '../../../../domain/model/tab.model';
import { AcademicYearService } from '../../../../domain/service/academic-year.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import Utils from '../../../../shared/util/util';

@Component({
  selector: 'app-academic-year-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BaseInputComponent, SubmitButtonComponent, ColorPickerModule],
  templateUrl: './academic-year-edit.component.html',
  styleUrl: './academic-year-edit.component.scss'
})
export class AcademicYearEditComponent {
  @Input() activeTab?: ITab;
  @Input() curriculums: any[] = [];
  @Output() onRemove = new EventEmitter<any>();
  form: FormGroup;
  isSubmitting = signal(false);

  constructor(
    private fb: FormBuilder,
    private service: AcademicYearService,
    private toast: ToastrService
  ) {
    this.form = fb.group({
      id: [null],
      code: [null, [Validators.required]],
      name: [null, [Validators.required]],
      description: [null],
      startDate: [new Date(), [Validators.required]],
      endDate: [new Date(), [Validators.required]],
      isDefault: [true, [Validators.required]],
      curriculumId: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    if(this.activeTab?.data != null) {
      console.log('this.activeTab?.data', this.activeTab?.data)
      this.form.patchValue(this.activeTab.data)
      this.form.get('startDate')?.setValue(new Date(this.activeTab.data.startDate))
      this.form.get('endDate')?.setValue(new Date(this.activeTab.data.endDate))
    }
  }
  onParentKeyUp(e: any) {

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
    if(this.activeTab == null || this.activeTab.data == null) {
      return
    }

    Swal
      .fire({
        title: 'Hapus data',
        text: `Anda yakin untuk menghapus ' ${this.activeTab.data.name}'?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Batal',
        confirmButtonText: 'Ya Benar',
      })
      .then((result) => {
        if (result.value) {
          this.service.delete(this.activeTab?.data.id).subscribe(response => {
            if(this.form.getRawValue().id != null) {
              this.toast.success('Hapus data sukses')
              this.onRemove.emit(this.activeTab)
            } else{
              this.onReset()
            }
          });
        }
      });
  }

  onReset() {
    this.form.reset();

    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.updateValueAndValidity();
    this.form.get('isDefault')?.setValue(true);

  }
}
