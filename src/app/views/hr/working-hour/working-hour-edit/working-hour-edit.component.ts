import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BaseInputComponent } from 'src/app/components/base-input/base-input.component';
import { SubmitButtonComponent } from 'src/app/components/submit-button/submit-button.component';
import { ITab } from 'src/app/domain/model/tab.model';
import { WorkingHourService } from 'src/app/domain/service/working-hour.service';
import { DayService } from 'src/app/domain/service/day.service';
import Swal from 'sweetalert2';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { WorkingHourEditDialogComponent } from './working-hour-edit-dialog.component'

@Component({
  selector: 'app-working-hour-edit',
  standalone: true,
  providers: [BsModalService],
  imports: [
    CommonModule,
    BaseInputComponent,
    SubmitButtonComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './working-hour-edit.component.html',
  styleUrl: './working-hour-edit.component.scss'
})
export class WorkingHourEditComponent implements OnInit {
  @Input() activeTab?: ITab;
  @Output() onRemove = new EventEmitter<any>();
  form: FormGroup;
  days: any[] = []
  isSubmitting = signal(false);
  isMeridian = false;
  modalRef?: BsModalRef;

  constructor(
    private fb: FormBuilder,
    private service: WorkingHourService,
    private dayServie: DayService,
    private toast: ToastrService,
    private bsModalService: BsModalService,
  ) {
    this.form = fb.group({
      id: [null],
      code: [null, [Validators.required]],
      name: [null, [Validators.required]],
      color: [null, [Validators.required]],
      description: [null, [Validators.required]],
      details: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.dayServie.findAll().subscribe((res: any) => {
      this.days = res.body
    })

    if (this.activeTab?.data != null) {
      const d = this.activeTab.data
      this.form.patchValue(d);

      const details = this.form.get('details') as FormArray;
      details.clear();
      d.details.forEach((e: any) => {
        details.push(this.fb.group({
          id: e.id,
          dayId: e.dayId,
          dayName: e.dayName,
          workingTimeId: e.workingTimeId,
          workingTimeName: e.workingTimeName,
          checkInTime: new Date(`1970-01-01 ${e.checkInTime}`),
          checkOutTime: new Date(`1970-01-01 ${e.checkOutTime}`),
        }));
      });
    }
  }

  onAddWorkingTime() {
    const initialState: ModalOptions = {
      initialState: {
        data: null,
        name: this.form.getRawValue().name,
        title: 'Tambah Jam Absen',
      },
    };

    this.modalRef = this.bsModalService.show(
      WorkingHourEditDialogComponent,
      initialState
    );
    this.modalRef.setClass('modal-md');
    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.onClose.subscribe((data: any) => {
      const details = this.form.get('details') as FormArray;
      details.push(
        this.fb.group({
          ...data,
        })
      );
    });
  }

  onSubmit() {
    this.isSubmitting.set(true);
    let data = this.form.getRawValue()

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
    });
  }

  onEdit(index: number) {

  }

  get getFormDetailControls() {
    const control = this.form.get('details') as FormArray;
    return control;
  }

}
