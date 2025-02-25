import { AfterViewInit, ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { ITab } from '../../../domain/model/tab.model';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { CommonModule } from '@angular/common';
import { EmployeeEditComponent } from './employee-edit/employee-edit.component';
import { OrganizationService } from '../../../domain/service/organization.service';
import { EmployeeCategoryService } from '../../../domain/service/employee-category.service';
import { JobLevelService } from '../../../domain/service/job-level.service';
import { CityService } from '../../../domain/service/city.service';
import { JobPositionService } from '../../../domain/service/job-position.service';
import { SectionService } from '../../../domain/service/section.service';
import { EmployeeStatusService } from '../../../domain/service/employee-status.service';
import { ReligionService } from '../../../domain/service/religion.service';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, TabsModule, EmployeeListComponent, EmployeeEditComponent],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent implements AfterViewInit {
  tabs: ITab[] = [];

  @ViewChild(EmployeeListComponent)
  private listComponent?: EmployeeListComponent;

  @ViewChild('tabset', { static: false }) tabset?: TabsetComponent;
  categories: any[] = [];
  organizations: any[] = [];
  jobPositions: any[] = [];
  jobLevels: any[] = [];
  sections: any[] = [];
  employeeStatus: any[] = [];
  cities: any[] = [];
  referalInstitutions: any[] = [];
  religions: any[] = [];

  private cdRef = inject(ChangeDetectorRef);
  private organizationService = inject(OrganizationService);
  private employeeCategoryService = inject(EmployeeCategoryService);
  private jobLevelService = inject(JobLevelService);
  private cityService = inject(CityService);
  private jobPositionService = inject(JobPositionService);
  private sectionService = inject(SectionService);
  private employeeStatusService = inject(EmployeeStatusService);
  private religionService = inject(ReligionService);

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
    this.cityService.findAll('').subscribe((res: any) => {
      this.cities = res.body;
    });
    this.employeeCategoryService.findAll('').subscribe((res: any) => {
      this.categories = res.body;
    });
    this.jobLevelService.findAll('').subscribe((res: any) => {
      this.jobLevels = res.body;
    });
    this.religionService.findAll('').subscribe((res: any) => {
      this.religions = res.body;
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
