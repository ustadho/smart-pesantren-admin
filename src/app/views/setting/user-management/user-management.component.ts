import { Component, ViewChild } from '@angular/core';
import { ITab } from 'src/app/domain/model/tab.model';
import { UserManagementListComponent } from './user-management-list/user-management-list.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CommonModule } from '@angular/common';
import { UserManagementEditComponent } from './user-management-edit/user-management-edit.component';
import { USER_PROFILE } from 'src/app/shared/constant/user-profile.constant';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule, TabsModule, UserManagementListComponent, UserManagementEditComponent
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent {
  tabs: ITab[] = [];
  profiles = [
    {id: USER_PROFILE.SYSADMIN, name: 'SYSADMIN' },
    {id: USER_PROFILE.EMPLOYEE, name: 'PEGAWAI' },
    {id: USER_PROFILE.GUARDIAN, name: 'WALISANTRI' },
  ]
  @ViewChild(UserManagementListComponent)
  private listComponent?: UserManagementListComponent;

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
        title: `Edit - ${data.login}`,
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
