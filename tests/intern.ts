export const environments = [
  { browserName: 'safari' },
  { browserName: 'chrome' }
  // { browserName: 'firefox', marionette: true }
];

export const tunnel = 'SeleniumTunnel';

export const tunnelOptions = {
  drivers: ['chrome', 'firefox']
};

export const reporters = ['Runner'];

export const loaderOptions = {
  packages: [
    { name: 'dojo', location: 'node_modules/dojo' },
    { name: 'leadfoot', location: 'node_modules/leadfoot' }
  ]
};

export const functionalSuites = ['build/tests/functional/index'];

export const excludeInstrumentation = true;
