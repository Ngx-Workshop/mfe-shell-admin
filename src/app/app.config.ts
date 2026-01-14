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
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { NGX_EDITORJS_OPTIONS } from '@tmdjr/ngx-editor-js2';
import { NgxEditorJs2BlockquotesComponent } from '@tmdjr/ngx-editor-js2-blockquotes';
import { NgxEditorJs2CodemirrorComponent } from '@tmdjr/ngx-editor-js2-codemirror';
import { NgxEditorJs2ImageComponent } from '@tmdjr/ngx-editor-js2-image';
import { NgxEditorJs2MermaidjsComponent } from '@tmdjr/ngx-editor-js2-mermaidjs';
import { NgxEditorJs2MfeLoaderComponent } from '@tmdjr/ngx-editor-js2-mfe-loader';
import { NgxEditorJs2PanelComponent } from '@tmdjr/ngx-editor-js2-panel';
import { NgxEditorJs2PopQuizComponent } from '@tmdjr/ngx-editor-js2-pop-quiz';
import { provideLocalStorageBroker } from '@tmdjr/ngx-local-storage-client';
import { ThemePickerService } from '@tmdjr/ngx-theme-picker';
import {
  authInterceptor,
  NGX_USER_METADATA_CONFIG,
} from '@tmdjr/ngx-user-metadata';
import { firstValueFrom, forkJoin, tap } from 'rxjs';
import { routes } from './app.routes';
import { MfeRegistryService } from './services/mfe-registry.service';
import { NavigationalListService } from './services/navigational-list.service';

function initializerFn() {
  const mfeRegistryService = inject(MfeRegistryService);
  const navigationalListService = inject(NavigationalListService);
  const router = inject(Router);
  return firstValueFrom(
    forkJoin([
      navigationalListService.getMenuHierarchy$('ADMIN'),
      mfeRegistryService
        .loadMfeRemotes()
        .pipe(
          tap(() =>
            mfeRegistryService.registerUserJourneyRoutes(router, routes)
          )
        ),
    ])
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
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        backdropClass: 'blur-backdrop',
      },
    },
    {
      provide: NGX_EDITORJS_OPTIONS,
      useValue: {
        consumerSupportedBlocks: [
          {
            name: 'MermaidJs',
            component: NgxEditorJs2MermaidjsComponent,
            componentInstanceName: 'NgxEditorJs2MermaidjsComponent',
          },
          {
            name: 'Panel',
            component: NgxEditorJs2PanelComponent,
            componentInstanceName: 'NgxEditorJs2PanelComponent',
          },
          {
            name: 'Image',
            component: NgxEditorJs2ImageComponent,
            componentInstanceName: 'NgxEditorJs2ImageComponent',
          },
          {
            name: 'Blockquote',
            component: NgxEditorJs2BlockquotesComponent,
            componentInstanceName: 'NgxEditorJs2BlockquotesComponent',
          },
          {
            name: 'Codemirror',
            component: NgxEditorJs2CodemirrorComponent,
            componentInstanceName: 'NgxEditorJs2CodemirrorComponent',
          },
          {
            name: 'Pop Quiz',
            component: NgxEditorJs2PopQuizComponent,
            componentInstanceName: 'NgxEditorJs2PopQuizComponent',
          },
          {
            name: 'MFE Loader',
            component: NgxEditorJs2MfeLoaderComponent,
            componentInstanceName: 'NgxEditorJs2MfeLoaderComponent',
          },
        ],
      },
    },
  ],
};
