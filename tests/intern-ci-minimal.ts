export * from './intern';

export const environments = [
  {
    browserName: 'chrome',
    version: ['57'],
    platform: ['Windows 10'],
    recordVideo: false,
    recordScreenshots: false
  }
];

export const tunnel = 'SauceLabsTunnel';

export const maxConcurrency = 5;

export const reporters = [
  'Runner',
  {
    id: 'node_modules/remap-istanbul/lib/intern-reporters/JsonCoverage',
    filename: 'coverage/coverage-final.json'
  }
];

export const excludeInstrumentation = /^(?:build|tests|node_modules)\//;
