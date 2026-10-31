import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import type { MfeRemoteDto } from '@tmdjr/ngx-mfe-orchestrator-contracts';
import { LocalStorageBrokerService } from '@tmdjr/ngx-local-storage-client';
import { WorkshopLogger } from '@tmdjr/ngx-workshop-logger';
import { MfeRegistryService } from './mfe-registry.service';

describe('MfeRegistryService domain loading', () => {
  it('requests its shell domain and keeps server-selected records regardless of legacy flags', () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: LocalStorageBrokerService, useValue: {} },
        { provide: WorkshopLogger, useValue: {} },
      ],
    });
    const service = TestBed.inject(MfeRegistryService);
    const http = TestBed.inject(HttpTestingController);
    const remotes = [
      { _id: 'one', type: 'user-journey', isAdmin: false },
    ] as MfeRemoteDto[];
    let received: MfeRemoteDto[] = [];
    service.loadMfeRemotes().subscribe((value) => (received = value));
    http.expectOne('/api/mfe-remotes/domain/admin').flush(remotes);
    expect(received).toEqual(remotes);
    expect(service.remotes.value).toEqual(remotes);
    http.verify();
  });
});
