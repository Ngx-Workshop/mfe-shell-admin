import { Component } from '@angular/core';
import { HeroComponent } from '../components/hero.component';
import { DocumentComponent } from '../components/document.component';

@Component({
  selector: 'ngx-mfe-remotes',
  imports: [HeroComponent, DocumentComponent],
  template: `
    <ngx-hero></ngx-hero>
    <ngx-document></ngx-document>
  `,
  styles: [
    `
      :host {
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
    `,
  ],
})
export class MfeRemoteListComponent {
  // This component can be expanded with a sign-in form and logic
  // For now, it serves as a placeholder for the sign-in route
}
