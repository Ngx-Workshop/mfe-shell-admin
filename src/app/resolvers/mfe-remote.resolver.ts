import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { IMfeRemote, MfeRemoteService } from '../services/mfe-remote.service';

type MfeRemoteResolver = ResolveFn<Observable<IMfeRemote[]>>;
export const mfeRemoteResolver: MfeRemoteResolver = () => {
  return inject(MfeRemoteService).fetchMfeRemotes();
};
