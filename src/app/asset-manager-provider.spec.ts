import { APP_INITIALIZER } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ASSET_DATA_SOURCE, AssetApiService } from '@tmdjr/ngx-asset-manager';
import { appConfig } from './app.config';

describe('Admin shell asset manager provider', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [...appConfig.providers, provideHttpClientTesting()] });
    // Shell startup/navigation is outside this adapter check.
    TestBed.overrideProvider(APP_INITIALIZER, { useValue: [] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('shares the real gateway adapter through the shell root injector', () => {
    expect(TestBed.inject(ASSET_DATA_SOURCE)).toBe(TestBed.inject(AssetApiService));
  });

  it('reads assets and folders through the existing shell HTTP client with credentials', () => {
    const source = TestBed.inject(ASSET_DATA_SOURCE);
    source.listFolders().subscribe();
    const folders = http.expectOne('/api/uploader/folders');
    expect(folders.request.withCredentials).toBeTrue(); folders.flush([]);
    source.listAssets({ folderId: '507f1f77bcf86cd799439012' }).subscribe();
    const assets = http.expectOne(request => request.url === '/api/uploader');
    expect(assets.request.withCredentials).toBeTrue();
    expect(assets.request.params.get('folderId')).toBe('507f1f77bcf86cd799439012');
    assets.flush([]);
  });

  it('uploads multipart file data to the uploader instead of the document service', () => {
    TestBed.inject(ASSET_DATA_SOURCE).upload({
      file: new File(['image'], 'photo.png', { type: 'image/png' }),
      folderId: '507f1f77bcf86cd799439012',
    }).subscribe();
    const upload = http.expectOne('/api/uploader/upload');
    expect(upload.request.method).toBe('POST');
    expect(upload.request.withCredentials).toBeTrue();
    expect((upload.request.body as FormData).get('folderId')).toBe('507f1f77bcf86cd799439012');
    upload.flush({});
  });
});
