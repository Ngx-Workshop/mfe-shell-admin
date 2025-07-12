import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, of, switchMap, tap } from 'rxjs';

export interface IMfeRemote {
  _id: string;
  name: string;
  remoteEntryUrl: string;
  version: number;
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

  createMfeRemote(mfeRemote: IMfeRemote) {
    return this.httpClient.post<IMfeRemote>('/api/mfe-remotes', mfeRemote).pipe(
      switchMap(() => this.fetchMfeRemotes()),
      catchError((error) => {
        console.warn('Error creating MFE remote:', error);
        return of([]);
      })
    );
  }

  updateMfeRemote({
    _id,
    lastUpdated,
    __v,
    version,
    ...partialMfeRemote
  }: IMfeRemote) {
    return this.httpClient
      .patch<IMfeRemote>(`/api/mfe-remotes/${_id}`, partialMfeRemote)
      .pipe(
        switchMap(() => this.fetchMfeRemotes()),
        catchError((error) => {
          console.warn('Error updating MFE remote:', error);
          return of([]);
        })
      );
  }

  archiveMfeRemote(mfeRemote: IMfeRemote) {
    return this.httpClient
      .patch<IMfeRemote>(
        `/api/mfe-remotes/${mfeRemote._id}/${
          mfeRemote.archived ? 'unarchive' : 'archive'
        }`,
        void 0
      )
      .pipe(
        switchMap(() => this.fetchMfeRemotes()),
        catchError((error) => {
          console.warn('Error archiving MFE remote:', error);
          return of([]);
        })
      );
  }

  deleteMfeRemote(mfeRemote: IMfeRemote) {
    return this.httpClient
      .delete<IMfeRemote>(`/api/mfe-remotes/${mfeRemote._id}`)
      .pipe(
        switchMap(() => this.fetchMfeRemotes()),
        catchError((error) => {
          console.warn('Error deleting MFE remote:', error);
          return of([]);
        })
      );
  }

  verifyMfeUrl(remoteEntryUrl: string) {
    return this.httpClient
      .get<{ status: string }>(remoteEntryUrl)
      .pipe(
        tap((response) => {
          if (response.status !== 'ok') {
            throw new Error('Remote entry URL is not valid');
          }
        }),
        catchError((error) => {
          console.warn('Error verifying MFE URL:', error);
          return of({ status: 'error' });
        })
      );
  }
}
