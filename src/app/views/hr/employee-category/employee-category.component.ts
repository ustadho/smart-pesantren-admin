import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { EmployeeCategoryListComponent} from './employee-category-list/employee-category-list.component'
import { EmployeeCategoryEditComponent} from './employee-category-edit/employee-category-edit.component'
import { ITab } from '../../../domain/model/tab.model'
import { TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-category',
  standalone: true,
  imports: [CommonModule, TabsModule, EmployeeCategoryListComponent, EmployeeCategoryEditComponent],
  templateUrl: './employee-category.component.html',
  styleUrl: './employee-category.component.scss'
})
export class EmployeeCategoryComponent implements OnInit, AfterViewInit {
  tabs: ITab[] = [];

  @ViewChild(EmployeeCategoryListComponent)
  private listComponent?: EmployeeCategoryListComponent;

  @ViewChild('tabset', { static: false }) tabset?: TabsetComponent;
  private cdRef = inject(ChangeDetectorRef);

  constructor() {}

  ngOnInit(): void {
    this.onAdd();
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
    if(this.listComponent) {
      this.listComponent.transition();
    }
  }
}

