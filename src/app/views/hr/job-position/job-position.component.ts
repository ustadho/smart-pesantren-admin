import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { JobPositionEditComponent } from './job-position-edit/job-position-edit.component';
import { JobPositionListComponent } from './job-position-list/job-position-list.component';
import { ITab } from '../../../domain/model/tab.model';
import { TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-position',
  standalone: true,
  imports: [CommonModule, TabsModule, JobPositionListComponent, JobPositionEditComponent],
  templateUrl: './job-position.component.html',
  styleUrl: './job-position.component.scss',
  providers: []
})
export class JobPositionComponent implements OnInit, AfterViewInit{
  tabs: ITab[] = [];

  @ViewChild(JobPositionListComponent)
  private listComponent?: JobPositionListComponent;

  @ViewChild('tabset', { static: false }) tabset?: TabsetComponent;
  private cdRef = inject(ChangeDetectorRef);

  constructor() {}

  ngOnInit(): void {
    this.onAdd();
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
      data: null,
      index: newTabIndex,
    });
    this.tabs[0].active = true;
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
