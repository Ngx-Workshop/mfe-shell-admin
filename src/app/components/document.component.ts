import { Component, inject } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MfeRemoteService } from '../services/mfe-remote.service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { tap } from 'rxjs';

@Component({
  selector: 'ngx-document',
  imports: [MatCard, MatCardContent, AsyncPipe, JsonPipe],
  template: `
    <mat-card appearance="outlined">
      <mat-card-content>
        <pre>
          <code>
            {{ mfeRemotes | async | json }}
          </code>
        </pre>
      </mat-card-content>
    </mat-card>
  `,
})
export class DocumentComponent {
  mfeRemotes = inject(MfeRemoteService).mfeRemotes$.pipe(
    tap((remotes) => {
      console.log('Fetched MFE remotes:', remotes);
    })
  );
}
