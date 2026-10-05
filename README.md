# MFE Shell Admin

Administrative interface for managing Ngx-Workshop.io

Testing build to delete the dist folder before building

## Shared asset manager

The shell owns the uploader provider in src/app/app.config.ts:

```ts
import { provideAssetManager } from '@tmdjr/ngx-asset-manager';

// In the existing providers array, alongside the shell HTTP/auth setup:
provideAssetManager({ apiUrl: '/api/uploader' });
```

This binds ASSET_DATA_SOURCE to AssetApiService using the host HttpClient and interceptors. /api/uploader is the same-origin gateway for service-uploader. Remotes import the components and consume the host provider; do not add a second HTTP client or demo adapter. Share @tmdjr/ngx-asset-manager as a singleton at the same 21.1.0 version in both host and remote, so they refer to the same InjectionToken. Folder inputs must be IDs, not names.

The document editor's local document service on localhost:3007 is independent of this hosted asset endpoint. Serve/deploy the updated shell and refresh the browser to activate root-provider changes. Verification: 3 ChromeHeadless provider/HTTP checks and the production build pass; live use requires the updated shell.
