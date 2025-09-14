import { Routes } from '@angular/router';
import { userAuthenticatedGuard } from '@tmdjr/ngx-user-metadata';
import { mfeRemoteResolver } from './resolvers/mfe-remote.resolver';

export const routes: Routes = [
  {
    path: '',
    canActivate: [userAuthenticatedGuard],
    children: [
      { path: '', redirectTo: 'list-mfe-remotes', pathMatch: 'full' },
      {
        path: 'list-mfe-remotes',
        loadComponent: () =>
          import('./routes/list-mfe-remotes').then((m) => m.ListMfeRemotes),
        resolve: { mfeRemotes: mfeRemoteResolver },
      },
      {
        path: '**',
        loadComponent: () =>
          import('./routes/not-found').then((m) => m.NotFound),
      },
    ],
  },
];
