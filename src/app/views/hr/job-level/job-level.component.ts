import { Component, ViewChild } from '@angular/core';
import { JobLevelListComponent } from './job-level-list/job-level-list.component';
import { ITab } from '../../../domain/model/tab.model';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { JobLevelEditComponent } from './job-level-edit/job-level-edit.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-level',
  standalone: true,
  imports: [CommonModule, TabsModule, JobLevelListComponent, JobLevelEditComponent],
  templateUrl: './job-level.component.html',
  styleUrl: './job-level.component.scss'
})
export class JobLevelComponent {
  tabs: ITab[] = [];

  @ViewChild(JobLevelListComponent)
  private listComponent?: JobLevelListComponent;

  constructor() {}

  ngOnInit(): void {
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
        title: `Edit - ${data.code}`,
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
