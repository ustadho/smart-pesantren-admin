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
      title: 'Jenis Kegiatan',
    }
  },
  {
    path: 'jenis-prestasi',
    loadComponent: () => import('./jenis-prestasi/jenis-prestasi.component').then(m => m.JenisPrestasiComponent),
    data: {
      title: 'Jenis Prestasi',
    }
  },
  {
    path: 'jenis-pelanggaran',
    loadComponent: () => import('./jenis-pelanggaran/jenis-pelanggaran.component').then(m => m.JenisPelanggaranComponent),
    data: {
      title: 'Jenis Pelanggaran',
    }
  },
  {
    path: 'tugas-kepengasuhan',
    loadComponent: () => import('./tugas-kepengasuhan/tugas-kepengasuhan.component').then(m => m.TugasKepengasuhanComponent),
    data: {
      title: 'Tugas Kepengasuhan',
    }
  },
];
