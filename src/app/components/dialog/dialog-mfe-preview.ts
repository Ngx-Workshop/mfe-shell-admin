import { loadRemoteModule } from '@angular-architects/module-federation';
import { Component, ViewChild, ViewContainerRef, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ConfirmDeleteDialog } from './dialog-confirm-delete';

@Component({
  selector: 'ngx-mfe-preview',
  imports: [MatButton, MatDialogTitle, MatDialogContent, MatDialogActions],
  template: `
    <h1 mat-dialog-title>Preview MFE</h1>
    <mat-dialog-content>
      {{ mfeRemoteUrl }}
      <ng-container #mfeHost></ng-container>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button matButton (click)="dialogRef.close()">Cancel</button>
    </mat-dialog-actions>
  `,
})
export class MfePreview {
  @ViewChild('mfeHost', { read: ViewContainerRef, static: true })
  private mfeHost!: ViewContainerRef;

  dialogRef = inject(MatDialogRef<ConfirmDeleteDialog>);
  mfeRemoteUrl = inject<string>(MAT_DIALOG_DATA);

  async ngOnInit() {
    try {
      const remote = await loadRemoteModule({
        type: 'module',
        remoteEntry: this.mfeRemoteUrl,
        exposedModule: './Component',
      });
      this.mfeHost.createComponent(remote.default);
    } catch (error) {
      console.error('[MFE LOAD ERROR]', error);
    }
  }
}
