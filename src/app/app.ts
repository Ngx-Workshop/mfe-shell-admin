import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { RouterOutlet } from '@angular/router';
import { NavBar } from './components/nav-bar';
import { MfeRegistryService } from './services/mfe-registry.service';

@Component({
  selector: 'ngx-root',
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
  imports: [NavBar, RouterOutlet, AsyncPipe],
  template: `
    @if(viewModel$ | async; as vm) {
    <ngx-nav-bar></ngx-nav-bar>
    <main>
      <router-outlet></router-outlet>
    </main>
    } @else {
    <p>Loading...</p>
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
  protected viewModel$ = this.registry.userJourneyRemotes$;
}
