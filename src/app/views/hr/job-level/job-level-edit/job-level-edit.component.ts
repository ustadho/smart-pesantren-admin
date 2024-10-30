import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { JobLevelService } from '../../../../domain/service/job-level.service';
import { ToastrService } from 'ngx-toastr';
import { ITab } from '../../../../domain/model/tab.model';
import { SubmitButtonComponent } from '../../../../components/submit-button/submit-button.component';
import { CommonModule } from '@angular/common';
import { BaseInputComponent } from '../../../../components/base-input/base-input.component';
import { ColorPickerModule } from 'ngx-color-picker';

@Component({
  selector: 'app-job-level-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BaseInputComponent, SubmitButtonComponent, ColorPickerModule],
  templateUrl: './job-level-edit.component.html',
  styleUrl: './job-level-edit.component.scss'
})
export class JobLevelEditComponent {
  @Input() activeTab?: ITab;
  @Output() onRemove = new EventEmitter<any>();
  form: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private service: JobLevelService,
    private toast: ToastrService
  ) {
    this.form = fb.group({
      id: [null],
      code: [null, [Validators.required]],
      name: [null, [Validators.required]],
      level: [1,  [Validators.required]],
      description: [null],
      color: [null]
    });
  }

  ngOnInit(): void {
    if(this.activeTab?.data != null) {
      this.form.patchValue(this.activeTab.data)
    }
  }
  onParentKeyUp(e: any) {

  }

  onSelectChange() {
    console.group('onSelectChange');
  }

  onSubmit() {
    this.isSubmitting = true;
    if (this.form.getRawValue().id == null) {
      this.service.create(this.form.getRawValue()).subscribe((res: any) => {
        this.isSubmitting = false
        this.toast.success('Tambah data sukses')
        setTimeout(() => {
          this.onReset();
        }, 200);
      });
    } else {
      this.service.update(this.form.getRawValue()).subscribe((res: any) => {
        this.isSubmitting = false
        this.toast.success('Update data sukses')
        this.onRemove.emit(this.activeTab)
        setTimeout(() => {
          this.onReset();
        }, 200);
      });
    }
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
    this.form.patchValue({
      id: null,
      code: null,
      name: null,
      parentId: null,
      description: null,
    })
  }
}
