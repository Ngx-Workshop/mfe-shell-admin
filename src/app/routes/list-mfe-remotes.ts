import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { Hero } from '../components/hero';
import { MfeRemote } from '../components/mfe-remote-card';
import { ApiMfeRemotes } from '../services/api-mfe-remotes';

import type { MfeRemoteDto } from '@tmdjr/ngx-mfe-orchestrator-contracts';

@Component({
  selector: 'ngx-mfe-remotes',
  imports: [Hero, MfeRemote, AsyncPipe, MatCard],
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
          padding: 1.7em;
          display: flex;
          flex-direction: column;
          gap: 1.7em;
        }
      }
    `,
  ],
})
export class ListMfeRemotes {
  dialog = inject(MatDialog);
  apiMfeRemotes = inject(ApiMfeRemotes);
  mfeRemotes = this.apiMfeRemotes.mfeRemotes$;

  updateMfeRemote(remote: MfeRemoteDto) {
    lastValueFrom(this.apiMfeRemotes.updateMfeRemote(remote));
  }

  archiveMfeRemote(remote: MfeRemoteDto) {
    lastValueFrom(this.apiMfeRemotes.archiveMfeRemote(remote));
  }

  deleteMfeRemote(remote: MfeRemoteDto) {
    lastValueFrom(this.apiMfeRemotes.deleteMfeRemote(remote));
  }
}
