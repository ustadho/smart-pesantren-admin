import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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

  constructor() {}

  ngOnInit() {
    // Subscribe to value changes of the grade controls to calculate final grade
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
      nilaiTugas: [0],
      nilaiUTS: [0],
      nilaiUAS: [0],
      nilaiAkhir: [0, { disabled: true }],
    });
    // this.subscribeToGradeChanges();
    if(this.data != null){
      this.form.patchValue(this.data);
    }
  }

  private subscribeToGradeChanges() {
    // Monitor changes in tugas, UTS, and UAS grades
    const gradeControls = ['nilaiTugas', 'nilaiUTS', 'nilaiUAS'];
    gradeControls.forEach(controlName => {
      this.form.get(controlName)?.valueChanges.subscribe(() => {
        this.calculateFinalGrade();
      });
    });
  }

  private calculateFinalGrade() {
    const tugas = this.form.get('nilaiTugas')?.value || 0;
    const uts = this.form.get('nilaiUTS')?.value || 0;
    const uas = this.form.get('nilaiUAS')?.value || 0;

    // Calculate final grade (you can adjust the formula as needed)
    const finalGrade = (tugas * 0.3) + (uts * 0.3) + (uas * 0.4);
    this.form.get('nilaiAkhir')?.setValue(Math.round(finalGrade));
  }

  onSave() {
    this.assesmentService.save(this.form.value).subscribe((response) => {
      if (response != null) {
        this.onClose.next('success');
        this.modalRef.hide();
      }
    })
  }

  onCancel() {
    this.modalRef.hide();
  }
}
