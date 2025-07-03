import { Component, inject, input, output } from '@angular/core';
import { IMfeRemote } from '../services/mfe-remote.service';
import { MatCardModule } from '@angular/material/card';
import { MatButton, MatIconButton } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { MfeFormComponent } from './mfe-form.component';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom, tap } from 'rxjs';
import { ConfirmDeleteDialog } from './confirm-delete-dialog.component';

@Component({
  selector: 'ngx-mfe-remote-info-group',
  imports: [DatePipe],
  template: `
    <div class="mfe-remote-info-group">
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

@Component({
  selector: 'ngx-mfe-remote',
  imports: [
    MatCardModule,
    MatButton,
    MatIconButton,
    MatIcon,
    MfeFormComponent,
    MfeRemoteInfoGroup,
  ],
  template: `
    @if (initialValue(); as mfe) {
    <mat-card appearance="filled">
      <mat-card-header>
        <button mat-icon-button><mat-icon>info</mat-icon></button>
        <div class="flex-spacer"></div>
        <ngx-mfe-remote-info-group
          [mfe]="initialValue()"
        ></ngx-mfe-remote-info-group>
      </mat-card-header>
      <mat-card-content>
        <ngx-mfe-form
          [initialValue]="initialValue()"
          (formStatus)="disableUpdateButton = $event !== 'VALID'"
          (valueChange)="mfeRemote = $event"
        ></ngx-mfe-form>
      </mat-card-content>
      <mat-card-actions>
        <button matIconButton (click)="deleteRemote()">
          <mat-icon class="delete">delete</mat-icon>
        </button>
        <div class="flex-spacer"></div>
        <button
          matButton
          (click)="updateRemote()"
          [disabled]="disableUpdateButton"
        >
          Update
        </button>
        <button matButton (click)="archiveRemote()">
          {{ mfe.archived ? 'Archived' : 'Archive' }}
        </button>
      </mat-card-actions>
    </mat-card>
    }
  `,
  styles: [
    `
      :host {
        mat-card-content {
          display: flex;
          flex-direction: column;
        }
        mat-card-header,
        mat-card-actions {
          display: flex;
          flex-direction: row;
          margin-bottom: 1em;
          .delete {
            color: var(--mat-sys-error);
          }
        }
      }
    `,
  ],
})
export class MfeRemoteComponent {
  dialog = inject(MatDialog);
  formBuilder = inject(FormBuilder);
  initialValue = input.required<IMfeRemote>();

  mfeRemote: Partial<IMfeRemote> = {};

  update = output<IMfeRemote>();
  archive = output<IMfeRemote>();
  delete = output<IMfeRemote>();

  disableUpdateButton = false;

  updateRemote() {
    this.mfeRemote.name && this.initialValue() !== this.mfeRemote
      ? this.update.emit({
          ...this.initialValue(),
          ...this.mfeRemote,
        })
      : void 0;
  }

  archiveRemote() {
    this.archive.emit(this.initialValue());
  }

  deleteRemote() {
    lastValueFrom(
      this.dialog
        .open(ConfirmDeleteDialog, { data: this.initialValue() })
        .afterClosed()
        .pipe(tap((mfeRemote) => mfeRemote && this.delete.emit(mfeRemote)))
    );
  }
}
