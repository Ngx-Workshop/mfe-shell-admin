# MFE Shell Admin

Administrative interface for managing Ngx-Workshop.io

Testing build to delete the dist folder before building

## Material Symbols in federated components

The shell loads Material Symbols Outlined in `src/index.html` and sets
`material-symbols-outlined` and `mat-ligature-font` as the default icon classes
in `src/app/app.config.ts`. Use `<mat-icon>content_copy</mat-icon>` for ligature
icons; the text remains in the DOM and the font renders it as a symbol.

Both the shell and remotes must share Material/CDK secondary entry points as
singletons. `webpack.config.js` uses the module federation `share` helper with
`includeSecondaries: true` for `@angular/material` and `@angular/cdk`, retaining
strict version matching at `21.1.0`. Apply the same settings in each remote.
Sharing only `@angular/material` does not share `@angular/material/icon`, so a
remote can get a separate `MatIconRegistry` with the old `material-icons` default.

Rebuild/restart the shell and affected remotes and refresh the browser after
changing federation settings. Default font icons should then have the
`material-symbols-outlined` class instead of `material-icons`. Avoid overriding
`MatIconRegistry` in remote/component providers or explicitly selecting the old
font set. A remote running standalone also needs its own font link and icon
registry initialization.

## Shared asset manager

The shell owns the uploader provider in src/app/app.config.ts:

```ts
import { provideAssetManager } from '@tmdjr/ngx-asset-manager';

// In the existing providers array, alongside the shell HTTP/auth setup:
provideAssetManager({ apiUrl: '/api/uploader' });
```

This binds ASSET_DATA_SOURCE to AssetApiService using the host HttpClient and interceptors. /api/uploader is the same-origin gateway for service-uploader. Remotes import the components and consume the host provider; do not add a second HTTP client or demo adapter. Share @tmdjr/ngx-asset-manager as a singleton at the same 21.1.0 version in both host and remote, so they refer to the same InjectionToken. Folder inputs must be IDs, not names.

The document editor's local document service on localhost:3007 is independent of this hosted asset endpoint. Serve/deploy the updated shell and refresh the browser to activate root-provider changes. Verification: 3 ChromeHeadless provider/HTTP checks and the production build pass; live use requires the updated shell.
