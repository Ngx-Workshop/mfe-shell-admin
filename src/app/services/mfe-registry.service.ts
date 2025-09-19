import { loadRemoteModule } from '@angular-architects/module-federation';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { userAuthenticatedGuard } from '@tmdjr/ngx-user-metadata';
import { BehaviorSubject, from, map, switchMap, tap } from 'rxjs';

import { LocalStorageBrokerService } from '@tmdjr/ngx-local-storage-client';
import type {
  MfeRemoteDto,
  StructuralOverridesDto,
  StructuralSubType,
} from '@tmdjr/ngx-mfe-orchestrator-contracts';

export function toSlug(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '-');
}

@Injectable({ providedIn: 'root' })
export class MfeRegistryService {
  http = inject(HttpClient);
  localStorageBrokerService = inject(LocalStorageBrokerService);

  remotes = new BehaviorSubject<MfeRemoteDto[]>([]);
  remotes$ = this.remotes.asObservable();

  // Structural MFE remote URLs
  headerRemoteUrl$ = this.getRemoteUrlBySubType('header');
  footerRemoteUrl$ = this.getRemoteUrlBySubType('footer');
  navigationRemoteUrl$ = this.getRemoteUrlBySubType('nav');

  // user-journey MFE remote
  userJourneyRemotes$ = this.remotes$.pipe(
    map((remotes) =>
      remotes
        .filter((remote) => remote.type === 'user-journey')
        .map((remote) => remote)
    )
  );

  // Reactive structural modes that MFEs can respond to
  structuralModes = new BehaviorSubject<StructuralOverridesDto>({
    header: 'full',
    nav: 'verbose',
    footer: 'full',
  });
  structuralModes$ = this.structuralModes.asObservable();

  // Helper method to get remote URL by structural sub type
  private getRemoteUrlBySubType(subType: StructuralSubType) {
    return this.remotes$.pipe(
      switchMap((remotes) =>
        from(this.mergeOverrideRemotesURLsFromLocalStorage(remotes))
      ),
      map(
        (remotes) =>
          remotes.find((remote) => remote.structuralSubType === subType)
            ?.remoteEntryUrl
      )
    );
  }

  private async mergeOverrideRemotesURLsFromLocalStorage(
    remotes: MfeRemoteDto[]
  ): Promise<MfeRemoteDto[]> {
    const updatedRemotes = await Promise.all(
      remotes.map(async (remote) => {
        const remoteEntryUrl = await this.localStorageBrokerService.getItem(
          remote._id
        );

        console.log(
          `%c[MFE REGISTRY] Merging remoteEntryUrl override for ${remote.name} from localStorage key ${remote._id}:`,
          'color: orange; font-weight: bold;',
          remoteEntryUrl,
          { ...remote, remoteEntryUrl }
        );

        return remoteEntryUrl ? { ...remote, remoteEntryUrl } : remote;
      })
    );
    return updatedRemotes;
  }

  // This will be called when the router navigates to a new page
  setStructuralMode(partial: Partial<StructuralOverridesDto>) {
    this.structuralModes.next({
      ...this.structuralModes.value,
      ...partial,
    });
  }

  // Called during provideAppInitializer
  loadMfeRemotes() {
    return this.http.get<MfeRemoteDto[]>('/api/mfe-remotes').pipe(
      map((remotes) => remotes.filter((r) => r.isAdmin)),
      tap((remotes) => this.remotes.next(remotes))
    );
  }

  /**
   * Build `Routes` from current user-journey remotes.
   * Path = slug(name), remoteEntry = remoteEntryUrl
   */
  async buildUserJourneyRoutes(): Promise<Routes> {
    console.log(
      '%c[MFE REGISTRY] Building user-journey routes from remotes:',
      'color: blue; font-weight: bold;',
      this.remotes.value
    );
    const merged = await this.mergeOverrideRemotesURLsFromLocalStorage(
      this.remotes.value
    );
    return merged
      .filter((r) => r.type === 'user-journey')
      .map((r) => ({
        path: toSlug(r.name),
        data: { structuralOverrides: r.structuralOverrides },
        canActivate: r.requiresAuth ? [userAuthenticatedGuard] : [],
        // Load either component or routes based on `useRoutes` flag
        loadComponent: !r.useRoutes
          ? () =>
              loadRemoteModule({
                type: 'module',
                remoteEntry: r.remoteEntryUrl,
                exposedModule: './Component',
              }).then((m) => m.App)
          : undefined,
        loadChildren: r.useRoutes
          ? () =>
              loadRemoteModule({
                type: 'module',
                remoteEntry: r.remoteEntryUrl,
                exposedModule: './Routes',
              }).then((m) => m.Routes)
          : undefined,
      }));
  }

  /**
   * Register dynamic routes on the router. Optionally merge with provided static routes.
   * Call this after `loadMfeRemotes()` resolves (e.g., from an APP_INITIALIZER).
   */
  registerUserJourneyRoutes(router: Router, staticRoutes: Routes = []): void {
    this.buildUserJourneyRoutes().then((dynamic) => {
      // TODO Clean this up and make dashboard defult route if it exists
      // Diff from workshop shell becuase of the auth guard on the parent route
      staticRoutes[0].children = [...staticRoutes[0].children!, ...dynamic];
      router.resetConfig([...staticRoutes]);

      console.log(
        '%c[MFE REGISTRY] Registered dynamic routes:',
        'color: green; font-weight: bold;',
        dynamic
      );
    });
  }
}
