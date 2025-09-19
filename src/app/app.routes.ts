import { Routes } from '@angular/router';
import { userAuthenticatedGuard } from '@tmdjr/ngx-user-metadata';

export const routes: Routes = [
  {
    path: '',
    canActivate: [userAuthenticatedGuard],
    children: [],
  },
  {
    path: '**',
    loadComponent: () => import('./routes/not-found').then((m) => m.NotFound),
  },
];
