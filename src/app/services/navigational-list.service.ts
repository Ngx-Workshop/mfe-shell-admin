import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  NavigationData,
  NgxNavigationalListService,
} from '@tmdjr/ngx-navigational-list';
import { MenuItemDto } from '@tmdjr/service-navigational-list-contracts';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigationalListService {
  private readonly baseUrl = '/api/navigational-list';
  private readonly http = inject(HttpClient);
  private readonly ngxNavigationalListService = inject(
    NgxNavigationalListService
  );

  getMenuHierarchy$(
    domain: MenuItemDto['domain'],
    includeArchived = false
  ): Observable<any> {
    const params: Record<string, string | number | boolean> = {};
    if (includeArchived) {
      params['includeArchived'] = includeArchived;
    }
    return this.http
      .get<NavigationData>(`${this.baseUrl}/hierarchy/${domain}`, {
        params,
      })
      .pipe(
        tap((navigationData) =>
          this.ngxNavigationalListService.setNavigationData(navigationData)
        )
      );
  }
}
