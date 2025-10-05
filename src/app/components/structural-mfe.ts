import { loadRemoteModule } from '@angular-architects/module-federation';
import {
  Component,
  ComponentRef,
  inject,
  Input,
  input,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  StructuralNavOverrideMode,
  StructuralOverrideMode,
} from '@tmdjr/ngx-mfe-orchestrator-contracts';
import { Role } from '@tmdjr/ngx-navigational-list';
import { BehaviorSubject, combineLatest } from 'rxjs';

type StructuralMfeInputModes =
  | StructuralOverrideMode
  | StructuralNavOverrideMode;

@Component({
  selector: 'ngx-structural-mfe',
  template: ``,
})
export class StructuralMfeComponent implements OnInit {
  protected viewContainer = inject(ViewContainerRef);
  protected cmpRef?: ComponentRef<any>;

  mfeRemoteUrl = input.required<string>();

  @Input()
  set role(value: Role) {
    this.role$.next(value);
  }
  role$ = new BehaviorSubject<Role>('none');

  @Input()
  set mode(value: StructuralMfeInputModes) {
    this.mode$.next(value);
  }
  mode$ = new BehaviorSubject<StructuralMfeInputModes>('disabled');

  constructor() {
    combineLatest([this.mode$, this.role$])
      .pipe(takeUntilDestroyed())
      .subscribe(([mode, role]) => {
        if (this.cmpRef) {
          this.cmpRef.setInput('mode', mode);
          this.cmpRef.setInput('role', role);
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
      this.cmpRef = this.viewContainer.createComponent(remoteComponent.default);
      this.cmpRef.setInput('mode', this.mode$.value);
    } catch (error) {
      console.error('[MFE LOAD ERROR]', error);
    }
  }
}
