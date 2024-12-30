import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'student-mapping',
    loadComponent: () => import('./asrama-student/asrama-student-mapping.component').then(m => m.AsramaStudentMappingComponent),
    data: {
      title: 'Absensi KBM',
    }
  },
];
