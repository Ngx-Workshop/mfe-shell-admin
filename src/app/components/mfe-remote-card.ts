import { Component, inject, input, output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { lastValueFrom, tap } from 'rxjs';
import { ConfirmDeleteDialog } from './dialog/dialog-confirm-delete';
import { DevModeOptions } from './dialog/dialog-dev-mode-options';
import { MfePreview } from './dialog/dialog-mfe-preview';
import { MfeForm } from './form-mfe/form-mfe';
import { MfeInfoGroup } from './mfe-info-group';

import type { MfeRemoteDto } from '@tmdjr/ngx-mfe-orchestrator-contracts';

@Component({
  selector: 'ngx-mfe-remote',
  imports: [
    MatCardModule,
    MatButton,
    MatIconButton,
    MatIcon,
    MfeForm,
    MfeInfoGroup,
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
export class MfeRemote {
  dialog = inject(MatDialog);
  formBuilder = inject(FormBuilder);
  initialValue = input.required<MfeRemoteDto>();

  mfeRemote: Partial<MfeRemoteDto> = {};

  update = output<MfeRemoteDto>();
  archive = output<MfeRemoteDto>();
  delete = output<MfeRemoteDto>();

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
    this.dialog.open(MfePreview, { data: mfeRemote });
  }

  openDevModeOptions(mfe: MfeRemoteDto) {
    this.dialog.open(DevModeOptions, {
      data: mfe,
      width: '600px',
    });
  }
}
