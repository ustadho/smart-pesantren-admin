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
import { EmployeeEditEducationFormalDialogComponent } from './employee-edit-education-dialog.component';
import { combineLatest, Subscription } from 'rxjs';

@Component({
  selector: 'app-employee-edit-education',
  standalone: true,
  providers: [BsModalService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BaseInputComponent,
    FontAwesomeModule,
    EmployeeEditEducationFormalDialogComponent,
  ],
  templateUrl: './employee-edit-education.component.html',
})
export class EmployeeEditPersonalComponent implements OnInit {
  @Input() activeTab?: ITab;
  @Input() form!: FormGroup;
  @Output() onRemove = new EventEmitter<any>();
  modalRef?: BsModalRef;
  educationLevels: any[] = [];

  private educationLevelService = inject(EducationLevelService);
  private bsModalService = inject(BsModalService);
  private toast = inject(ToastrService);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.educationLevelService.findAll('').subscribe((res: any) => {
      this.educationLevels = res.body;
    });
  }

  onAddEducation() {
    const initialState: ModalOptions = {
      initialState: {
        data: null,
        employeeName: this.form.getRawValue().name,
        title: 'Pendidikan Formal',
      },
    };

    this.modalRef = this.bsModalService.show(
      EmployeeEditEducationFormalDialogComponent,
      initialState
    );
    this.modalRef.setClass('modal-lg');
    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.onClose.subscribe((data: any) => {
      const details = this.form.get('formalEducations') as FormArray;
      details.push(
        this.fb.group({
          ...data,
        })
      );
      // Lakukan apa yang perlu dengan data yang diterima
    });
  }

  onEdit(idx: number) {
    const details = this.form.get('formalEducations') as FormArray;
    const original = details.at(idx).value;
    const initialState: ModalOptions = {
      initialState: {
        data: original,
        rowIndex: idx,
        employeeName: this.form.getRawValue().name,
        title: 'Pendidikan Formal',
      },
    };

    this.modalRef = this.bsModalService.show(
      EmployeeEditEducationFormalDialogComponent,
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
    const control = this.form.get('formalEducations') as FormArray;
    return control;
  }
}
