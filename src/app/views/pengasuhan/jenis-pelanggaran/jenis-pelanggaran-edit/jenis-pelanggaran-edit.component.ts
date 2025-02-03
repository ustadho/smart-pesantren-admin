import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubmitButtonComponent } from '../../../../components/submit-button/submit-button.component';
import { BaseInputComponent } from '../../../../components/base-input/base-input.component';
import Swal from 'sweetalert2';
import { ITab } from '../../../../domain/model/tab.model';
import { JenisPelanggaranService } from '../../../../domain/service/jenis-pelanggaran.service';
import { ToastrService } from 'ngx-toastr';
import Utils from '../../../../shared/util/util';

@Component({
  selector: 'app-jenis-pelanggaran-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SubmitButtonComponent,
    BaseInputComponent
  ],
  templateUrl: './jenis-pelanggaran-edit.component.html',
  styleUrl: './jenis-pelanggaran-edit.component.scss'
})
export class JenisPelanggaranEditComponent {
  @Input() activeTab?: ITab;
  @Input() categories: any[] = []
  @Output() onRemove = new EventEmitter<any>();
  form: FormGroup;

  isSubmitting = signal(false);

  constructor(
    private fb: FormBuilder,
    private service: JenisPelanggaranService,
    private toast: ToastrService
  ) {
    this.form = fb.group({
      id: [null],
      code: [null, [Validators.required]],
      name: [null, [Validators.required]],
      description: [null],
      active: [true, [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.activeTab?.data != null) {
      this.form.patchValue(this.activeTab.data);
    }

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
      let data = this.form.getRawValue()
      data.inTime = new Date(`1970-01-01 ${data.inTime}`)
      if (this.form.getRawValue().id == null) {
        this.service.create(data).subscribe({
          next: (res: any) => {
            this.onSuccess(false)
          },
          error: (e: any) => {
            this.onError(e)
          }
        });
      } else {
        this.service.update(data).subscribe({
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
