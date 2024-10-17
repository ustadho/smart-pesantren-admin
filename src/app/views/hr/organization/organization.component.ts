import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeTableModule } from 'primeng/treetable';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
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
  coaTypes = [];
  currencies = [];

  @ViewChild(OrganizationListComponent)
  private listComponent?: OrganizationListComponent;

  constructor() {}

  ngOnInit(): void {
    this.onAdd();
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
    this.tabs[this.tabs.indexOf(tab) - 1].active = true;
    this.tabs.splice(this.tabs.indexOf(tab), 1);
  }

  refreshList(evt: any) {
    if(this.listComponent) {
      this.listComponent.findAll();
    }
  }
}
