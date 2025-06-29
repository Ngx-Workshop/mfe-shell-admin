import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ThemePickerComponent } from './theme-picker.component';

@Component({
  selector: 'ngx-nav-bar',
  imports: [MatIcon, MatButtonModule, ThemePickerComponent],
  template: `
    <nav class="docs-navbar-header">
      <a mat-button routerLink="/">
        <mat-icon>connecting_airports</mat-icon>Ngx MFE Orchestrator
      </a>
      <div class="flex-spacer"></div>
      <ngx-theme-picker></ngx-theme-picker>
    </nav>
  `,
  styles: [
    `
      :host {
        color: var(--mat-sys-on-primary-container);
        background-color: var(--mat-sys-primary-container);
        box-shadow: var(--mat-sys-level5);
        .docs-navbar-header {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          padding: 0.5em 1em;
          mat-icon {
            font-size: 2rem;
            width: 2rem;
            height: 2rem;
            margin: 0 0.1em 0.1875em 0;
            vertical-align: middle;
          }
        }
      }
    `,
  ],
})
export class NavBarComponent {}
