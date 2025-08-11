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
import { ConfirmDeleteDialog } from './confirm-delete-dialog.component';

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
