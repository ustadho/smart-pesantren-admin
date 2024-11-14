import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'user-management',
    loadComponent: () => import('./user-management/user-management.component').then(m => m.UserManagementComponent),
    data: {
      title: 'Kelola Pengguna',
      defaultSort: 'login,asc',
    }
  },
  {
    path: 'academic-year',
    loadComponent: () => import('./academic-year/academic-year.component').then(m => m.AcademicYearComponent),
    data: {
      title: 'Tahun Akademik',
      defaultSort: 'code,desc',
    }
  },
  {
    path: 'student-category',
    loadComponent: () => import('./student-category/student-category.component').then(m => m.StudentCategoryComponent),
    data: {
      title: 'Kategori Santri',
      defaultSort: 'name,asc',
    }
  },
  {
    path: 'class-level',
    loadComponent: () => import('./class-level/class-level.component').then(m => m.ClassLevelComponent),
    data: {
      title: 'Level Kelas',
      defaultSort: 'level,asc',
    }
  },
  {
    path: 'curriculum',
    loadComponent: () => import('./curriculum/curriculum.component').then(m => m.CurriculumComponent),
    data: {
      title: 'Kurikulum',
      defaultSort: 'startYear,desc',
    }
  },
  {
    path: 'institution',
    loadComponent: () => import('./institution/institution.component').then(m => m.InstitutionComponent),
    data: {
      title: 'Lembaga Pendidikan',
      defaultSort: 'name,asc',
    }
  },
  {
    path: 'location',
    loadComponent: () => import('./location/location.component').then(m => m.LocationComponent),
    data: {
      title: 'Location',
      defaultSort: 'name,asc',
    }
  },
  {
    path: 'foundation',
    loadComponent: () => import('./foundation/foundation.component').then(m => m.FoundationComponent),
    data: {
      title: 'Foundation'
    }
  },
];
