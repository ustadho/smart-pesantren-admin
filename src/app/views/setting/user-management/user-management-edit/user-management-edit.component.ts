import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BaseInputComponent } from '../../../../components/base-input/base-input.component';
import { SubmitButtonComponent } from '../../../../components/submit-button/submit-button.component';
import { UserService } from '../../../../core/user/user.service';
import { ITab } from '../../../../domain/model/tab.model';
import { PersonDataService } from '../../../../domain/service/person-data.service';
import Swal from 'sweetalert2';
import { InstitutionService } from '../../../../domain/service/institution.service';
import { USER_PROFILE } from '../../../../shared/constant/user-profile.constant';
import { AccountService } from 'src/app/core/auth/account.service';

@Component({
  selector: 'app-user-management-edit',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, BaseInputComponent, SubmitButtonComponent,
  ],
  templateUrl: './user-management-edit.component.html',
  styleUrl: './user-management-edit.component.scss'
})
export class UserManagementEditComponent {
  @Input() activeTab?: ITab;
  @Input() profiles: any[] = []
  @Output() onRemove = new EventEmitter<any>();
  form: FormGroup;
  isSubmitting = false;
  employees: any[] = []
  authorities: any[] = [];
  institutions: any[] = [];
  userProfile =  USER_PROFILE

  constructor(
    private fb: FormBuilder,
    private service: UserService,
    private personDataService: PersonDataService,
    private institutionService: InstitutionService,
    private accountService: AccountService,
    private toast: ToastrService
  ) {
    this.form = fb.group({
      id: [null],
      profile: [null, [Validators.required]],
      login: [null, [Validators.required]],
      personId: [null],
      firstName: [null, [Validators.required]],
      lastName: [null],
      email: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      phone: [{value: null, disabled: true}, [Validators.required]],
      imageUrl: [null],
      activated: [true, [Validators.required]],
      langKey: ['en', [Validators.required]],
      authorities: [[], [Validators.required]],
      institutions: [[]],
    });
  }

  ngOnInit(): void {
    if(this.activeTab?.data != null) {
      this.form.patchValue(this.activeTab.data)
      if(this.form.getRawValue().personId != null) {
        console.log('this.form.getRawValue().personId',this.form.getRawValue().personId)
        this.personDataService.findOne(this.form.getRawValue().personId).subscribe((res: any) => {
          this.employees = [res.body]
          this.form.patchValue({
            phone: res.body?.phone ?? ''
          })
        })
      }
    }
    this.service.authorities().subscribe((authorities) => {
      this.authorities = authorities;
    });
    this.institutionService.findAll('').subscribe((res) => {
      this.institutions = res.body;
    });

    this.form.get('profile')?.valueChanges.subscribe((e: any) => {
      if (e == USER_PROFILE.GUARDIAN) {
        this.form.patchValue({
          authorities: ["ROLE_WALISANTRI"]
        })
      }
    })
  }
  onParentKeyUp(e: any) {

  }

  onSelectChange() {
    console.group('onSelectChange');
  }

  onResetPassword() {
    Swal
      .fire({
        title: 'Hapus data',
        text: `Anda yakin untuk mereset passowd dari user ${this.form.getRawValue().login} ?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Batal',
        confirmButtonText: 'Ya Benar',
      })
      .then((result: any) => {
        if (result.value) {
          this.accountService.resetDefaultPassword(this.form.getRawValue().id)
          .subscribe((res: any) => {
            this.toast.success('Reset password sukses')
          })
        }
      });
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  onSubmit() {
    this.validateAllFormFields(this.form);
    for (let el in this.form.controls) {
      if (
        this.form.controls[el].errors ||
        this.form.controls[el].status === 'INVALID'
      ) {
        this.toast.error(`${el} harus diisi!`)
        console.log(el);
        return
      }
    }


    this.isSubmitting = true;
    if (this.form.getRawValue().id == null) {
      this.service.create(this.form.getRawValue()).subscribe((res: any) => {
        this.isSubmitting = false
        this.toast.success('Tambah data sukses')
        setTimeout(() => {
          this.onReset();
        }, 200);
      }, ((e: any) => {
        console.log(e)
        this.isSubmitting = false
        this.toast.error(e.error.detail)
      }));
    } else {
      this.service.update(this.form.getRawValue()).subscribe((res: any) => {
        this.isSubmitting = false
        this.toast.success('Update data sukses')
        this.onRemove.emit(this.activeTab)
        setTimeout(() => {
          this.onReset();
        }, 200);
      }, ((e: any) => {
        this.isSubmitting = false
        this.toast.error(e.error.detail)
      }));
    }
  }

  onDelete() {
    if(this.activeTab == null || this.activeTab.data == null) {
      return
    }

    Swal
      .fire({
        title: 'Hapus data',
        text: `Anda yakin untuk menghapus ' ${this.activeTab.data.login}'?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Batal',
        confirmButtonText: 'Ya Benar',
      })
      .then((result: any) => {
        if (result.value) {
          this.service.delete(this.activeTab?.data.login).subscribe((response: any) => {
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

  onPersonDataKeyup(e: any) {
    this.personDataService.findAll({
      type: this.form.getRawValue().profile == USER_PROFILE.EMPLOYEE? 'EMPLOYEE': 'GUARDIAN',
      q: e,
    }).subscribe((res: any) => {
      this.employees = res.body;
    });
  }

  onSelectPersonDataChange(e: any) {
    if(this.form != null && this.form.get('firstName')?.value == null) {
      this.form.get('firstName')?.setValue(e.name)
    }
    if(this.form != null && this.form.get('email')?.value == null) {
      this.form.get('email')?.setValue(e.email)
    }
    if(this.form != null && this.form.get('phone')?.value == null) {
      this.form.get('phone')?.setValue(e.phone)
    }
  }

  onReset() {
    // this.form.patchValue({
    //   id: null,
    //   code: null,
    //   name: null,
    //   parentId: null,
    //   description: null,
    // })
    this.form.reset();

    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.updateValueAndValidity();


  }
}
