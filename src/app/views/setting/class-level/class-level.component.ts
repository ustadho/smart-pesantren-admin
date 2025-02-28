import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
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
export class ClassLevelComponent implements AfterViewInit {
  tabs: ITab[] = [];
  educationLevels: any[] = [];

  @ViewChild(ClassLevelListComponent)
  private listComponent?: ClassLevelListComponent;

  @ViewChild('tabset') tabset: TabsetComponent | null= null;
  private cdRef = inject(ChangeDetectorRef);

  private educationLevelService = inject(EducationLevelService);
  constructor() {}

  ngOnInit(): void {
    this.onAdd();
    this.educationLevelService.findAll('').subscribe((data) => {
      this.educationLevels = data.body
    })
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
    if (this.listComponent) {
      this.listComponent.transition();
    }
  }
}
