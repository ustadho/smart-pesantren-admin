import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubmitButtonComponent } from '../../../../components/submit-button/submit-button.component';
import { BaseInputComponent } from '../../../../components/base-input/base-input.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ITab } from '../../../../domain/model/tab.model';
import Utils from '../../../../shared/util/util';
import { ToastrService } from 'ngx-toastr';
import { AcademicActivityTimeService } from '../../../../domain/service/academic-activity-time.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-activity-time-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SubmitButtonComponent,
    BaseInputComponent,
    TabsModule,
  ],
  templateUrl: './activity-time-edit.component.html',
  styleUrl: './activity-time-edit.component.scss'
})
export class ActivityTimeEditComponent {
  @Input() activeTab?: ITab;
  @Input() institutions: any[] = []
  @Output() onRemove = new EventEmitter<any>();
  isSubmitting = signal(false);
  form: FormGroup
  fb = inject(FormBuilder)
  private toast= inject(ToastrService);
  private service = inject(AcademicActivityTimeService)
  sexs = [
    {id: "M", name: "Putra"},
    {id: "F", name: "Putri"},
  ]

  constructor() {
    this.form = this.fb.group({
      id: [null],
      institutionId: [null, [Validators.required]],
      sex: [null, [Validators.required]],
      seq: [1, [Validators.required]],
      startTime: ['07:00', [Validators.required]],
      endTime: ['16:00', [Validators.required]],
      description: [null]
    })
  }

  ngOnInit(): void {
    if (this.activeTab?.data != null) {
      this.form.patchValue(this.activeTab.data);
    }
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
      data.startTime = new Date(`1970-01-01 ${data.startTime}`)
      data.endTime = new Date(`1970-01-01 ${data.endTime}`)

      if (data.id == null) {
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

  onDelete() {
    if (this.activeTab == null || this.activeTab.data == null) {
      return;
    }

    Swal.fire({
      title: 'Hapus data',
      text: `Anda yakin untuk menghapus Jam ke-' ${this.activeTab.data.seq}'?`,
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

  onReset() {
    const previousValue = this.form.getRawValue();
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.updateValueAndValidity();
    this.form.patchValue({
      institutionId: previousValue.institutionId,
      seq: ++previousValue.seq,
      startTime: previousValue.startTime,
      endTime: previousValue.endTime,
    })
  }
}
