import { inject, Injectable } from '@angular/core';
import { LocalStorageBrokerService } from '@tmdjr/ngx-local-storage-client';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageDevOverrideService {
  broker = inject(LocalStorageBrokerService);

  setOverride(key: string, value: any) {
    this.broker.setItem(key, value);
  }

  getOverride(key: string) {
    return this.broker.getItem(key);
  }

  removeOverride(key: string) {
    this.broker.removeItem(key);
  }
}
