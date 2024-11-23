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
import { SubmitButtonComponent } from '../../../../components/submit-button/submit-button.component';
import { ITab } from '../../../../domain/model/tab.model';
import { SubDistrictService } from '../../../../domain/service/subdistricts.service';
import { MaritalStatusService } from '../../../../domain/service/marital-status.service';

@Component({
  selector: 'app-student-edit-address',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BaseInputComponent,
  ],
  templateUrl: './student-edit-address.component.html',
})
export class StudentEditAddressComponent implements OnInit {
  @Input() activeTab?: ITab;
  @Input() form!: FormGroup;
  @Input() religions: any[] = [];
  @Input() countries: any[] = [];
  @Output() onRemove = new EventEmitter<any>();
  isLoaded = false;

  subDistricts: any[] = [];
  residentialSubDistricts: any[] = [];
  isSubmitting = signal(false);
  private subdistrictService = inject(SubDistrictService);

  constructor() {}

  ngOnInit(): void {
    if (this.form.getRawValue() != null) {
      if (this.form.getRawValue().subdistrictId != null) {
        this.subdistrictService
          .findBy(this.form.getRawValue().subdistrictId)
          .subscribe((res: any) => {
            this.subDistricts = [res.body];
          });
      }
      if(this.form.getRawValue().subDistrictId != null) {
        this.subdistrictService.findBy(this.form.getRawValue().subDistrictId).subscribe((res: any) => {
          this.subDistricts = [res.body]
        })
      }
    }
  }

  onSubDistrictKeyUp(e: any) {
    this.subdistrictService.search(e).subscribe((res: any) => {
      this.subDistricts = res.body;
    });
  }

  onSelectChange() {
    console.group('onSelectChange');
  }
}
