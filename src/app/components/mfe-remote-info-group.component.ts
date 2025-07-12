import { Component, input } from '@angular/core';
import { IMfeRemote } from '../services/mfe-remote.service';
import { MatIconButton } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'ngx-mfe-remote-info-group',
  imports: [DatePipe, MatIconButton, MatIcon, MatTooltip],
  template: `
    <div class="mfe-remote-info-group">
      <button mat-icon-button matTooltip="Hello I'm some info">
        <mat-icon>info</mat-icon>
      </button>
      <p>
        <span class="label">Last Updated:</span>
        <span class="value">{{ mfe().lastUpdated | date }}</span>
      </p>
      <p>
        <span class="label">Version:</span>
        <span class="value">{{ mfe().version }}</span>
      </p>
    </div>
  `,
  styles: [
    `
      :host {
        button {
          float: right;
          margin-left: 8px;
        }
        p {
          margin: 0.2em 0;
          display: flex;
          .label {
            font-weight: 600;
            text-align: right;
            min-width: 120px;
            margin-right: 8px;
          }
          .value {
            text-align: left;
            flex: 1;
          }
        }
      }
    `,
  ],
})
export class MfeRemoteInfoGroup {
  mfe = input.required<IMfeRemote>();
}
