import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SectionService } from '../../../../domain/service/section.service';
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
import { ReferalInstitutionService } from '../../../../domain/service/referal-institution.service';
import { CityService } from '../../../../domain/service/city.service';

@Component({
  selector: 'app-referal-institution-edit',
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
  templateUrl: './referal-institution-edit.component.html',
})
export class ReferalInstitutionEditComponent implements OnInit {
  @Input() activeTab?: ITab;
  @Output() onRemove = new EventEmitter<any>();
  form: FormGroup;
  cities: any[] = [];
  isSubmitting = signal(false);
  isMeridian = false;

  constructor(
    private fb: FormBuilder,
    private service: ReferalInstitutionService,
    private cityService: CityService,
    private toast: ToastrService
  ) {
    const tStart = new Date('1970-01-01 07:00:00')
    const tEnd = new Date('1970-01-01 16:00:00')
    this.form = fb.group({
      id: [null],
      code: [null, [Validators.required]],
      name: [null, [Validators.required]],
      cityId: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.activeTab?.data != null) {
      const d = this.activeTab.data
      this.form.patchValue({
        id: d.id,
        code: d.code,
        name: d.name,
        cityId: d.city?.id,
        description: d.description,
      });
    }
    this.cityService.findAll('').subscribe((res: any) => {
      this.cities = res.body;
    });
  }

  onSubmit() {
    this.isSubmitting.set(true);
    const data = {
      ...this.form.getRawValue(),
      city: {
        id: this.form.getRawValue().cityId
      }
    }
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
    const tStart = new Date('1970-01-01 07:00:00')
    const tEnd = new Date('1970-01-01 16:00:00')
    this.form.patchValue({
      id: null,
      code: null,
      name: null,
      description: null,
    });
  }
}
