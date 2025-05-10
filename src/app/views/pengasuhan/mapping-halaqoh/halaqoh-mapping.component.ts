import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { ITab } from '../../../domain/model/tab.model';
import { AcademicYearService } from '../../../domain/service/academic-year.service';
import { PesantrenService } from '../../../domain/service/pesantren.service';
import { HalaqohMappingListComponent } from './halaqoh-mapping-list/halaqoh-mapping-list.component';
import { InstitutionService } from '../../../domain/service/institution.service';
import { HalaqohMappingEditComponent } from './halaqoh-mapping-edit/halaqoh-mapping-edit.component';

@Component({
  selector: 'app-mapping-asrama',
  standalone: true,
  imports: [
    CommonModule,
    TabsModule,
    HalaqohMappingEditComponent,
    HalaqohMappingListComponent
],
  templateUrl: './halaqoh-mapping.component.html',
  styleUrl: './halaqoh-mapping.component.scss'
})
export class HalaqohMappingComponent implements AfterViewInit{
  tabs: ITab[] = [];
  academicYears: any[] = [];
  pesantrens: any[] = [];
  institutions: any[] = [];

  @ViewChild(HalaqohMappingListComponent)
  private listComponent?: HalaqohMappingListComponent;

  @ViewChild('tabset') tabset: TabsetComponent | null= null;
  private cdRef = inject(ChangeDetectorRef);

  private academicYearService = inject(AcademicYearService);
  private pesantrenService = inject(PesantrenService);
  private institutionService = inject(InstitutionService);
  constructor() {}

  ngOnInit(): void {
    this.academicYearService.findAll('').subscribe((data) => {
      this.academicYears = data.body
    })
    this.pesantrenService.findAll('').subscribe((data) => {
      this.pesantrens = data.body
    })
    this.institutionService.findAll('').subscribe((data) => {
      this.institutions = data.body
    })
  }

  ngAfterViewInit(): void {
    if (this.tabset && this.tabset.tabs.length > 0) {
      this.tabset.tabs[0].active = true;
      // Setelah mengubah nilai, panggil detectChanges untuk memberi tahu Angular untuk memperbarui tampilan
      this.cdRef.detectChanges();
    }
    this.onAdd(null);
  }

  onAdd(data: any) {
    const newTabIndex = this.tabs.length;
    this.tabs.push({
      title: `Data Baru`,
      content: ``,
      disabled: false,
      removable: true,
      active: true,
      data: data,
      index: newTabIndex,
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
        index: newTabIndex,
      });
      this.tabs[newTabIndex].active = true;
    } else {
      this.tabs[rowIndex].active = true;
    }
  }

  onRemoveTab(tab: ITab) {
    this.tabs.splice(tab.index, 1);
    if (this.tabset && this.tabset.tabs.length > 0) {
      this.tabset.tabs[0].active = true;
    }
  }

  refreshList(evt: any) {
    if (this.listComponent) {
      this.listComponent.transition();
    }
  }
}
