import { Component, inject } from '@angular/core';
import { HeroComponent } from '../components/hero.component';
import { MfeRemoteComponent } from '../components/mfe-remote.component';
import { tap } from 'rxjs';
import { MfeRemoteService } from '../services/mfe-remote.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'ngx-mfe-remotes',
  imports: [HeroComponent, MfeRemoteComponent, AsyncPipe],
  template: `
    <ngx-hero></ngx-hero>
    @for (mfeRemote of mfeRemotes | async; track $index) {
    <ngx-mfe-remote [mfeRemote]="mfeRemote"></ngx-mfe-remote>
    }
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
        ngx-mfe-remote {
          width: 100%;
          max-width: 800px;
        }
      }
    `,
  ],
})
export class MfeRemoteListComponent {
  mfeRemotes = inject(MfeRemoteService).mfeRemotes$.pipe(
    tap((remotes) => {
      console.log('Fetched MFE remotes:', remotes);
    })
  );
}
