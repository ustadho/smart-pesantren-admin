import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'guardian',
    loadComponent: () => import('./guardian/guardian.component').then(m => m.GuardianComponent),
    data: {
      title: 'Wali Santri',
      defaultSort: 'name,asc',
    }
  },
];
