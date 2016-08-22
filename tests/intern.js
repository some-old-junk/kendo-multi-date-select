
define({
	environments: [
		{ browserName: 'chrome' },
		{ browserName: 'firefox' }
	],

	maxConcurrency: 1,

	tunnel: 'NullTunnel',

	reporters: ['Runner', 'Lcov'],

	functionalSuites: [ 'tests/functional/index' ],

	excludeInstrumentation: /^(?:tests|node_modules|\.idea|dist)\//
});
