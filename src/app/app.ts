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
          [mode]="vm.modes.nav ?? 'verbose'"
        ></ngx-structural-mfe>
      </aside>

      <header>
        <ngx-structural-mfe
          [mfeRemoteUrl]="vm.headerMfeRemoteUrl ?? ''"
          [mode]="vm.modes.header ?? 'full'"
        ></ngx-structural-mfe>
      </header>

      <main>
        <router-outlet />
      </main>

      <footer>
        <ngx-structural-mfe
          [mfeRemoteUrl]="vm.footerMfeRemoteUrl ?? ''"
          [mode]="vm.modes.footer ?? 'full'"
        ></ngx-structural-mfe>
      </footer>
    </div>
    }
  `,
  styles: [
    `
      :host {
        ngx-nav-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 2;
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
