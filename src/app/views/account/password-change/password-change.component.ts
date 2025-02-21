import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordChangeService } from './password-change.service'
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-password-change',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './password-change.component.html',
  styleUrl: './password-change.component.scss'
})
export class PasswordChangeComponent {
  private fb = inject(FormBuilder)
  private passwordService = inject(PasswordChangeService)
  private toastrService= inject(ToastrService);
  private router = inject(Router);
  bsModalRef = inject(BsModalRef)
  passwordForm: FormGroup;

  public onClose: Subject<Object> = new Subject();

  constructor() {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.matchPasswords
    });
  }

  updatePassword() {
    if (this.passwordForm.valid) {
      this.passwordService
        .save(this.passwordForm.get('newPassword')?.value, this.passwordForm.get(['currentPassword'])!.value)
        .subscribe((res: any) => {
          this.toastrService.success('Ubah password sukses!')
          this.onClose.next('success');
        }, (e: any) => {
          console.log(e)
          if(e.error.title == 'Incorrect password') {
            this.toastrService.warning('Password lama tidak valid!')
          }
        })
        ;
      this.passwordForm.reset();
    }
  }

  matchPasswords(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { notMatching: true };
  }
}
