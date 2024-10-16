import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'foundation',
    loadComponent: () => import('./foundation/foundation.component').then(m => m.FoundationComponent),
    data: {
      title: 'Page 404'
    }
  },
];
