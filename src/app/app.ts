import { Component } from '@angular/core';
import { DocumentComponent } from './components/document.component';
import { HeroComponent } from './components/hero.component';
import { NavBarComponent } from './components/nav-bar.component';

@Component({
  selector: 'ngx-root',
  imports: [NavBarComponent, HeroComponent, DocumentComponent],
  template: `
    <ngx-nav-bar></ngx-nav-bar>
    <main>
      <ngx-hero></ngx-hero>
      <ngx-document></ngx-document>
    </main>
  `,
  styles: [
    `
      main {
        margin-top: 56px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 3em;
        ngx-document {
          width: 100%;
          max-width: 800px;
        }
      }
      ngx-nav-bar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 2;
      }
    `,
  ],
})
export class App {
  protected title = 'ngx-mfe-orchestrator-ui';
}
