import { AfterViewInit, ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { JobLevelListComponent } from './job-level-list/job-level-list.component';
import { ITab } from '../../../domain/model/tab.model';
import { TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { JobLevelEditComponent } from './job-level-edit/job-level-edit.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-level',
  standalone: true,
  imports: [CommonModule, TabsModule, JobLevelListComponent, JobLevelEditComponent],
  templateUrl: './job-level.component.html',
  styleUrl: './job-level.component.scss'
})
export class JobLevelComponent implements AfterViewInit {
  tabs: ITab[] = [];

  @ViewChild(JobLevelListComponent)
  private listComponent?: JobLevelListComponent;
  @ViewChild('tabset') tabset: TabsetComponent | null= null;
  private cdRef = inject(ChangeDetectorRef);

  constructor() {}

  ngOnInit(): void {
    this.onAdd();
    if(this.tabs.length > 0) {
      this.tabs[0].active = true;
    }
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
