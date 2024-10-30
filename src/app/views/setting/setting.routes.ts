import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'location',
    loadComponent: () => import('./location/location.component').then(m => m.LocationComponent),
    data: {
      title: 'Location',
      defaultSort: 'name,asc',
    }
  },
  {
    path: 'foundation',
    loadComponent: () => import('./foundation/foundation.component').then(m => m.FoundationComponent),
    data: {
      title: 'Foundation'
    }
  },
];
