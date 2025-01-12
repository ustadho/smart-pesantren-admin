import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { WorkingTimeService } from '../../../../domain/service/working-time.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { SortByDirective, SortDirective } from '../../../../shared/directive/sort';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ITab } from '../../../../domain/model/tab.model';
import Swal from 'sweetalert2';
import { SubmitButtonComponent } from '../../../../components/submit-button/submit-button.component';
import { BaseInputComponent } from '../../../../components/base-input/base-input.component'

@Component({
  selector: 'app-working-time-edit',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    PaginationModule,
    TimepickerModule,
    BaseInputComponent,
    SortDirective,
    SortByDirective,
    FontAwesomeModule,
    SubmitButtonComponent,
  ],
  templateUrl: './working-time-edit.component.html',
  styleUrl: './working-time-edit.component.scss'
})
export class WorkingTimeEditComponent implements OnInit {
  @Input() activeTab?: ITab;
  @Output() onRemove = new EventEmitter<any>();
  form: FormGroup;
  tStart = '07:00:00';
  tEnd = '16:00:00';

  isSubmitting = signal(false);
  isMeridian = false;

  constructor(
    private fb: FormBuilder,
    private service: WorkingTimeService,
    private toast: ToastrService
  ) {
    this.form = fb.group({
      id: [null],
      code: [null, [Validators.required]],
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      checkInTime: [this.tStart, [Validators.required]],
      checkOutTime: [this.tEnd, [Validators.required]],
      lateTolerance: [10, [Validators.required]],
      earlyLeaveTolerance: [10, [Validators.required]],
      scanStartCheckInTime: [this.tStart, [Validators.required]],
      scanEndCheckInTime: [this.tStart, [Validators.required]],
      scanStartCheckOutTime: [this.tEnd, [Validators.required]],
      scanEndCheckOutTime: [this.tEnd, [Validators.required]],
      color: ['']
    });
  }

  ngOnInit(): void {
    if (this.activeTab?.data != null) {
      const d = this.activeTab.data
      this.form.patchValue({
        id: d.id,
        code: d.code,
        name: d.name,
        description: d.description,
        checkInTime: d.checkInTime,
        checkOutTime: d.checkOutTime,
        lateTolerance: d.lateTolerance,
        earlyLeaveTolerance: d.earlyLeaveTolerance,
        scanStartCheckInTime: d.scanStartCheckInTime,
        scanEndCheckInTime: d.scanEndCheckInTime,
        scanStartCheckOutTime: d.scanStartCheckOutTime,
        scanEndCheckOutTime: d.scanEndCheckOutTime,
        color: d.color,
      });
    }
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
      description: null,
      checkInTime: this.tStart,
      checkOutTime: this.tEnd,
      lateTolerance: 10,
      earlyLeaveTolerance: 10,
      scanStartCheckInTime: this.tStart,
      scanEndCheckInTime: this.tStart,
      scanStartCheckOutTime: this.tEnd,
      scanEndCheckOutTime: this.tEnd,
      color: null,
    });
  }
}
