import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { ClassRoomListComponent } from './class-room-list/class-room-list.component';
import { ClassRoomEditComponent } from './class-room-edit/class-room-edit.component';
import { ITab } from '../../../domain/model/tab.model';
import { TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { AcademicYearService } from '../../../domain/service/academic-year.service';
import { ClassLevelService } from '../../../domain/service/class-level.service';
import { LocationService } from '../../../domain/service/location.service';
import { EmployeeService } from '../../../domain/service/employee.service';
import { CurriculumService } from '../../../domain/service/curriculum.service';
import { InstitutionService } from '../../../domain/service/institution.service';

@Component({
  selector: 'app-class-room',
  standalone: true,
  imports: [
    CommonModule,
    TabsModule,
    ClassRoomListComponent,
    ClassRoomEditComponent,
  ],
  templateUrl: './class-room.component.html',
  styleUrl: './class-room.component.scss'
})
export class ClassRoomComponent implements AfterViewInit {
  tabs: ITab[] = [];
  academicYears: any[] = [];
  classLevels: any[] = [];
  locations: any[] = [];
  teachers: any[] = [];
  curriculums: any[] = [];
  institutions: any[] = [];

  @ViewChild(ClassRoomListComponent)
  private listComponent?: ClassRoomListComponent;

  @ViewChild('tabset') tabset: TabsetComponent | null= null;
  private cdRef = inject(ChangeDetectorRef);

  private academicYearService = inject(AcademicYearService);
  private classLevelService = inject(ClassLevelService);
  private locationService = inject(LocationService);
  private employeeService = inject(EmployeeService);
  private curriculumService = inject(CurriculumService);
  private institutionService = inject(InstitutionService);
  constructor() {}

  ngOnInit(): void {
    this.onAdd();
    this.academicYearService.findAll('').subscribe((data) => {
      this.academicYears = data.body
    })
    this.classLevelService.findAll('').subscribe((data) => {
      this.classLevels = data.body
    })
    this.locationService.findAll('').subscribe((data) => {
      this.locations = data.body
    })
    this.employeeService.findAll('').subscribe((data) => {
      this.teachers = data.body
    })
    this.curriculumService.findAll('').subscribe((data) => {
      this.curriculums = data.body
    })
    this.institutionService.findAll('').subscribe((data) => {
      this.institutions = data.body
    })
  }

  ngAfterViewInit(): void {
    if (this.tabset && this.tabset.tabs.length > 0) {
      this.tabset.tabs[0].active = true;
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
      active: true,
      data: null,
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
        title: `Edit - ${data.code}`,
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
    if (this.listComponent && this.academicYears.length > 0) {
      this.listComponent.handleNavigation();
    }
  }
}
