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
import { ITab } from '../../../../domain/model/tab.model';
import { SubDistrictService } from '../../../../domain/service/subdistricts.service';
import { GuardianPanelComponent } from '../../../../views/guardian/guardian/guardian-panel/guardian-panel.component';
import { KasEventManager } from '../../../../core/service/event-manager.service';

@Component({
  selector: 'app-student-edit-parent',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GuardianPanelComponent,
  ],
  templateUrl: './student-edit-parent.component.html',
})
export class StudentEditParentComponent implements OnInit {
  @Input() activeTab?: ITab;
  @Input() form!: FormGroup;
  @Input() religions: any[] = [];
  @Input() countries: any[] = [];

  @Output() onRemove = new EventEmitter<any>();
  isLoaded = false;

  subDistricts: any[] = [];
  maleTitles: any[] = [];
  femaleTitles: any[] = [];
  residentialSubDistricts: any[] = [];
  isSubmitting = signal(false);
  private subdistrictService = inject(SubDistrictService);
  private eventManager = inject(KasEventManager);

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
    this.eventManager.subscribe('personTitlesLoaded', (res: any) => {
      if(res.content != null && res.content.length > 0) {
        this.maleTitles = res.content.filter((x: any) => x.sex == 'M');
        this.femaleTitles = res.content.filter((x: any) => x.sex == 'F');
      }
    });
  }

  onSubDistrictKeyUp(e: any) {
    this.subdistrictService.search(e).subscribe((res: any) => {
      this.subDistricts = res.body;
    });
  }

  onSelectChange() {
    console.group('onSelectChange');
  }

  get fatherGroup() {
    return this.form.get('father') as FormGroup;
  }

  get motherGroup() {
    return this.form.get('mother') as FormGroup;
  }
}
