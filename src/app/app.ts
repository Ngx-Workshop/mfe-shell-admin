import { Component } from '@angular/core';
import { NavBarComponent } from './components/nav-bar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'ngx-root',
  imports: [NavBarComponent, RouterOutlet],
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
  protected title = 'ngx-mfe-orchestrator-ui';
}
