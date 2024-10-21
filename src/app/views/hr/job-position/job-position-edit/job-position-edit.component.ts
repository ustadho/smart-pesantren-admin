import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { JobPositionService } from '../../../../domain/service/job-position.service';
import { ITab } from '../../../../domain/model/tab.model';
import { SubmitButtonComponent } from 'src/app/components/submit-button/submit-button.component';
import { BaseInputComponent } from 'src/app/components/base-input/base-input.component';
import { CommonModule } from '@angular/common';
import { JobLevelService } from 'src/app/domain/service/job-level.service';

@Component({
  selector: 'app-job-position-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SubmitButtonComponent,
    BaseInputComponent,
  ],
  templateUrl: './job-position-edit.component.html',
  styleUrl: './job-position-edit.component.scss',
})
export class JobPositionEditComponent implements OnInit {
  @Input() activeTab?: ITab;
  @Output() onRemove = new EventEmitter<any>();
  form: FormGroup;

  jobLevels: any[] = [];
  isSubmitting = signal(false);

  constructor(
    private fb: FormBuilder,
    private service: JobPositionService,
    private jobLevelService: JobLevelService,
    private toast: ToastrService
  ) {
    this.form = fb.group({
      id: [null],
      code: [null, [Validators.required]],
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      jobLevelId: [null, [Validators.required]],
      active: [true, [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.activeTab?.data != null) {
      this.form.patchValue(this.activeTab.data);
    }
    this.jobLevelService.findAll('').subscribe((res: any) => {
      this.jobLevels = res.body;
    });
  }
  onParentKeyUp(e: any) {
    this.jobLevelService.findAll(e).subscribe((res: any) => {
      this.jobLevels = res.body;
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
