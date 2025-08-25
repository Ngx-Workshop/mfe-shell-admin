import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { MfeRemoteService } from '../services/mfe-remote.service';

import type { MfeRemoteDto } from '@tmdjr/ngx-mfe-orchestrator-contracts';

type MfeRemoteResolver = ResolveFn<Observable<MfeRemoteDto[]>>;
export const mfeRemoteResolver: MfeRemoteResolver = () => {
  return inject(MfeRemoteService).fetchMfeRemotes();
};
