import { Routes } from '@angular/router';
import { UserRouteAccessService } from '../../../app/core/auth/user-route-access-service';
import { ROLE_HR, ROLE_KESEHATAN, ROLE_PENDIDIKAN, ROLE_PENGASUHAN, ROLE_SUPERADMIN, ROLE_TU, ROLE_USTADZ } from '../../shared/constant/role.constant';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard.component').then(m => m.DashboardComponent),
    data: {
      // title: $localize`Dashboard`
      title: `Dashboard`,
      authorities: [ROLE_SUPERADMIN, ROLE_HR, ROLE_TU, ROLE_PENDIDIKAN, ROLE_PENGASUHAN, ROLE_USTADZ, ROLE_KESEHATAN],
    },
    canActivate: [UserRouteAccessService],
  }
];

