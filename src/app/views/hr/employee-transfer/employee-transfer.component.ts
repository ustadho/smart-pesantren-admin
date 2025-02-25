import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { ITab } from 'src/app/domain/model/tab.model';
import { EmployeeTransferListComponent } from './employee-transfer-list/employee-transfer-list.component';
import { TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { CommonModule } from '@angular/common';
import { EmployeeTransferEditComponent } from './employee-transfer-edit/employee-transfer-edit.component';
import { OrganizationService } from 'src/app/domain/service/organization.service';
import { EmployeeCategoryService } from 'src/app/domain/service/employee-category.service';
import { JobLevelService } from 'src/app/domain/service/job-level.service';
import { JobPositionService } from 'src/app/domain/service/job-position.service';
import { SectionService } from 'src/app/domain/service/section.service';
import { EmployeeStatusService } from 'src/app/domain/service/employee-status.service';

@Component({
  selector: 'app-employee-transfer',
  standalone: true,
  imports: [CommonModule, TabsModule, EmployeeTransferListComponent, EmployeeTransferEditComponent],
  templateUrl: './employee-transfer.component.html',
  styleUrl: './employee-transfer.component.scss'
})
export class EmployeeTransferComponent implements OnInit, AfterViewInit {
  tabs: ITab[] = [];

  @ViewChild(EmployeeTransferListComponent)
  private listComponent?: EmployeeTransferListComponent;

  @ViewChild('tabset', { static: false }) tabset?: TabsetComponent;
  private cdRef = inject(ChangeDetectorRef);

  organizations: any[] = [];
  jobPositions: any[] = [];
  jobLevels: any[] = [];
  sections: any[] = [];
  employeeStatus: any[] = [];

  private organizationService = inject(OrganizationService);
  private jobLevelService = inject(JobLevelService);
  private jobPositionService = inject(JobPositionService);
  private sectionService = inject(SectionService);
  private employeeStatusService = inject(EmployeeStatusService);

  constructor() {}

  ngOnInit(): void {
    this.onAdd();

    this.organizationService.findAll('').subscribe((res: any) => {
      this.organizations = res.body;
    });
    this.sectionService.findAll('').subscribe((res: any) => {
      this.sections = res.body;
    });
    this.jobPositionService.findAll('').subscribe((res: any) => {
      this.jobPositions = res.body;
    });
    this.jobLevelService.findAll('').subscribe((res: any) => {
      this.jobLevels = res.body;
    });
    this.employeeStatusService.findAll('').subscribe((res: any) => {
      this.employeeStatus = res.body;
    });
    this.jobLevelService.findAll('').subscribe((res: any) => {
      this.jobLevels = res.body;
    });
  }

  ngAfterViewInit(): void {
    if (this.tabset && this.tabset.tabs.length > 0) {
      this.tabset.tabs[0].active = true;
      // Setelah mengubah nilai, panggil detectChanges untuk memberi tahu Angular untuk memperbarui tampilan
      this.cdRef.detectChanges();
    }
  }


  onAdd() {
    const newTabIndex = this.tabs.length;
    this.tabs.push({
      title: `Data Baru`,
      content: ``,
      disabled: false,
      removable: true,
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
        title: `Edit - ${data.employeeName}`,
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
      this.tabs.splice(idx, 1);
      if(this.tabs.length > 0)
        this.tabs[idx - 1].active = true;
      else if(this.tabset) {
        this.tabset.tabs[0].active = true
      }
    } else {
      if(this.tabset) {
        this.tabset.tabs[0].active = true
      }
      this.tabs[0].active = true;
    }

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
