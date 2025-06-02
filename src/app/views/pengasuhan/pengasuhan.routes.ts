import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'student-mapping',
    loadComponent: () => import('./mapping-asrama/asrama-student-mapping.component').then(m => m.AsramaStudentMappingComponent),
    data: {
      title: 'Mapping Santri - Asrama',
    }
  },
  {
    path: 'halaqoh-mapping',
    loadComponent: () => import('./mapping-halaqoh/halaqoh-mapping.component').then(m => m.HalaqohMappingComponent),
    data: {
      title: 'Mapping Santri - Halaqoh',
    }
  },
  {
    path: 'tahfidz-target',
    loadComponent: () => import('./tahfidz-target/tahfidz-target.component').then(m => m.TahfidzTargetComponent),
    data: {
      title: 'Target tahfidz',
    }
  },
  {
    path: 'tahfidz-konversi',
    loadComponent: () => import('./tahfidz-konversi/tahfidz-konversi.component').then(m => m.TahfidzKonversiComponent),
    data: {
      title: 'Konversi tahfidz',
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
    path: 'jenis-izin-santri',
    loadComponent: () => import('./jenis-izin/jenis-izin.component').then(m => m.JenisIzinComponent),
    data: {
      title: 'Jenis Izin',
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
