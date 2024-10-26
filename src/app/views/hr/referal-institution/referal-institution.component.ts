import { Component, OnInit, ViewChild } from '@angular/core';
import { ReferalInstitutionListComponent} from './referal-institution-list/referal-institution-list.component'
import { ReferalInstitutionEditComponent} from './referal-institution-edit/referal-institution-edit.component'
import { ITab } from '../../../domain/model/tab.model'
import { TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-referal-institution',
  standalone: true,
  imports: [CommonModule, TabsModule, ReferalInstitutionListComponent, ReferalInstitutionEditComponent],
  templateUrl: './referal-institution.component.html',
  styleUrl: './referal-institution.component.scss'
})
export class ReferalInstitutionComponent implements OnInit{
  tabs: ITab[] = [];

  @ViewChild(ReferalInstitutionListComponent)
  private listComponent?: ReferalInstitutionListComponent;

  @ViewChild('tabset', { static: false }) tabset?: TabsetComponent;

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

