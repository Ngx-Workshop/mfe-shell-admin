import { loadRemoteModule } from '@angular-architects/module-federation';
import { Routes } from '@angular/router';
import { userAuthenticatedGuard } from '@tmdjr/ngx-user-metadata';

export const routes: Routes = [
  {
    path: '',
    canActivate: [userAuthenticatedGuard],
    children: [
      { path: '', redirectTo: 'mfe-orchestrator', pathMatch: 'full' },
      {
        path: 'mfe-orchestrator',
        loadChildren: () =>
          loadRemoteModule({
            type: 'module',
            remoteEntry:
              '/remotes/mfe-user-journey-admin-mfe-orchestrator/remoteEntry.js',
            exposedModule: './Routes',
          }).then((m) => m.Routes),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./routes/not-found').then((m) => m.NotFound),
  },
];
