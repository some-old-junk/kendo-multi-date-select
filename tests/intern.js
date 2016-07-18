
define({
	environments: [
		{ browserName: 'firefox' },
        { browserName: 'chrome' }
	],

	maxConcurrency: 2,

	tunnel: 'NullTunnel',

	functionalSuites: [ 'tests/functional/index' ],

	excludeInstrumentation: /^(?:tests|node_modules|\.idea|kendo-multi-date-select\.min\.js|LICENSE|package\.json|README\.md)\//
});
