import { Component, inject } from '@angular/core';
import { HeroComponent } from '../components/hero.component';
import { MfeRemoteComponent } from '../components/mfe-remote.component';
import { lastValueFrom } from 'rxjs';
import { IMfeRemote, MfeRemoteService } from '../services/mfe-remote.service';
import { AsyncPipe } from '@angular/common';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'ngx-mfe-remotes',
  imports: [HeroComponent, MfeRemoteComponent, AsyncPipe, MatCard],
  template: `
    <ngx-hero></ngx-hero>
    <mat-card appearance="outlined">
      @for (mfeRemote of mfeRemotes | async; track $index) {
      <ngx-mfe-remote
        [initialValue]="mfeRemote"
        (update)="updateMfeRemote($event)"
        (archive)="archiveMfeRemote($event)"
        (delete)="deleteMfeRemote($event)"
      ></ngx-mfe-remote>
      }
    </mat-card>
  `,
  styles: [
    `
      :host {
        margin-top: 56px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3em;

        mat-card {
          width: 100%;
          max-width: 800px;
          margin-bottom: 2em;
          padding: 1em;
          display: flex;
          flex-direction: column;
          gap: 1em;
        }
      }
    `,
  ],
})
export class MfeRemoteListComponent {
  mfeRemoteService = inject(MfeRemoteService);
  mfeRemotes = this.mfeRemoteService.mfeRemotes$;

  updateMfeRemote(remote: IMfeRemote) {
    lastValueFrom(this.mfeRemoteService.updateMfeRemote(remote));
  }

  archiveMfeRemote(remote: IMfeRemote) {
    lastValueFrom(this.mfeRemoteService.archiveMfeRemote(remote));
  }

  deleteMfeRemote(remote: IMfeRemote) {
    lastValueFrom(this.mfeRemoteService.deleteMfeRemote(remote));
  }
}
