import { loadRemoteModule } from '@angular-architects/module-federation';
import {
  Component,
  ComponentRef,
  inject,
  input,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
} from '@angular/core/rxjs-interop';

import {
  StructuralNavOverrideMode,
  StructuralOverrideMode,
} from '@tmdjr/ngx-mfe-orchestrator-contracts';
@Component({
  selector: 'ngx-structural-mfe',
  template: ``,
})
export class StructuralMfeComponent implements OnInit {
  protected viewContainer = inject(ViewContainerRef);
  mfeRemoteUrl = input.required<string>();
  mode = input.required<
    StructuralOverrideMode | StructuralNavOverrideMode
  >();
  mode$ = toObservable(this.mode);
  private cmpRef?: ComponentRef<any>;

  constructor() {
    this.mode$.pipe(takeUntilDestroyed()).subscribe((mode) => {
      console.log('[MFE MODE]', mode, this.cmpRef);
      if (this.cmpRef) {
        this.cmpRef.setInput?.('mode', mode);
      }
    });
  }

  async ngOnInit() {
    try {
      const remoteComponent = await loadRemoteModule({
        type: 'module',
        remoteEntry: this.mfeRemoteUrl(),
        exposedModule: './Component',
      });
      this.cmpRef = this.viewContainer.createComponent(
        remoteComponent.default
      );
      this.cmpRef.setInput?.('mode', this.mode());
    } catch (error) {
      console.error('[MFE LOAD ERROR]', error);
    }
  }
}
