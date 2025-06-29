import { Component } from '@angular/core';

@Component({
  selector: 'ngx-hero',
  template: `
    <header class="header-background">
      <div class="header-section">
        <div class="header-headline">
          <h1>Ngx MFE Orchestrator</h1>
          <h2>A tool to manage MFE remotes!</h2>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      :host {
        width: 100%;
        .header-background {
          overflow: hidden;
          position: relative;
          height: 360px;
          // color: var(--mat-sys-on-secondary);
          // background: var(--mat-sys-secondary);
          color: var(--mat-sys-on-primary-fixed);
          background: var(--mat-sys-primary-fixed-dim);
          &::before {
            content: '';
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48" ><path d="m240-400 77-200H200l-53 80H80l40-140-40-140h67l53 80h117l-77-200h80l138 200h122q25 0 42.5 17.5T640-660q0 25-17.5 42.5T580-600H458L320-400h-80ZM640-40 502-240H380q-25 0-42.5-17.5T320-300q0-25 17.5-42.5T380-360h122l138-200h80l-77 200h117l53-80h67l-40 140 40 140h-67l-53-80H643l77 200h-80Z"/></svg>');
            background-repeat: no-repeat;
            background-size: 375px;
            background-position: 80% -5px;
            opacity: 0.2;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
          }
        }
        .header-section {
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          height: 100%;
          text-align: center;
          .header-headline {
            h1 {
              font-size: 56px;
              font-weight: bold;
              line-height: 56px;
              margin: 15px 5px;
            }
            h2 {
              font-size: 20px;
              font-weight: 300;
              line-height: 28px;
              margin: 15px 0 25px 0;
            }
          }
        }
      }
    `,
  ],
})
export class HeroComponent {}
