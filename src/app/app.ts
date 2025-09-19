import { Component } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { RouterOutlet } from '@angular/router';
import { NavBar } from './components/nav-bar';

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
export class App {}
