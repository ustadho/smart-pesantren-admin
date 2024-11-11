import { Component, ViewChild } from '@angular/core';
import { ITab } from '../../../domain/model/tab.model';
import { AcademicYearListComponent } from './academic-year-list/academic-year-list.component';
import { CommonModule } from '@angular/common';
import { AcademicYearEditComponent } from './academic-year-edit/academic-year-edit.component';
import { TabsModule } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-academic-year',
  standalone: true,
  imports: [CommonModule, TabsModule, AcademicYearListComponent, AcademicYearEditComponent],
  templateUrl: './academic-year.component.html',
  styleUrl: './academic-year.component.scss'
})
export class AcademicYearComponent {
  tabs: ITab[] = [];

  @ViewChild(AcademicYearListComponent)
  private listComponent?: AcademicYearListComponent;

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
