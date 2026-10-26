import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { NgxUserMetadataService } from '@tmdjr/ngx-user-metadata';
import { WorkshopLogger } from '@tmdjr/ngx-workshop-logger';
import { combineLatest, filter, map } from 'rxjs';
import { StructuralMfeComponent } from './components/structural-mfe';
import { MfeRegistryService } from './services/mfe-registry.service';

@Component({
  selector: 'ngx-root',
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
  imports: [RouterOutlet, MatButtonModule, AsyncPipe, StructuralMfeComponent],
  template: `
    @if (viewModel$ | async; as vm) {
      <div
        class="layout"
        [class.no-nav]="vm.modes.nav === 'disabled'"
        [attr.data-nav-mode]="vm.modes.nav"
      >
        <aside class="nav">
          <ngx-structural-mfe
            class="nav-mfe"
            [role]="vm.role ?? 'none'"
            [mfeRemoteUrl]="vm.navigationMfeRemoteUrl ?? ''"
            [mode]="vm.modes.nav ?? 'disabled'"
          ></ngx-structural-mfe>
        </aside>

        <header>
          <ngx-structural-mfe
            [mfeRemoteUrl]="vm.headerMfeRemoteUrl ?? ''"
            [mode]="vm.modes.header ?? 'disabled'"
            [role]="vm.role ?? 'none'"
          ></ngx-structural-mfe>
        </header>

        <main>
          <router-outlet />
        </main>

        <footer>
          <ngx-structural-mfe
            [mfeRemoteUrl]="vm.footerMfeRemoteUrl ?? ''"
            [mode]="vm.modes.footer ?? 'disabled'"
          ></ngx-structural-mfe>
        </footer>
      </div>
    }
  `,
  styles: [
    `
      .layout[data-nav-mode='full'] {
        --ngx-rail-width: 176px;
      }
      .layout[data-nav-mode='relaxed'] {
        --ngx-rail-width: 136px;
      }
      .layout[data-nav-mode='compact'] {
        --ngx-rail-width: 88px;
      }
      .layout {
        display: grid;
        grid-template-columns: var(--ngx-rail-width, 176px) minmax(0, 1fr);
        grid-template-rows: auto 1fr auto;
        grid-template-areas:
          'nav header'
          'nav main'
          'nav footer';
      }
      .nav {
        grid-area: nav;
        inline-size: var(--ngx-rail-width, 176px);
        position: fixed;
        top: 0;
        height: 100dvh;
        z-index: 2;
      }
      header {
        grid-area: header;
        position: sticky;
        top: 0;
        z-index: 3;
      }
      main {
        grid-area: main;
        min-inline-size: 0;
      }
      footer {
        grid-area: footer;
      }
      @media (max-width: 720px) {
        .layout {
          grid-template-columns: minmax(0, 1fr);
          grid-template-rows: auto auto 1fr auto;
          grid-template-areas: 'nav' 'header' 'main' 'footer';
          height: auto;
          min-height: 100dvh;
        }
        .nav {
          position: relative;
          inline-size: 100%;
          height: auto;
        }
      }
      /* Collapse to a single-column layout when the nav MFE is hidden or not rendered */
      .layout.no-nav {
        grid-template-columns: 1fr;
        grid-template-areas:
          'header'
          'main'
          'footer';
        .nav {
          display: none;
        }
      }
    `,
  ],
})
export class App {
  private metadata = inject(NgxUserMetadataService);
  private registry = inject(MfeRegistryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private readonly logger = inject(WorkshopLogger);

  protected viewModel$ = combineLatest({
    userJourneyRemotes: this.registry.userJourneyRemotes$,
    headerMfeRemoteUrl: this.registry.headerRemoteUrl$,
    footerMfeRemoteUrl: this.registry.footerRemoteUrl$,
    navigationMfeRemoteUrl: this.registry.navigationRemoteUrl$,
    modes: this.registry.structuralModes$,
    role: this.metadata.userMetadata$.pipe(map((m) => m?.role)),
  });

  constructor() {
    this.router.events
      .pipe(
        takeUntilDestroyed(),
        filter((e): e is NavigationEnd => e instanceof NavigationEnd)
      )
      .subscribe(() => {
        // find deepest active route
        let current = this.route.firstChild;
        // while (current && current.firstChild) {
        //   current = current.firstChild;
        // }
        const overrides = current?.snapshot.data?.['structuralOverrides'];
        this.logger.info('App', {
          message: 'Settting structural overrides',
          data: current?.snapshot.data,
        });
        this.registry.setStructuralMode(overrides ? overrides : {});
      });
  }
}
