import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BaseInputComponent } from '../../../components/base-input/base-input.component';
import { SubmitButtonComponent } from '../../../components/submit-button/submit-button.component';
import { InstitutionService } from '../../../domain/service/institution.service';
import { SettingPenilaianService } from '../../../domain/service/setting-penilaian.service';

@Component({
  selector: 'app-setting-penilaian',
  standalone: true,
  imports: [ReactiveFormsModule, BaseInputComponent, SubmitButtonComponent],
  templateUrl: './setting-penilaian.component.html',
  styleUrls: ['./setting-penilaian.component.scss']
})
export class SettingPenilaianComponent {
  form: FormGroup;
  isSubmitting: boolean = false;
  institutions: any[] = [];

  institutionService = inject(InstitutionService)
  settingService = inject(SettingPenilaianService)
  toastr = inject(ToastrService)
  fb = inject(FormBuilder)

  constructor() {
    this.form = this.fb.group({
      id: [null],
      institutionId: [null, [Validators.required]],
      persenHarian: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      persenKetrampilan: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      persenSikap: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      persenPts: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      persenPas: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    });
  }

  loadSetting(event: any) {
    if(event.id){
      this.settingService.getSettingPenilaian(event.id).subscribe((res: any) => {
        if(res){
          this.form.patchValue(res);
        } else {
          this.form.patchValue({
            persenHarian: 0,
            persenKetrampilan: 0,
            persenSikap: 0,
            persenPts: 0,
            persenPas: 0,
          });
        }
      })
    }
  }

  ngOnInit(): void {
    this.institutionService.findAll('').subscribe((res: any) => {
      this.institutions = res.body;
    })
  }

  onSubmit() {
    if (this.form.valid && !this.isSubmitting) {
      const total = +this.form.get('persenHarian')?.value + 
        +this.form.get('persenKetrampilan')?.value + 
        +this.form.get('persenSikap')?.value + 
        +this.form.get('persenPts')?.value + 
        +this.form.get('persenPas')?.value;
      console.log('total', total)
      if(total !== 100){
        this.toastr.error('Total persen harus 100');
        return;
      }

      this.isSubmitting = true;
      
      this.settingService.update(this.form.getRawValue()).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.toastr.success('Update data sukses');
        },
        error: (error) => {
          this.isSubmitting = false;
          this.toastr.error(error.error?.message || 'Terjadi kesalahan saat update data');
        }
      });
    }
  }

}
