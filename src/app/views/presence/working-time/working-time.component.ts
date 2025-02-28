import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { WorkingTimeListComponent} from './working-time-list/working-time-list.component'
import { WorkingTimeEditComponent} from './working-time-edit/working-time-edit.component'
import { ITab } from '../../../domain/model/tab.model'
import { TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-working-time',
  standalone: true,
  imports: [CommonModule, TabsModule, WorkingTimeListComponent, WorkingTimeEditComponent],
  templateUrl: './working-time.component.html',
  styleUrl: './working-time.component.scss'
})
export class WorkingTimeComponent implements OnInit, AfterViewInit {
  tabs: ITab[] = [];

  @ViewChild(WorkingTimeListComponent)
  private listComponent?: WorkingTimeListComponent;

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

