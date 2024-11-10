import { CommonModule, formatDate } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BaseInputComponent } from '../../../../components/base-input/base-input.component'
import { SubmitButtonComponent } from '../../../../components/submit-button/submit-button.component'
import { ITab } from '../../../../domain/model/tab.model';
import Swal from 'sweetalert2';
import { SubDistrictService } from '../../../../domain/service/subdistricts.service';
import { MaritalStatusService } from '../../../../domain/service/marital-status.service';

@Component({
  selector: 'app-employee-edit-personal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SubmitButtonComponent,
    BaseInputComponent,
  ],
  templateUrl: './employee-edit-personal.component.html',
})
export class EmployeeEditAddressComponent implements OnInit {
  @Input() activeTab?: ITab;
  @Input() form!: FormGroup;
  @Output() onRemove = new EventEmitter<any>();
  maritalStatuses: any[] =[];
  isLoaded = false;

  permanentSubDistricts: any[] = [];
  residentialSubDistricts: any[] = [];
  isSubmitting = signal(false);
  private subdistrictService = inject(SubDistrictService);
  private maritalStatusService = inject(MaritalStatusService);
  private toast = inject(ToastrService);


  constructor(
    private fb : FormBuilder
  ) {

  }

  ngOnInit(): void {
    if (this.form.getRawValue() != null) {
      if(this.form.getRawValue().permanentSubdistrictId != null) {
        this.subdistrictService.findBy(this.form.getRawValue().permanentSubdistrictId).subscribe((res: any) => {
          this.permanentSubDistricts = [res.body]
        })
      }
      if(this.form.getRawValue().residentialSubdistrictId != null) {
        this.subdistrictService.findBy(this.form.getRawValue().residentialSubdistrictId).subscribe((res: any) => {
          this.residentialSubDistricts = [res.body]
        })
      }
    }
    this.maritalStatusService.findAll('').subscribe((res: any)=> {
      this.maritalStatuses = res.body
    })
  }

  onPermanentSubDistrictKeyUp(e: any) {
    this.subdistrictService.search(e).subscribe((res: any) => {
      this.permanentSubDistricts = res.body;
    });
  }

  onResidentialSubDistrictKeyUp(e: any) {
    this.subdistrictService.search(e).subscribe((res: any) => {
      this.residentialSubDistricts = res.body;
    });
  }

  onSelectChange() {
    console.group('onSelectChange');
  }
}

