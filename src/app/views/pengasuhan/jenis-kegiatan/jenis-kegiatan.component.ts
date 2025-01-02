import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ITab } from '../../../domain/model/tab.model';
import { JenisKegiatanListComponent } from './jenis-kegiatan-list/jenis-kegiatan-list.component';
import { JenisKegiatanEditComponent } from './jenis-kegiatan-edit/jenis-kegiatan-edit.component';
import { SubjectCategoryService } from '../../../domain/service/subject-category.service';

@Component({
  selector: 'app-subject',
  standalone: true,
  imports: [CommonModule, TabsModule, JenisKegiatanListComponent, JenisKegiatanEditComponent],
  templateUrl: './jenis-kegiatan.component.html',
  styleUrl: './jenis-kegiatan.component.scss'
})
export class JenisKegiatanComponent {
  tabs: ITab[] = [];

  @ViewChild(JenisKegiatanListComponent)
  private listComponent?: JenisKegiatanListComponent;

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
