import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { HolidayListComponent } from './holiday-list/holiday-list.component';
import { HolidayEditComponent } from './holiday-edit/holiday-edit.component';
import { TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { ITab } from 'src/app/domain/model/tab.model';

@Component({
  selector: 'app-holiday',
  standalone: true,
  imports: [
    CommonModule,
    HolidayListComponent,
    HolidayEditComponent,
    TabsModule,
  ],
  templateUrl: './holiday.component.html',
  styleUrl: './holiday.component.scss'
})
export class HolidayComponent implements OnInit, AfterViewInit {
  tabs: ITab[] = [];

  @ViewChild(HolidayListComponent)
  private listComponent?: HolidayListComponent;

  @ViewChild('tabset') tabset: TabsetComponent | null= null;
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
        title: `Edit - ${data.holidayName}`,
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


