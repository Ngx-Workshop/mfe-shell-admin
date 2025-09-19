import {
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideLocalStorageBroker } from '@tmdjr/ngx-local-storage-client';
import {
  NGX_USER_METADATA_CONFIG,
  authInterceptor,
} from '@tmdjr/ngx-user-metadata';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([authInterceptor])
    ),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    ...provideLocalStorageBroker({
      iframeUrl:
        'https://beta.ngx-workshop.io/assets/ngx-broker/ngx-local-storage-broker.html',
      brokerOrigin: 'https://beta.ngx-workshop.io',
      namespace: 'mfe-remotes',
      requestTimeoutMs: 3000,
    }),
    // Configure the ngx-user-metadata package to redirect to sign-in page for demo
    {
      provide: NGX_USER_METADATA_CONFIG,
      useValue: {
        redirectUrl: 'https://auth.ngx-workshop.io/',
      },
    },
  ],
};
