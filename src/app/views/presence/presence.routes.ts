import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'working-calendar',
    loadComponent: () => import('./working-schedule/working-schedule.component').then(m => m.WorkingScheduleComponent),
    data: {
      title: 'Jam Kerja'
    }
  },
  {
    path: 'working-hour',
    loadComponent: () => import('./working-hour/working-hour.component').then(m => m.WorkingHourComponent),
    data: {
      title: 'Jam Kerja'
    }
  },
  {
    path: 'working-time',
    loadComponent: () => import('./working-time/working-time.component').then(m => m.WorkingTimeComponent),
    data: {
      title: 'Jam Absen'
    }
  },
];
