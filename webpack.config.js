const {
  shareAll,
  withModuleFederationPlugin,
} = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  remotes: {
    mfe1: 'http://localhost:3000/remoteEntry.js',
  },

  // Shared Singleton Services
  shared: {
    '@angular/core': {
      singleton: true,
      strictVersion: true,
      requiredVersion: '21.1.0',
    },
    '@angular/common': {
      singleton: true,
      strictVersion: true,
      requiredVersion: '21.1.0',
    },
    '@angular/router': {
      singleton: true,
      strictVersion: true,
      requiredVersion: '21.1.0',
    },
    '@angular/forms': {
      singleton: true,
      strictVersion: true,
      requiredVersion: '21.1.0',
    },

    '@angular/common/http': {
      singleton: true,
      strictVersion: true,
      requiredVersion: '21.1.0',
    },

    // If you use Material/CDK, share them too
    '@angular/cdk': {
      singleton: true,
      strictVersion: true,
      requiredVersion: '21.1.0',
    },
    '@angular/material': {
      singleton: true,
      strictVersion: true,
      requiredVersion: '21.1.0',
    },

    // RxJS + tslib
    rxjs: {
      singleton: true,
      strictVersion: true,
      requiredVersion: '7.8.2',
    },
    tslib: {
      singleton: true,
      strictVersion: true,
      requiredVersion: '2.8.1',
    },

    // Theming
    '@tmdjr/ngx-theme-picker': {
      singleton: true,
      strictVersion: true,
      requiredVersion: '21.0.3',
    },

    '@tmdjr/ngx-user-metadata': {
      singleton: true,
      strictVersion: true,
      requiredVersion: '^21.0.4',
    },

    '@tmdjr/ngx-local-storage-client': {
      singleton: true,
      strictVersion: true,
      requiredVersion: '^21.0.30',
    },

    '@tmdjr/ngx-navigational-list': {
      singleton: true,
      strictVersion: true,
      requiredVersion: '21.0.6',
    },

    '@tmdjr/ngx-editor-js2': {
      singleton: true,
      strictVersion: true,
      requiredVersion: '21.0.6',
    },

    '@tmdjr/ngx-shared-headers': {
      singleton: true,
      strictVersion: true,
      requiredVersion: '21.0.5',
    },
  },
});
