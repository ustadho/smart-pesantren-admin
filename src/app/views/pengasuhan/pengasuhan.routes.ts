import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'student-mapping',
    loadComponent: () => import('./mapping-asrama/asrama-student-mapping.component').then(m => m.AsramaStudentMappingComponent),
    data: {
      title: 'Absensi KBM',
    }
  },
  {
    path: 'jenis-kegiatan',
    loadComponent: () => import('./jenis-kegiatan/jenis-kegiatan.component').then(m => m.JenisKegiatanComponent),
    data: {
      title: 'Absensi KBM',
    }
  },
];
