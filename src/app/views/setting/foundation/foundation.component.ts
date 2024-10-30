import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BaseInputComponent } from 'src/app/components/base-input/base-input.component';
import { SubmitButtonComponent } from 'src/app/components/submit-button/submit-button.component';
import { FoundationService } from 'src/app/domain/service/foundation.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-foundation',
  standalone: true,
  imports: [ReactiveFormsModule, BaseInputComponent, SubmitButtonComponent],
  templateUrl: './foundation.component.html',
  styleUrl: './foundation.component.scss',
  providers: [HttpClient],
})
export class FoundationComponent implements OnInit {
  form: FormGroup;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private service: FoundationService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      address1: ['', [Validators.required]],
      address2: ['', [Validators.required]],
      address3: ['', [Validators.required]],
      phone: [''],
      country: [''],
      startDate: [''],
    });
  }

  ngOnInit(): void {
    this.service.getMyFoundation().subscribe((res: any) => {
      this.form.patchValue(res);
    });
  }

  onSubmit() {
    if (this.form.valid && !this.isSubmitting) {
      // Cek validasi dan proses submit
      this.isSubmitting = true; // Disable tombol selama proses submit
      console.log(this.form.value);

      this.service.update(this.form.getRawValue()).subscribe(() => {
        this.isSubmitting = false;
        this.toastr.success('Update data sukses');
      });
    }
  }
}
