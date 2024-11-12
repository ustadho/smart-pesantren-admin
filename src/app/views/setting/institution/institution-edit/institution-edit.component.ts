import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITab } from '../../../../domain/model/tab.model';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InstitutionService } from '../../../../domain/service/institution.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { BaseInputComponent } from '../../../../components/base-input/base-input.component';
import { SubmitButtonComponent } from '../../../../components/submit-button/submit-button.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { EducationLevelService } from '../../../../domain/service/education-level.service';

@Component({
  selector: 'app-institution-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BaseInputComponent,
    SubmitButtonComponent,
    ColorPickerModule,
  ],
  templateUrl: './institution-edit.component.html',
  styleUrl: './institution-edit.component.scss',
})
export class InstitutionEditComponent {
  @Input() activeTab?: ITab;
  @Output() onRemove = new EventEmitter<any>();
  form: FormGroup;
  isSubmitting = false;
  educationLevels: any[] = [];

  constructor(
    private fb: FormBuilder,
    private service: InstitutionService,
    private levelService: EducationLevelService,
    private toast: ToastrService
  ) {
    this.form = fb.group({
      id: [null],
      code: [null, [Validators.required]],
      name: [null, [Validators.required]],
      description: [null],
      levelId: [null, [Validators.required]],
      active: [true, [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.activeTab?.data != null) {
      this.form.patchValue(this.activeTab.data);
    }
    this.levelService.findAll('').subscribe((res: any) => {
      this.educationLevels = res.body;
    })
  }
  onParentKeyUp(e: any) {}

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
        this.toast.error(`${el} harus diisi!`);
        console.log(el);
      }
    }

    this.isSubmitting = true;
    if (this.form.getRawValue().id == null) {
      this.service.create(this.form.getRawValue()).subscribe(
        (res: any) => {
          this.isSubmitting = false;
          this.toast.success('Tambah data sukses');
          setTimeout(() => {
            this.onReset();
          }, 200);
        },
        (e: any) => {
          console.log(e);
          this.isSubmitting = false;
          this.toast.error(e.error.detail);
        }
      );
    } else {
      this.service.update(this.form.getRawValue()).subscribe(
        (res: any) => {
          this.isSubmitting = false;
          this.toast.success('Update data sukses');
          this.onRemove.emit(this.activeTab);
          setTimeout(() => {
            this.onReset();
          }, 200);
        },
        (e: any) => {
          this.isSubmitting = false;
          this.toast.error(e.error.detail);
        }
      );
    }
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
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.updateValueAndValidity();
  }
}
