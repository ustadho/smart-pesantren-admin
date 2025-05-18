import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'att-log',
    loadComponent: () => import('./att-log/att-log.component').then(m => m.AttLogComponent),
    data: {
      title: 'Log Mesin'
    }
  },
  {
    path: 'holiday',
    loadComponent: () => import('./holiday/holiday.component').then(m => m.HolidayComponent),
    data: {
      title: 'Jam Kerja'
    }
  },
  {
    path: 'working-dayoff',
    loadComponent: () => import('./working-dayoff/working-dayoff.component').then(m => m.WorkingDayoffComponent),
    data: {
      title: 'Hari Herja'
    }
  },
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
