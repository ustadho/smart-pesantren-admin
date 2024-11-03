import { CommonModule, formatDate } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BaseInputComponent } from '../../../../components/base-input/base-input.component';
import { EducationLevelService } from '../../../../domain/service/education-level.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';
import { ReferalInstitutionService } from '../../../../domain/service/referal-institution.service';
import { HttpResponse } from '@angular/common/http';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { WorkingHourService } from 'src/app/domain/service/working-hour.service';

@Component({
  selector: 'app-employee-edit-working-hour-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BaseInputComponent,
    FontAwesomeModule,
  ],
  templateUrl: './employee-edit-working-hour-dialog.component.html',
})
export class EmployeeEditWorkingHourDialogComponent implements OnInit {
  form: FormGroup;
  title: string = 'Tambah Jam Kerja'
  data: any = null;
  rowIndex: number = -1;
  workingHours: any[] = [];
  employeeName: string =''
  public onClose: Subject<Object> = new Subject();
  bsConfig: Partial<BsDatepickerConfig>;

  private workingHourService = inject(WorkingHourService);
  private toast = inject(ToastrService);

  constructor(private fb: FormBuilder, public modalRef: BsModalRef) {
    this.form = this.fb.group({
      id: [null],
      workingHourId:[null, [Validators.required]],
      workingHourName:[null, [Validators.required]],
      effectiveDate:[new Date(), [Validators.required]],
      description: [null],
    })
    this.bsConfig = {
      minMode: 'year',
      dateInputFormat: 'YYYY' // Format tampilan menjadi hanya tahun
    };
  }

  ngOnInit(): void {
    this.workingHourService.findAll('').subscribe((res: any) => {
      this.workingHours = res.body;
    });

    if(this.data != null) {
      this.form.patchValue(this.data)
    }
  }

  onSelectWorkingHourChange(evt: any) {
    this.form.get("workingHourName")?.setValue(evt == null? null: evt.name)
  }

  onSave() {
    const data = {
      ...this.form.getRawValue()
    }
    this.onClose.next(data);
    this.modalRef.hide()
  }

  onDelete() {
    this.onClose.next('confirmDeleteItem');
    this.modalRef.hide();
  }
}
