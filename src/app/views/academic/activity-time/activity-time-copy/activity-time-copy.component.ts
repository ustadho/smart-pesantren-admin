import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubmitButtonComponent } from '../../../../components/submit-button/submit-button.component';
import { BaseInputComponent } from '../../../../components/base-input/base-input.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import Utils from '../../../../shared/util/util';
import { ToastrService } from 'ngx-toastr';
import { AcademicActivityTimeService } from '../../../../domain/service/academic-activity-time.service';
import { Subject } from 'rxjs';
import { SortService, sortStateSignal } from '../../../../shared/directive/sort';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import Swal from 'sweetalert2';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-activity-time-copy',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SubmitButtonComponent,
    BaseInputComponent,
    TabsModule,
    FontAwesomeModule,
  ],
  templateUrl: './activity-time-copy.component.html',
  styleUrl: './activity-time-copy.component.scss'
})
export class ActivityTimeCopyComponent {
  institutions: any[] = []
  isSubmitting = signal(false);
  param: any
  form: FormGroup
  isLoading = signal(false);
  fb = inject(FormBuilder)
  private toast= inject(ToastrService);
  private service = inject(AcademicActivityTimeService)
  sexs = [
    {id: "M", name: "Putra"},
    {id: "F", name: "Putri"},
  ]
  public data: any[] = [];
  private selectedInstitution: any = null
  public onClose: Subject<Object> = new Subject();
  private sortService = inject(SortService);
  private sortState = sortStateSignal({});
  public modalRef = inject(BsModalRef);

  constructor() {
    this.form = this.fb.group({
      institutionId: [this.param?.institutionId, [Validators.required]],
      sex: [this.param?.sex, [Validators.required]],
    })
  }

  ngOnInit(): void  {
    setTimeout(()=> {
      this.form.patchValue({
        institutionId: this.param?.institutionId,
        sex: this.param?.sex,
      })
      if(this.institutions.length > 0) {
        this.onSelectInstitution(this.institutions[0])
      }
    }, 300)
  }

  onSelectInstitution(e: any) {
    this.selectedInstitution = e
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
      Swal.fire({
        title: `Salin Jam Aktivitas`,
        text: `Anda yakin untuk menyalin jam dari [${this.selectedInstitution?.name} - ${(this.form.value?.sex == 'M'? 'Putra': 'Putri')}]?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Batal',
        confirmButtonText: 'Ya Benar',
      }).then((result) => {
        if (result.value) {
          this.isSubmitting.set(true);
          var vms: any[] = []
          for (let i = 0; i < this.data.length; i++) {
            const element = {...this.data[i]};
            element.id = null
            element.institutionId = this.param.institutionId
            element.sex = this.param.sex
            // element.startTime = new Date(`1970-01-01 ${element.startTime}`)
            // element.endTime = new Date(`1970-01-01 ${element.endTime}`)
            vms.push(element)
          }
          this.service.copy(vms).subscribe({
            next: (res: any) => {
              this.onSuccess(false)
            },
            error: (e: any) => {
              this.onError(e)
            }
          });
        }
      })
    }
  }

  onSuccess(isUpdate: boolean) {
    let message = 'Tambah data sukses'
    this.isSubmitting.set(false);
    this.toast.success(message);
    this.onClose.next('success');
    this.modalRef.hide()
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

  public loadAll() {
    this.data = []
    if(this.form.value.institutionId == null || this.form.value.sex == null) {
      return
    }
    this.service
      .query({
        page: 0,
        size: 100,
        sort: this.sortService.buildSortParam(this.sortState(), 'seq'),
        iid: this.form.value.institutionId,
        sex: this.form.value.sex,
      })
      .subscribe({
        next: (res: any) => {
          console.log('res', res)
          this.data = res.body.content;
          console.log('data', this.data)
        },
        error: () => {},
      });
  }

  trackIdentity(index: number, d: any) {
    return d.id;
  }
}
