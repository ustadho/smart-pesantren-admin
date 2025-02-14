import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'user-profile',
    loadComponent: () => import('./user-profile/user-profile.component').then(m => m.UserProfileComponent),
    data: {
      title: 'User Profile',
    }
  },
];
