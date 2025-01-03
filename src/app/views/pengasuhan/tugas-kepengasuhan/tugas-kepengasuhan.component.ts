import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ITab } from '../../../domain/model/tab.model';
import { TugasKepengasuhanListComponent } from './tugas-kepengasuhan-list/tugas-kepengasuhan-list.component';
import { TugasKepengasuhanEditComponent } from './tugas-kepengasuhan-edit/tugas-kepengasuhan-edit.component';

@Component({
  selector: 'app-tugas-kepengasuhan',
  standalone: true,
  imports: [CommonModule, TabsModule, TugasKepengasuhanListComponent, TugasKepengasuhanEditComponent],
  templateUrl: './tugas-kepengasuhan.component.html',
  styleUrl: './tugas-kepengasuhan.component.scss'
})
export class TugasKepengasuhanComponent {
  tabs: ITab[] = [];

  @ViewChild(TugasKepengasuhanListComponent)
  private listComponent?: TugasKepengasuhanListComponent;

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
