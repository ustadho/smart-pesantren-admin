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
  FormArray,
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
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { EmployeeEditWorkingHourDialogComponent } from './employee-edit-working-hour-dialog.component';
import { combineLatest, Subscription } from 'rxjs';
import { WorkingHourService } from '../../../../domain/service/working-hour.service';

@Component({
  selector: 'app-employee-edit-working-hour',
  standalone: true,
  providers: [BsModalService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BaseInputComponent,
    FontAwesomeModule,
    EmployeeEditWorkingHourDialogComponent,
  ],
  templateUrl: './employee-edit-working-hour.component.html',
})
export class EmployeeEditWorkingHourComponent implements OnInit {
  @Input() activeTab?: ITab;
  @Input() form!: FormGroup;
  @Input() locations!: any[];
  @Output() onRemove = new EventEmitter<any>();
  modalRef?: BsModalRef;
  workingHours: any[] = [];

  private workingHourService = inject(WorkingHourService);
  private bsModalService = inject(BsModalService);
  private toast = inject(ToastrService);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.workingHourService.findAll('').subscribe((res: any) => {
      this.workingHours = res.body;
    });
  }

  onAddWorkingHour() {
    const initialState: ModalOptions = {
      initialState: {
        data: null,
        employeeName: this.form.getRawValue().name,
        title: 'Tambah Jam Kerja',
      },
    };

    this.modalRef = this.bsModalService.show(
      EmployeeEditWorkingHourDialogComponent,
      initialState
    );
    this.modalRef.setClass('modal-md');
    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.onClose.subscribe((data: any) => {
      const details = this.form.get('workingHours') as FormArray;
      details.push(
        this.fb.group({
          ...data,
        })
      );
    });
  }

  onEdit(idx: number) {
    const details = this.form.get('workingHours') as FormArray;
    const original = details.at(idx).value;
    const initialState: ModalOptions = {
      initialState: {
        data: original,
        rowIndex: idx,
        employeeName: this.form.getRawValue().name,
        title: 'Edit Jam Kerja',
      },
    };

    this.modalRef = this.bsModalService.show(
      EmployeeEditWorkingHourDialogComponent,
      initialState
    );
    this.modalRef.setClass('modal-lg');
    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.onClose.subscribe((res: any) => {
      if (res === 'confirmDeleteItem') {
        details.removeAt(idx);
        for (const control of details.controls) {
          if (control != null) {
            // control.get('seq').setValue(details.controls.indexOf(control) + 1);
          }
        }
      } else {
        details.at(idx).patchValue(res);
      }
    });
  }

  get getFormDetailControls() {
    const control = this.form.get('workingHours') as FormArray;
    return control;
  }
}
