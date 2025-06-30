import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, of, tap } from 'rxjs';

export interface IMfeRemote {
  name: string;
  remoteEntryUrl: string;
  version: string;
  status?: string;
  description?: string;
  lastUpdated?: Date;
  archived?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class MfeRemoteService {
  httpClient = inject(HttpClient);

  mfeRemotes = new BehaviorSubject<IMfeRemote[]>([]);
  mfeRemotes$ = this.mfeRemotes.asObservable();

  fetchMfeRemotes() {
    return this.httpClient
      .get<IMfeRemote[]>('/api/mfe-remotes')
      .pipe(
        tap((remotes) => this.mfeRemotes.next(remotes)),
        catchError((error) => {
          console.warn('Error fetching MFE remotes:', error);
          return of([]);
        })
      );
  }
}
