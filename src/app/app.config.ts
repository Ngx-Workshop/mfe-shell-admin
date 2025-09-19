import {
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { provideLocalStorageBroker } from '@tmdjr/ngx-local-storage-client';
import { ThemePickerService } from '@tmdjr/ngx-theme-picker';
import {
  authInterceptor,
  NGX_USER_METADATA_CONFIG,
} from '@tmdjr/ngx-user-metadata';
import { firstValueFrom, tap } from 'rxjs';
import { routes } from './app.routes';
import { MfeRegistryService } from './services/mfe-registry.service';

function initializerFn() {
  const mfeRegistryService = inject(MfeRegistryService);
  const router = inject(Router);
  return firstValueFrom(
    mfeRegistryService
      .loadMfeRemotes()
      .pipe(
        tap(() => mfeRegistryService.registerUserJourneyRoutes(router, routes))
      )
  );
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(initializerFn),
    provideAppInitializer(() => {
      inject(ThemePickerService);
    }),
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
