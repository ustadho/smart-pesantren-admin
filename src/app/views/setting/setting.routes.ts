import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'academic-year',
    loadComponent: () => import('./academic-year/academic-year.component').then(m => m.AcademicYearComponent),
    data: {
      title: 'Tahun Akademik',
      defaultSort: 'code,desc',
    }
  },
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
