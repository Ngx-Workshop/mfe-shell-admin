import { Component, inject } from '@angular/core';
import { HeroComponent } from '../components/hero.component';
import { MfeRemoteComponent } from '../components/mfe-remote.component';
import { lastValueFrom } from 'rxjs';
import { IMfeRemote, MfeRemoteService } from '../services/mfe-remote.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'ngx-mfe-remotes',
  imports: [HeroComponent, MfeRemoteComponent, AsyncPipe],
  template: `
    <ngx-hero></ngx-hero>
    @for (mfeRemote of mfeRemotes | async; track $index) {
    <ngx-mfe-remote
      [initialValue]="mfeRemote"
      (update)="updateMfeRemote($event)"
      (archive)="archiveMfeRemote($event)"
      (delete)="deleteMfeRemote($event)"
    ></ngx-mfe-remote>
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
  mfeRemoteService = inject(MfeRemoteService);
  mfeRemotes = this.mfeRemoteService.mfeRemotes$;

  updateMfeRemote(remote: IMfeRemote) {
    lastValueFrom(this.mfeRemoteService.updateMfeRemote(remote));
  }

  archiveMfeRemote(remote: IMfeRemote) {
    lastValueFrom(this.mfeRemoteService.archiveMfeRemote(remote));
  }

  deleteMfeRemote(remote: IMfeRemote) {
    console.log('deleteMfeRemote', remote);

    lastValueFrom(this.mfeRemoteService.deleteMfeRemote(remote));
  }
}
