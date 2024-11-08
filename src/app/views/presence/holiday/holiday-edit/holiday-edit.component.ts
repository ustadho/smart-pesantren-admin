import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ITab } from '../../../../domain/model/tab.model';
import { HRHolidayService } from '../../../../domain/service/hr-holiday';
import { HolidayService } from '../../../../domain/service/holiday';
import { BaseInputComponent } from '../../../../components/base-input/base-input.component';
import { SubmitButtonComponent } from '../../../../components/submit-button/submit-button.component';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-holiday-edit',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BaseInputComponent,
    SubmitButtonComponent,
  ],
  templateUrl: './holiday-edit.component.html',
  styleUrl: './holiday-edit.component.scss',
  providers: [
    DatePipe
  ]
})
export class HolidayEditComponent implements OnInit {
  @Input() activeTab?: ITab;
  @Output() onRemove = new EventEmitter<any>();
  form: FormGroup;
  days: any[] = []
  isSubmitting = signal(false);
  listHolidays: any[] = []
  public localValue1: Date | null = null;
  public showPicker1 = false;

  constructor(
    private fb: FormBuilder,
    private service: HRHolidayService,
    private holidayService: HolidayService,
    private toastService: ToastrService,
    private datePipe: DatePipe,
    ) {
    this.form = this.fb.group({
      id: [null],
      holidayId: [null, [Validators.required]],
      eventDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), [Validators.required]],
      description: [null],
    })

    this.holidayService.findAll('').subscribe(res => {
      this.listHolidays = res.body
    })
  }

  ngOnInit(): void {
    if (this.activeTab?.data != null) {
      this.form.patchValue({
        id: this.activeTab.data.id,
        holidayId: this.activeTab.data.holidayId,
        eventDate: this.datePipe.transform(this.activeTab.data.eventDate, 'yyyy-MM-dd'),
        description: this.activeTab.data.description,
      });
      // this.form.patchValue({
      //   eventDate: new Date(this.activeTab.data.eventDate)
      // })

    }
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
      code: null,
      name: null,
      description: null,
    });
  }
}
