import { Routes } from '@angular/router';
import { mfeRemoteResolver } from './resolvers/mfe-remote.resolver';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/mfe-remote-list',
    pathMatch: 'full',
  },
  {
    path: 'sign-in',
    loadComponent: () =>
      import('./routes/sign-in.component').then((m) => m.SignInComponent),
  },
  {
    path: 'mfe-remote-list',
    loadComponent: () =>
      import('./routes/mfe-remote-list.component').then(
        (m) => m.MfeRemoteListComponent
      ),
    resolve: {
      mfeRemotes: mfeRemoteResolver,
    },
  },
  {
    path: '**',
    loadComponent: () =>
      import('./routes/not-found.component').then((m) => m.NotFoundComponent),
  },
];
