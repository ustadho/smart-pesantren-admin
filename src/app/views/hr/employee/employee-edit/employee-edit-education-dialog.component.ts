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
import { ITab } from '../../../../domain/model/tab.model';
import { EducationLevelService } from '../../../../domain/service/education-level.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';
import { ReferalInstitutionService } from '../../../../domain/service/referal-institution.service';
import { HttpResponse } from '@angular/common/http';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-employee-edit-education-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BaseInputComponent,
    FontAwesomeModule,
  ],
  templateUrl: './employee-edit-education-dialog.component.html',
})
export class EmployeeEditEducationFormalDialogComponent implements OnInit {
  form: FormGroup;
  data: any = null;
  rowIndex: number = -1;
  educationLevels: any[] = [];
  referalInstitutions: any[] = [];
  employeeName: string =''
  public onClose: Subject<Object> = new Subject();
  bsConfig: Partial<BsDatepickerConfig>;

  private educationLevelService = inject(EducationLevelService);
  private referalInstitutionService = inject(ReferalInstitutionService);
  private toast = inject(ToastrService);

  constructor(private fb: FormBuilder, public modalRef: BsModalRef) {
    this.form = this.fb.group({
      id: [null],
      educationLevelId:[null, [Validators.required]],
      educationLevelName:[null, [Validators.required]],
      institutionId:[null, [Validators.required]],
      institutionName:[null, [Validators.required]],
      faculty:[null],
      majors:[null],
      score: [0],
      startYear: [null],
      endYear: [null],
      description: [null]
    })
    this.bsConfig = {
      minMode: 'year',
      dateInputFormat: 'YYYY' // Format tampilan menjadi hanya tahun
    };
  }

  ngOnInit(): void {
    this.educationLevelService.findAll('').subscribe((res: any) => {
      this.educationLevels = res.body;
    });
    this.referalInstitutionService.findAll('').subscribe((res: HttpResponse<any[]>) => {
      console.log('res', res)
      if(res.body != null) {
        this.referalInstitutions = res.body.map((i: any) => {
          return {
            ...i,
            completeLabel: i.name + ' - ' + i.city?.name
          };
        });
      }
    });
    if(this.data != null) {
      this.form.patchValue(this.data)
    }
  }

  onSelectEducationLevelChange(evt: any) {
    this.form.get("educationLevelName")?.setValue(evt == null? null: evt.name)
  }

  onSelectReferalInstitutionChange(evt: any) {
    this.form.get("institutionName")?.setValue(evt == null? null: evt.name)
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
