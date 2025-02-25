import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { ITab } from '../../../domain/model/tab.model';
import { AsramaListComponent } from './asrama-list/asrama-list.component';
import { TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { CommonModule } from '@angular/common';
import { AsramaEditComponent } from './asrama-edit/asrama-edit.component';
import { LocationService } from '../../../domain/service/location.service';
import { PesantrenService } from '../../../domain/service/pesantren.service';

@Component({
  selector: 'app-asrama',
  standalone: true,
  imports: [CommonModule, TabsModule, AsramaListComponent, AsramaEditComponent],
  templateUrl: './asrama.component.html',
  styleUrl: './asrama.component.scss'
})
export class AsramaComponent implements OnInit, AfterViewInit {
  tabs: ITab[] = [];
  locations: any[] =[]
  pesantrens: any[] =[]
  @ViewChild('tabset') tabset: TabsetComponent | null= null;
  @ViewChild(AsramaListComponent)
  private listComponent?: AsramaListComponent;
  private cdRef = inject(ChangeDetectorRef);

  constructor(
    private locationService: LocationService,
    private pesantrenService: PesantrenService,
    ) {}

  ngOnInit(): void {
    this.onAdd();
    this.locationService.findAll('').subscribe(res => {
      this.locations = res.body
    })
    this.pesantrenService.findAll('').subscribe(res => {
      this.pesantrens = res.body
    })
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
