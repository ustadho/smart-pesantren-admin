import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'src/app/core/auth/user-route-access-service';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard.component').then(m => m.DashboardComponent),
    data: {
      // title: $localize`Dashboard`
      title: `Dashboard`,
      authorities: ['ROLE_SUPERADMIN'],
    },
    canActivate: [UserRouteAccessService],
  }
];

