import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'organization',
    loadComponent: () => import('./organization/organization.component').then(m => m.OrganizationComponent),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: 'job-position',
    loadComponent: () => import('./job-position/job-position.component').then(m => m.JobPositionComponent),
    data: {
      title: 'Jabatan'
    }
  },
  {
    path: 'job-level',
    loadComponent: () => import('./job-level/job-level.component').then(m => m.JobLevelComponent),
    data: {
      title: 'Level Jabatan',
      defaultSort: 'level,asc',
    }
  },
];
