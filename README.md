# MFE Shell Admin

Administrative interface for managing Ngx-Workshop.io

## Shared design system

The shell installs `@tmdjr/ngx-workshop-design-system` at `21.0.1` and shares its
JavaScript entry point as a strict singleton. Remotes must install and share the
same version. The Sass `theme` entry is compiled by the host, not federated.

Global styles provide semantic Ngx tokens plus button, code and scoped backdrop styles.
Migrated workspaces opt into the Material adapter with the `ngx-design-system`
host class; dialogs use `panelClass: 'ngx-design-system-overlay'` and
`backdropClass: 'ngx-design-system-backdrop'`. Select panels and tooltips also use
the `ngx-design-system-overlay` class. This keeps overlay tokens consistent outside
the remote's DOM. Existing body palette rules continue to serve legacy remotes.
Standalone migrated remotes must also load the public theme and adapter locally.

Testing build to delete the dist folder before building

## Build toolchain compatibility

Keep `@angular-devkit/build-angular` pinned to `21.2.26` and the npm webpack
override at `5.105.2`. Builder `21.2.28` uses webpack `5.112.0`, whose federation
identifiers break `license-webpack-plugin@4.0.2` with an undefined `trim` error.
Both pins keep one compatible webpack runtime. Keep license extraction enabled.
Regenerate the lockfile with CI's Node 22/npm 10, then verify with `npm ci`;
npm 11 can omit optional peer entries required by npm 10.

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

## Structural design-system integration

Structural remotes opt into `.ngx-design-system`; their Material menus use `.ngx-design-system-overlay`. The shell supplies Ngx semantic tokens, button styles and the scoped Material adapter, including portaled overlays. Package version 21.0.2 includes the shaped button hover fix. Existing journey palettes remain body-scoped.

The structural mode determines desktop rail allocation: full 176px, relaxed 136px, compact 88px. At 720px and below, the grid places the navigation above the header and content, with no reserved side column. Mobile resizing does not change the active mode or menu data. Disabled navigation removes its grid allocation. Dynamic loading passes both the current role and mode before the first remote render.
