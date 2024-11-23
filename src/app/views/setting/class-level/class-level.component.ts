import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ClassLevelListComponent } from './class-level-list/class-level-list.component';
import { ClassLevelEditComponent } from './class-level-edit/class-level-edit.component';
import { ITab } from '../../../domain/model/tab.model';
import { EducationLevelService } from '../../../domain/service/education-level.service';

@Component({
  selector: 'app-class-level',
  standalone: true,
  imports: [
    CommonModule,
    TabsModule,
    ClassLevelListComponent,
    ClassLevelEditComponent,
  ],
  templateUrl: './class-level.component.html',
  styleUrl: './class-level.component.scss'
})
export class ClassLevelComponent {
  tabs: ITab[] = [];
  educationLevels: any[] = [];

  @ViewChild(ClassLevelListComponent)
  private listComponent?: ClassLevelListComponent;

  private educationLevelService = inject(EducationLevelService);
  constructor() {}

  ngOnInit(): void {
    this.onAdd();
    this.educationLevelService.findAll('').subscribe((data) => {
      this.educationLevels = data.body
    })
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
    const idx = this.tabs.indexOf(tab);
    if (idx > 0 && this.tabs[idx - 1].active != null) {
      this.tabs[idx - 1].active = true;
    }
    this.tabs.splice(this.tabs.indexOf(tab), 1);
    if (this.listComponent) {
      this.listComponent.onRefresh();
    }
  }

  refreshList(evt: any) {
    if (this.listComponent) {
      this.listComponent.transition();
    }
  }
}
