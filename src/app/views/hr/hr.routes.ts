import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'section',
    loadComponent: () => import('./section/section.component').then(m => m.SectionComponent),
    data: {
      title: 'Bagian'
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
    path: 'organization',
    loadComponent: () => import('./organization/organization.component').then(m => m.OrganizationComponent),
    data: {
      title: 'Unit Organisasi'
    }
  },
  {
    path: 'job-position',
    loadComponent: () => import('./job-position/job-position.component').then(m => m.JobPositionComponent),
    data: {
      title: 'Jabatan',
      defaultSort: 'name,asc',
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
  {
    path: 'referal-institution',
    loadComponent: () => import('./referal-institution/referal-institution.component').then(m => m.ReferalInstitutionComponent),
    data: {
      title: 'Kategory Pegawai',
      defaultSort: 'name,asc',
    }
  },
  {
    path: 'employee-category',
    loadComponent: () => import('./employee-category/employee-category.component').then(m => m.EmployeeCategoryComponent),
    data: {
      title: 'Kategory Pegawai',
      defaultSort: 'code,asc',
    }
  },
];
