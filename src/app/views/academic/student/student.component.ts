import { Component, inject, ViewChild } from '@angular/core';
import { ITab } from '../../../domain/model/tab.model';
import { StudentService } from '../../../domain/service/student.service';
import { StudentListComponent } from './student-list/student-list.component'
import { StudentEditComponent } from './student-edit/student-edit.component'
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { StudentCategoryService } from '../../../domain/service/student-category.service';
import { CityService } from '../../../domain/service/city.service';
import { AcademicYearService } from '../../../domain/service/academic-year.service';
import { ReligionService } from '../../../domain/service/religion.service';
import { CountryService } from '../../../domain/service/country.service';
import { InstitutionService } from '../../../domain/service/institution.service';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [
    CommonModule,
    TabsModule,
    StudentListComponent,
    StudentEditComponent
  ],
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss'
})
export class StudentComponent {
  tabs: ITab[] = [];
  categories: any[] = [];
  cities: any[] = [];
  academicYears: any[] = [];
  religions: any[] = [];
  countries: any[] = [];
  institutions: any[] = [];

  @ViewChild(StudentListComponent)
  private listComponent?: StudentListComponent;
  private categoryService = inject(StudentCategoryService);
  private academicYearService = inject(AcademicYearService);
  private cityService = inject(CityService);
  private religionService = inject(ReligionService);
  private countryService = inject(CountryService);
  private institutionService = inject(InstitutionService);


  constructor() {}

  ngOnInit(): void {
    this.categoryService.findAll('').subscribe((res: any) => {
      this.categories = res.body;
    })
    this.cityService.findAll('').subscribe((res: any) => {
      this.cities = res.body;
    })
    this.academicYearService.findAll('').subscribe((res: any) => {
      this.academicYears = res.body;
    })
    this.religionService.findAll('').subscribe((res: any) => {
      this.religions = res.body;
    })
    this.countryService.findAll('').subscribe((res: any) => {
      this.countries = res.body;
    })
    this.institutionService.findAll('').subscribe((res: any) => {
      this.institutions = res.body;
    })
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
