import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ITab } from '../../../../domain/model/tab.model';
import { BaseInputComponent } from '../../../../components/base-input/base-input.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrganizationService } from '../../../../domain/service/organization.service';
import { SubmitButtonComponent } from '../../../../components/submit-button/submit-button.component';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-organization-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BaseInputComponent,
    SubmitButtonComponent,
  ],
  templateUrl: './organization-edit.component.html',
  styleUrl: './organization-edit.component.scss',
})
export class OrganizationEditComponent implements OnInit {
  @Input() activeTab?: ITab;
  @Output() onRemove = new EventEmitter<any>();
  form: FormGroup;

  organizations: any[] = [];
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private service: OrganizationService,
    private toast: ToastrService
  ) {
    this.form = fb.group({
      id: [null],
      code: [null, [Validators.required]],
      name: [null, [Validators.required]],
      parentId: [null],
      description: [null],
    });
  }

  ngOnInit(): void {
    if(this.activeTab?.data != null) {
      this.form.patchValue(this.activeTab.data)
    }
    this.service.findAll('').subscribe((res: any) => {
      this.organizations = res.body
    })
  }
  onParentKeyUp(e: any) {
    this.service.findAll(e).subscribe((res: any) => {
      this.organizations = res.body;
    });
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
