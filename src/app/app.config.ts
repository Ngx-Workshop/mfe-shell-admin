import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideLocalStorageBroker } from '@tmdjr/ngx-local-storage-client';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(withFetch()),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    ...provideLocalStorageBroker({
      iframeUrl:
        'https://proxy.ngx-workshop.io/assets/ngx-broker/ngx-local-storage-broker.html',
      brokerOrigin: 'https://proxy.ngx-workshop.io',
      namespace: 'mfe-remotes',
      requestTimeoutMs: 3000,
    }),
  ],
};
