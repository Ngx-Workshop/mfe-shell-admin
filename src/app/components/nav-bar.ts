import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { NgxThemePicker } from '@tmdjr/ngx-theme-picker';
import { map } from 'rxjs';
import { MfeRegistryService } from '../services/mfe-registry.service';

@Component({
  selector: 'ngx-nav-bar',
  imports: [MatIcon, MatButtonModule, NgxThemePicker, AsyncPipe, RouterLink],
  template: `
    <nav class="docs-navbar-header">
      @if(viewModel$ | async; as userJourneyRemotes) {
      <a mat-button routerLink="/">
        <mat-icon>connecting_airports</mat-icon>Ngx MFE Orchestrator
      </a>

      @for (remote of userJourneyRemotes; track $index) {
      <a mat-button [routerLink]="[remote.routeUrl]">
        {{ remote.routeUrl }}
      </a>
      }
      <div class="flex-spacer"></div>
      <ngx-theme-picker></ngx-theme-picker>
      }
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
export class NavBar {
  viewModel$ = inject(MfeRegistryService).userJourneyRemotes$.pipe(
    map((remotes) =>
      remotes.map((remote) => ({
        routeUrl: this.toSlug(remote.name),
        ...remote,
      }))
    )
  );
  toSlug(value: string): string {
    return value.trim().toLowerCase().replace(/\s+/g, '-');
  }
}
