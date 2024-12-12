import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'presence',
    loadComponent: () => import('./presence-kbm/presence-kbm.component').then(m => m.PresenceKbmComponent),
    data: {
      title: 'Absensi KBM',
    }
  },
];
