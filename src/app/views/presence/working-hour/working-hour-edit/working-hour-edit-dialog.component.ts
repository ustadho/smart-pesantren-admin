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
import { DayService } from '../../../../domain/service/day.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';
import { WorkingTimeService } from '../../../../domain/service/working-time.service';
import { HttpResponse } from '@angular/common/http';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-working-hour-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BaseInputComponent,
    FontAwesomeModule,
  ],
  templateUrl: './working-hour-edit-dialog.component.html',
})
export class WorkingHourEditDialogComponent implements OnInit {
  form: FormGroup;
  data: any = null;
  rowIndex: number = -1;
  days: any[] = [];
  workingTimes: any[] = [];
  employeeName: string =''
  public onClose: Subject<Object> = new Subject();
  bsConfig: Partial<BsDatepickerConfig>;
  title: string =''

  private dayService = inject(DayService);
  private workingTimeService = inject(WorkingTimeService);
  private toast = inject(ToastrService);

  constructor(private fb: FormBuilder, public modalRef: BsModalRef) {
    this.form = this.fb.group({
      id: [null],
      dayId:[null, [Validators.required]],
      dayName:[null, [Validators.required]],
      workingTimeId:[null, [Validators.required]],
      workingTimeName:[null, [Validators.required]],
      checkInTime: [null, [Validators.required]],
      checkOutTime: [null, [Validators.required]],
    })
    this.bsConfig = {
    };
  }

  ngOnInit(): void {
    this.dayService.findAll().subscribe((res: any) => {
      this.days = res.body;
    });
    this.workingTimeService.findAll('').subscribe((res: HttpResponse<any[]>) => {
      console.log('res', res)
      if(res.body != null) {
        this.workingTimes = res.body.map((i: any) => {
          return {
            ...i,
            completeLabel: `${i.name} [${i.checkInTime} - ${i.checkOutTime}]`
          };
        });
      }
    });
    if(this.data != null) {
      this.form.patchValue(this.data)
    }
  }

  onSelectDayChange(evt: any) {
    this.form.get("dayName")?.setValue(evt == null? null: evt.name)
  }

  onSelectWorkingTimeChange(evt: any) {
    this.form.patchValue({
      workingTimeName: evt.name,
      checkInTime: new Date(`'1970-01-01 ${evt.checkInTime}`),
      checkOutTime: new Date(`'1970-01-01 ${evt.checkOutTime}`),
    })
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
