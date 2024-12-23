import { Routes } from '@angular/router';
import { ROLE_SUPERADMIN } from '../../shared/constant/role.constant';
import { UserRouteAccessService } from '../../core/auth/user-route-access-service';

export const routes: Routes = [
  {
    path: 'user-management',
    loadComponent: () => import('./user-management/user-management.component').then(m => m.UserManagementComponent),
    data: {
      title: 'Kelola Pengguna',
      defaultSort: 'login,asc',
      authorities: [ROLE_SUPERADMIN],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'academic-year',
    loadComponent: () => import('./academic-year/academic-year.component').then(m => m.AcademicYearComponent),
    data: {
      title: 'Tahun Akademik',
      defaultSort: 'code,desc',
      authorities: [ROLE_SUPERADMIN],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'student-category',
    loadComponent: () => import('./student-category/student-category.component').then(m => m.StudentCategoryComponent),
    data: {
      title: 'Kategori Santri',
      defaultSort: 'name,asc',
      authorities: [ROLE_SUPERADMIN],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'class-level',
    loadComponent: () => import('./class-level/class-level.component').then(m => m.ClassLevelComponent),
    data: {
      title: 'Level Kelas',
      defaultSort: 'level,asc',
      authorities: [ROLE_SUPERADMIN],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'curriculum',
    loadComponent: () => import('./curriculum/curriculum.component').then(m => m.CurriculumComponent),
    data: {
      title: 'Kurikulum',
      defaultSort: 'startYear,desc',
      authorities: [ROLE_SUPERADMIN],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'institution',
    loadComponent: () => import('./institution/institution.component').then(m => m.InstitutionComponent),
    data: {
      title: 'Lembaga Pendidikan',
      defaultSort: 'name,asc',
      authorities: [ROLE_SUPERADMIN],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'asrama',
    loadComponent: () => import('./asrama/asrama.component').then(m => m.AsramaComponent),
    data: {
      title: 'Asrama',
      defaultSort: 'name,asc',
      authorities: [ROLE_SUPERADMIN],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'building',
    loadComponent: () => import('./building/building.component').then(m => m.BuildingComponent),
    data: {
      title: 'Gedung',
      defaultSort: 'name,asc',
      authorities: [ROLE_SUPERADMIN],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'location',
    loadComponent: () => import('./location/location.component').then(m => m.LocationComponent),
    data: {
      title: 'Location',
      defaultSort: 'name,asc',
      authorities: [ROLE_SUPERADMIN],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'foundation',
    loadComponent: () => import('./foundation/foundation.component').then(m => m.FoundationComponent),
    data: {
      title: 'Foundation',
      authorities: [ROLE_SUPERADMIN],
    },
    canActivate: [UserRouteAccessService],
  },
];
