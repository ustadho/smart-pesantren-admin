import { CommonModule } from '@angular/common';
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
import { SubmitButtonComponent } from '../../../../components/submit-button/submit-button.component';
import { ITab } from '../../../../domain/model/tab.model';
import { SubDistrictService } from '../../../../domain/service/subdistricts.service';
import { MaritalStatusService } from '../../../../domain/service/marital-status.service';

@Component({
  selector: 'app-student-edit-notes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SubmitButtonComponent,
    BaseInputComponent,
  ],
  templateUrl: './student-edit-notes.component.html',
})
export class StudentEditNotesComponent implements OnInit {
  @Input() activeTab?: ITab;
  @Input() form!: FormGroup;
  @Output() onRemove = new EventEmitter<any>();
  isLoaded = false;

  isSubmitting = signal(false);
  private toast = inject(ToastrService);

  constructor() {}

  ngOnInit(): void {

  }

  onSelectChange() {
    console.group('onSelectChange');
  }
}
