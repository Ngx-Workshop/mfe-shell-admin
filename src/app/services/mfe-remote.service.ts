import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, of, switchMap, tap } from 'rxjs';

export interface IMfeRemote {
  _id: string;
  name: string;
  remoteEntryUrl: string;
  version: string;
  status?: string;
  description?: string;
  lastUpdated?: Date;
  archived?: boolean;
  __v?: number;
}

@Injectable({
  providedIn: 'root',
})
export class MfeRemoteService {
  httpClient = inject(HttpClient);

  mfeRemotes = new BehaviorSubject<IMfeRemote[]>([]);
  mfeRemotes$ = this.mfeRemotes.asObservable();

  fetchMfeRemotes() {
    return this.httpClient.get<IMfeRemote[]>('/api/mfe-remotes').pipe(
      tap((remotes) => this.mfeRemotes.next(remotes)),
      catchError((error) => {
        console.warn('Error fetching MFE remotes:', error);
        return of([]);
      })
    );
  }

  updateMfeRemote({ _id, lastUpdated, __v, ...partialMfeRemote }: IMfeRemote) {
    return this.httpClient
      .patch<IMfeRemote>(`/api/mfe-remotes/${_id}`, partialMfeRemote)
      .pipe(
        switchMap(this.fetchMfeRemotes),
        catchError((error) => {
          console.warn('Error updating MFE remote:', error);
          return of([]);
        })
      );
  }
}
