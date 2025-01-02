import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'student-mapping',
    loadComponent: () => import('./mapping-asrama/asrama-student-mapping.component').then(m => m.AsramaStudentMappingComponent),
    data: {
      title: 'Absensi KBM',
    }
  },
];
