import { Component } from '@angular/core';
import { FooterComponent } from '@coreui/angular';

@Component({
    selector: 'app-default-footer',
    templateUrl: './default-footer.component.html',
    styleUrls: ['./default-footer.component.scss'],
    standalone: true,
})
export class DefaultFooterComponent extends FooterComponent {
  currentYear: number = new Date().getFullYear();
  constructor() {
    super();
  }
}
