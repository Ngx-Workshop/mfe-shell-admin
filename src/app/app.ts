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
import { combineLatest, filter } from 'rxjs';
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
    @if(viewModel$ | async; as vm) {
    <div class="layout" [class.no-nav]="vm.modes.nav === 'disabled'">
      <aside class="nav">
        <ngx-structural-mfe
          class="nav-mfe"
          [mfeRemoteUrl]="vm.navigationMfeRemoteUrl ?? ''"
          [mode]="vm.modes.nav ?? 'disabled'"
        ></ngx-structural-mfe>
      </aside>

      <header>
        <ngx-structural-mfe
          [mfeRemoteUrl]="vm.headerMfeRemoteUrl ?? ''"
          [mode]="vm.modes.header ?? 'disabled'"
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
      .layout {
        display: grid;
        grid-template-columns: 110px 1fr;
        grid-template-rows: auto 1fr auto;
        grid-template-areas:
          'nav header'
          'nav main'
          'nav footer';
        min-height: 100dvh;
        height: 100dvh;
      }
      .nav {
        grid-area: nav;
        overflow: hidden;
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
      }
      footer {
        grid-area: footer;
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
  private registry = inject(MfeRegistryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected viewModel$ = combineLatest({
    userJourneyRemotes: this.registry.userJourneyRemotes$,
    headerMfeRemoteUrl: this.registry.headerRemoteUrl$,
    footerMfeRemoteUrl: this.registry.footerRemoteUrl$,
    navigationMfeRemoteUrl: this.registry.navigationRemoteUrl$,
    modes: this.registry.structuralModes$,
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
        while (current && current.firstChild) {
          current = current.firstChild;
        }
        const overrides = current?.snapshot.data?.['structuralOverrides'];
        this.registry.setStructuralMode(overrides ? overrides : {});
      });
  }
}
