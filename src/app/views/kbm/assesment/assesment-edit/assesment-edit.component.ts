import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseInputComponent } from '../../../../components/base-input/base-input.component';
import { KBMAssesmentService } from '../../../../domain/service/kbm-assesment.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-assesment-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BaseInputComponent,
  ],
  templateUrl: './assesment-edit.component.html',
  styleUrls: ['./assesment-edit.component.scss']
})
export class AssesmentEditComponent implements OnInit {
  data: any;
  form!: FormGroup;
  fb: FormBuilder = inject(FormBuilder);
  assesmentService = inject(KBMAssesmentService);
  public modalRef = inject(BsModalRef);
  public onClose: Subject<any> = new Subject<any>();
  settingPenilaian: any;

  constructor() {}  

  ngOnInit() {
    this.form = this.fb.group({
      id:  [null],
      academicYearId: [null],
      academicYearName: [null], 
      classRoomId: [null],
      classRoomName: [null],
      semester: [null],
      studentId: [null],
      studentNis: [null],
      studentName: [null],
      subjectId: [null],
      subjectName: [null],
      nilaiHarian: [0, { validators: [Validators.min(0), Validators.max(100)] }],
      nilaiKetrampilan: [0, { validators: [Validators.min(0), Validators.max(100)] }],
      nilaiSikap: [0, { validators: [Validators.min(0), Validators.max(100)] }],
      nilaiPts: [0, { validators: [Validators.min(0), Validators.max(100)] }],
      nilaiPas: [0, { validators: [Validators.min(0), Validators.max(100)] }],
      nilaiAkhir: [0, { disabled: true }],
    });
    
    if(this.data != null){
      this.form.patchValue(this.data);
      this.calculateFinalGrade();
    }
  }

  onGradeChange(controlName: string, value: any) {
    console.log('onGradeChange', controlName, value);
    this.calculateFinalGrade();
  }

  private calculateFinalGrade() {
    console.log('settingPenilaian', this.settingPenilaian)
    console.log('calculateFinalGrade');
    const harian = this.form.get('nilaiHarian')?.value || 0;
    const ketrampilan = this.form.get('nilaiKetrampilan')?.value || 0;
    const sikap = this.form.get('nilaiSikap')?.value || 0;
    const pts = this.form.get('nilaiPts')?.value || 0;
    const pas = this.form.get('nilaiPas')?.value || 0;

    // Calculate final grade (you can adjust the formula as needed)
    const finalGrade = (harian * this.settingPenilaian.persenHarian/100) + 
                      (ketrampilan * this.settingPenilaian.persenKetrampilan/100) + 
                      (sikap * this.settingPenilaian.persenSikap/100) + 
                      (pts * this.settingPenilaian.persenPts/100) + 
                      (pas * this.settingPenilaian.persenPas/100);
                      
    this.form.get('nilaiAkhir')?.setValue(Math.round(finalGrade));
  }

  onSave() {
    if (this.form.valid) {
      this.assesmentService.save(this.form.value).subscribe((response) => {
        if (response != null) {
          this.onClose.next('success');
          this.modalRef.hide();
        }
      })
    }
  }

  onCancel() {
    this.modalRef.hide();
  }
}
