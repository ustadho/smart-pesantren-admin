import { Component } from '@angular/core';
import { WidgetDropdownComponent } from './widget-dropdown/widget-dropdown.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [WidgetDropdownComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
