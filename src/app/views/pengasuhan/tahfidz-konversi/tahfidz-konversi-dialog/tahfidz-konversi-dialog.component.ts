import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BaseInputComponent } from '../../../../components/base-input/base-input.component';
import { SubmitButtonComponent } from '../../../../components/submit-button/submit-button.component';

@Component({
  selector: 'app-tahfidz-konversi-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BaseInputComponent,
    SubmitButtonComponent
  ],
  templateUrl: './tahfidz-konversi-dialog.component.html',
  styleUrl: './tahfidz-konversi-dialog.component.scss'
})
export class TahfidzKonversiDialogComponent {
  form: FormGroup;
  tahfidzData: any[] = [];
  selectedTahfidz: any = null;
  isSubmitting = signal(false);
  initialValue: any;

  private fb = inject(FormBuilder);
  bsModalRef = inject(BsModalRef);

  constructor() {
    this.form = this.fb.group({
      tahfidzId: [null]
    });
    
  }

  ngOnInit() {
    this.form.patchValue({
      tahfidzId: this.initialValue.targetTahfidzId
    });
    this.onTahfidzChange(this.initialValue.targetTahfidzId);
  }

  onTahfidzChange(event: any) {
    console.log('event', event);
    if (event) {
      this.selectedTahfidz = this.tahfidzData.find(item => item.id === event);
    } else {
      this.selectedTahfidz = null;
    }
  }

  onUpdate() {
    if (this.form.valid && this.form.value.tahfidzId) {
      const selected = this.tahfidzData.find(item => item.id === this.form.value.tahfidzId);
      console.log('selectedTahfidz', selected)
      this.bsModalRef.hide();
      this.bsModalRef.onHide?.emit(selected);
    }
  }
}
