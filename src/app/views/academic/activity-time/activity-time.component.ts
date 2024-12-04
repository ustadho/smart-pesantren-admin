import { Component, inject, ViewChild } from '@angular/core';
import { ITab } from '../../../domain/model/tab.model';
import { ActivityTimeEditComponent } from './activity-time-edit/activity-time-edit.component';
import { ActivityTimeListComponent } from './activity-time-list/activity-time-list.component';
import { InstitutionService } from '../../../domain/service/institution.service';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-activity-time',
  standalone: true,
  imports: [
    CommonModule,
    TabsModule,
    ActivityTimeListComponent,
    ActivityTimeEditComponent],
  templateUrl: './activity-time.component.html',
  styleUrl: './activity-time.component.scss'
})
export class ActivityTimeComponent {
  tabs: ITab[] = [];
  categories: any[] = [];
  cities: any[] = [];
  academicYears: any[] = [];
  religions: any[] = [];
  countries: any[] = [];
  institutions: any[] = [];

  @ViewChild(ActivityTimeListComponent)
  private listComponent?: ActivityTimeListComponent;
  private institutionService = inject(InstitutionService);


  constructor() {}

  ngOnInit(): void {
    this.institutionService.findAll('').subscribe((res: any) => {
      this.institutions = res.body;
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
        title: `Edit - ${data.description}`,
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
