import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BaseInputComponent } from '../../../../components/base-input/base-input.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { GuardianLookupComponent } from '../guardian-lookup/guardian-lookup.component';
import { SubDistrictService } from '../../../../domain/service/subdistricts.service';

@Component({
  selector: 'app-guardian-panel',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BaseInputComponent,
    FontAwesomeModule,
  ],
  providers: [BsModalService],
  templateUrl: './guardian-panel.component.html',
  styleUrl: './guardian-panel.component.scss'
})
export class GuardianPanelComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() sex!: string
  @Input() personTitles: any[] = []
  modalRef?: BsModalRef;
  subDistricts: any[] = [];
  private bsModalService = inject(BsModalService);
  private subdistrictService = inject(SubDistrictService);


  ngOnInit(): void {
    if(this.form.getRawValue().permanentSubdistrictId != null) {
      this.subdistrictService.findBy(this.form.getRawValue().permanentSubdistrictId).subscribe((res: any) => {
        this.subDistricts = [res.body]
      })
    }
  }

  onTitleChange(e: any) {
    this.form.get('sex')?.setValue(e.sex);
  }

  onLookup() {
    console.log('onLookup')
    const initialState: ModalOptions = {
      initialState: {
        data: null,
        sex: this.sex,
        employeeName: this.form.getRawValue().name,
        title: 'Lookup Orangtua/ Wali',
      },
    };

    this.modalRef = this.bsModalService.show(
      GuardianLookupComponent,
      initialState
    );
    this.modalRef.setClass('custom-modal-width');
    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.onClose.subscribe((data: any) => {
      this.form.patchValue(data)
      if(this.form.getRawValue().permanentSubdistrictId != null) {
        this.subdistrictService.findBy(this.form.getRawValue().permanentSubdistrictId).subscribe((res: any) => {
          this.subDistricts = [res.body]
        })
      }
      // Lakukan apa yang perlu dengan data yang diterima
    });
  }

  onSubDistrictKeyUp(e: any) {
    this.subdistrictService.search(e).subscribe((res: any) => {
      this.subDistricts = res.body;
    });
  }
}
