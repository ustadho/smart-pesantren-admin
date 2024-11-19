import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ITab } from '../../../domain/model/tab.model';
import { GuardianListComponent } from './guardian-list/guardian-list.component';
import { GuardianEditComponent } from './guardian-edit/guardian-edit.component';
import { CityService } from '../../../domain/service/city.service';
import { ReligionService } from '../../../domain/service/religion.service';
import { CountryService } from '../../../domain/service/country.service';

@Component({
  selector: 'app-guardian',
  standalone: true,
  imports: [
    CommonModule,
    TabsModule,
    GuardianListComponent,
    GuardianEditComponent
  ],
  templateUrl: './guardian.component.html',
  styleUrl: './guardian.component.scss'
})
export class GuardianComponent {
  tabs: ITab[] = [];
  categories: any[] = [];
  cities: any[] = [];
  academicYears: any[] = [];
  religions: any[] = [];
  countries: any[] = [];
  institutions: any[] = [];

  @ViewChild(GuardianListComponent)
  private listComponent?: GuardianListComponent;
  private cityService = inject(CityService);
  private religionService = inject(ReligionService);
  private countryService = inject(CountryService);


  constructor() {}

  ngOnInit(): void {
    this.cityService.findAll('').subscribe((res: any) => {
      this.cities = res.body;
    })
    this.religionService.findAll('').subscribe((res: any) => {
      this.religions = res.body;
    })
    this.countryService.findAll('').subscribe((res: any) => {
      this.countries = res.body;
    })
    this.onAdd();
  }

  onAdd() {
    const newTabIndex = this.tabs.length;
    this.tabs.push({
      title: `Data Baru`,
      content: ``,
      disabled: false,
      removable: true,
      active: true,
      data: null,
    });
    this.tabs[newTabIndex].active = true;
  }

  onEdit(data: any) {
    let rowIndex = -1;
    this.tabs.forEach((t, i) => {
      if (t.data !== null && t.data.id == data.id) {
        rowIndex = i;
      }
    });
    if (rowIndex == -1) {
      const newTabIndex = this.tabs.length;
      this.tabs.push({
        title: `Edit - ${data.name}`,
        content: ``,
        disabled: false,
        removable: true,
        data: data,
      });
      this.tabs[newTabIndex].active = true;
    } else {
      this.tabs[rowIndex].active = true;
    }
  }

  onRemoveTab(tab: ITab) {
    const idx = this.tabs.indexOf(tab)
    if(idx > 0 && this.tabs[idx - 1].active != null) {
      this.tabs[idx - 1].active = true;
    }
    this.tabs.splice(this.tabs.indexOf(tab), 1);
    if(this.listComponent) {
      this.listComponent.onRefresh();
    }
  }

  refreshList(evt: any) {
    if(this.listComponent) {
      this.listComponent.transition();
    }
  }
}
