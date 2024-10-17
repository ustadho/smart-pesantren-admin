import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'organization',
    loadComponent: () => import('./organization/organization.component').then(m => m.OrganizationComponent),
    data: {
      title: 'Page 404'
    }
  },
];
