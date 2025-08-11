import { Component, inject, input, output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { lastValueFrom, tap } from 'rxjs';
import { IMfeRemote } from '../services/mfe-remote.service';
import { ConfirmDeleteDialog } from './confirm-delete-dialog.component';
import { DevModeOptionsComponent } from './dev-mode-options-dialog.component';
import { MfeFormComponent } from './mfe-form/mfe-form.component';
import { MfePreviewComponent } from './mfe-preview-dialog.component';
import { MfeRemoteInfoGroup } from './mfe-remote-info-group.component';

@Component({
  selector: 'ngx-mfe-remote',
  imports: [
    MatCardModule,
    MatButton,
    MatIconButton,
    MatIcon,
    MfeFormComponent,
    MfeRemoteInfoGroup,
    MatTooltip,
  ],
  template: `
    @if (initialValue(); as mfe) {
    <mat-card appearance="filled">
      <mat-card-header>
        <button mat-icon-button matTooltip="Hello I'm some info">
          <mat-icon>info</mat-icon>
        </button>
        <button mat-icon-button (click)="openDevModeOptions(mfe)">
          <mat-icon>code</mat-icon>
        </button>
        <button
          mat-icon-button
          matTooltip="Preview the MFE"
          (click)="previewMfeRemote(mfe.remoteEntryUrl)"
        >
          <mat-icon>visibility</mat-icon>
        </button>
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
        <button matButton (click)="archive.emit(mfe)">
          {{ mfe.archived ? 'Archived' : 'Archive' }}
        </button>
        <div class="flex-spacer"></div>
        <button
          matButton
          (click)="updateRemote()"
          [disabled]="disableUpdateButton"
        >
          Update
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

  deleteRemote() {
    lastValueFrom(
      this.dialog
        .open(ConfirmDeleteDialog, { data: this.initialValue() })
        .afterClosed()
        .pipe(tap((mfeRemote) => mfeRemote && this.delete.emit(mfeRemote)))
    );
  }

  previewMfeRemote(mfeRemote: string) {
    this.dialog.open(MfePreviewComponent, { data: mfeRemote });
  }

  openDevModeOptions(mfe: IMfeRemote) {
    this.dialog.open(DevModeOptionsComponent, {
      data: mfe,
      width: '600px',
    });
  }
}
