import { Component } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { RouterOutlet } from '@angular/router';
import { NavBar } from './components/nav-bar';
import { ApiMfeRemotes } from './services/api-mfe-remotes';

@Component({
  selector: 'ngx-root',
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
  imports: [NavBar, RouterOutlet],
  template: `
    <ngx-nav-bar></ngx-nav-bar>
    <main>
      <router-outlet></router-outlet>
    </main>
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
  constructor(private apiMfeRemotes: ApiMfeRemotes) {
    // Initialize the service to fetch MFE remotes on app start
    // this.apiMfeRemotes.testAuthEndpoint().subscribe();
  }
}
