import { Component, OnInit, ViewChild } from '@angular/core';
import { ITab } from '../../../domain/model/tab.model';
import { BuildingListComponent } from './building-list/building-list.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CommonModule } from '@angular/common';
import { BuildingEditComponent } from './building-edit/building-edit.component';
import { LocationService } from '../../../domain/service/location.service';

@Component({
  selector: 'app-building',
  standalone: true,
  imports: [CommonModule, TabsModule, BuildingListComponent, BuildingEditComponent],
  templateUrl: './building.component.html',
  styleUrl: './building.component.scss'
})
export class BuildingComponent implements OnInit {
  tabs: ITab[] = [];
  locations: any[] =[]

  @ViewChild(BuildingListComponent)
  private listComponent?: BuildingListComponent;

  constructor(
    private locationService: LocationService,
    ) {}

  ngOnInit(): void {
    this.onAdd();
    this.locationService.findAll('').subscribe(res => {
      this.locations = res.body
    })
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
