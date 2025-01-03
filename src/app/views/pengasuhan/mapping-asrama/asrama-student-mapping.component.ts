import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ITab } from '../../../domain/model/tab.model';
import { AcademicYearService } from '../../../domain/service/academic-year.service';
import { PesantrenService } from '../../../domain/service/pesantren.service';
import { AsramaStudentMappingListComponent } from './asrama-student-mapping-list/asrama-student-mapping-list.component';
import { AsramaStudentMappingEditComponent } from './asrama-student-mapping-edit/asrama-student-mapping-edit.component';

@Component({
  selector: 'app-mapping-asrama',
  standalone: true,
  imports: [
    CommonModule,
    TabsModule,
    AsramaStudentMappingListComponent,
    AsramaStudentMappingEditComponent
  ],
  templateUrl: './asrama-student-mapping.component.html',
  styleUrl: './asrama-student-mapping.component.scss'
})
export class AsramaStudentMappingComponent {
  tabs: ITab[] = [];
  academicYears: any[] = [];
  pesantrens: any[] = [];

  @ViewChild(AsramaStudentMappingListComponent)
  private listComponent?: AsramaStudentMappingListComponent;

  private academicYearService = inject(AcademicYearService);
  private pesantrenService = inject(PesantrenService);
  constructor() {}

  ngOnInit(): void {
    this.onAdd();
    this.academicYearService.findAll('').subscribe((data) => {
      this.academicYears = data.body
    })
    this.pesantrenService.findAll('').subscribe((data) => {
      this.pesantrens = data.body
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
        title: `Edit - ${data.asramaName}`,
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
