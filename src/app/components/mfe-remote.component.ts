import { Component, inject, input, output } from '@angular/core';
import { IMfeRemote } from '../services/mfe-remote.service';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { MfeFormComponent } from './mfe-form.component';

@Component({
  selector: 'ngx-mfe-remote',
  imports: [MatCardModule, MatButton, DatePipe, MfeFormComponent],
  template: `
    @if (initialValue(); as mfe) {
    <mat-card appearance="filled">
      <mat-card-header>
        <h3>Version {{ mfe.version }}</h3>
        <div class="flex-spacer"></div>
        <h5>Last Updated: {{ mfe.lastUpdated | date }}</h5>
      </mat-card-header>
      <mat-card-content>
        <ngx-mfe-form
          [initialValue]="initialValue()"
          (formStatus)="disableUpdateButton = $event !== 'VALID'"
          (valueChange)="mfeRemote = $event"
        ></ngx-mfe-form>
      </mat-card-content>
      <mat-card-actions>
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
        mat-card-header {
          display: flex;
          flex-direction: row;
        }
      }
    `,
  ],
})
export class MfeRemoteComponent {
  formBuilder = inject(FormBuilder);
  initialValue = input.required<IMfeRemote>();

  mfeRemote: Partial<IMfeRemote> = {};

  update = output<IMfeRemote>();
  archive = output<IMfeRemote>();

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
}
