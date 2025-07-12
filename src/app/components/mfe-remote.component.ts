import {
  Component,
  inject,
  input,
  output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { IMfeRemote } from '../services/mfe-remote.service';
import { MatCardModule } from '@angular/material/card';
import { MatButton, MatIconButton } from '@angular/material/button';
import { FormBuilder } from '@angular/forms';
import { MfeFormComponent } from './mfe-form.component';
import { MatIcon } from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { lastValueFrom, of, tap } from 'rxjs';
import { ConfirmDeleteDialog } from './confirm-delete-dialog.component';
import { MatTooltip } from '@angular/material/tooltip';
import { MfeRemoteInfoGroup } from './mfe-remote-info-group.component';
import { loadRemoteModule } from '@angular-architects/module-federation';

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
        <button
          mat-icon-button
          matTooltip="Preview the MFE"
          (click)="previewMfeRemote(mfe.remoteEntryUrl)"
        >
          <mat-icon>play_arrow</mat-icon>
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
        <div class="flex-spacer"></div>
        <button
          matButton
          (click)="updateRemote()"
          [disabled]="disableUpdateButton"
        >
          Update
        </button>
        <button matButton (click)="archive.emit(mfe)">
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
}

@Component({
  selector: 'ngx-mfe-preview',
  imports: [MatButton, MatDialogTitle, MatDialogContent, MatDialogActions],
  template: `
    <h1 mat-dialog-title>Preview MFE</h1>
    <mat-dialog-content>
      {{ mfeRemoteUrl}}
      <ng-container #mfeHost></ng-container>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button matButton (click)="dialogRef.close()">Cancel</button>
    </mat-dialog-actions>
  `,
})
export class MfePreviewComponent {
  @ViewChild('mfeHost', { read: ViewContainerRef, static: true })
  private mfeHost!: ViewContainerRef;

  dialogRef = inject(MatDialogRef<ConfirmDeleteDialog>);
  mfeRemoteUrl = inject<string>(MAT_DIALOG_DATA);

  async ngOnInit() {
    try {
      const remoteComponent = await loadRemoteModule({
        type: 'module',
        remoteEntry: this.mfeRemoteUrl,
        exposedModule: './Component',
      });
      this.mfeHost.createComponent(remoteComponent.default);
    } catch (error) {
      console.error('[MFE LOAD ERROR]', error);
    }
  }
}
