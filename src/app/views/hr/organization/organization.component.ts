import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeTableModule } from 'primeng/treetable';
import { CommonModule } from '@angular/common';
import { TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { OrganizationListComponent } from './organization-list/organization-list.component';
import { ITab } from '../../../domain/model/tab.model';
import { OrganizationEditComponent } from './organization-edit/organization-edit.component';
import { OrganizationService } from '../../../domain/service/organization.service';

@Component({
  selector: 'app-organization',
  standalone: true,
  imports: [
    CommonModule,
    TabsModule,
    OrganizationListComponent,
    OrganizationEditComponent,
  ],
  templateUrl: './organization.component.html',
  styleUrl: './organization.component.scss',
})
export class OrganizationComponent implements OnInit {
  tabs: ITab[] = [];

  @ViewChild(OrganizationListComponent)
  private listComponent?: OrganizationListComponent;

  @ViewChild('tabset', { static: false }) tabset?: TabsetComponent;

  constructor() {}

  ngOnInit(): void {
    this.onAdd(null);
  }

  onAdd(d: any) {
    const newTabIndex = this.tabs.length;
    this.tabs.push({
      title: `Data Baru`,
      content: ``,
      disabled: false,
      removable: true,
      data: {
        code: d == null? null: d.code,
        parentId: d == null? null: d.parentId,
      },
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
      this.listComponent.findAll();
    }
  }

  refreshList(evt: any) {
    if(this.listComponent) {
      this.listComponent.findAll();
    }
  }
}
