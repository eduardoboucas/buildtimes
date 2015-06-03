// Filename: main.js

// Require.js allows us to configure shortcut alias
// There usage will become more apparent further along in the tutorial.
require.config({
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		spinner: {
			deps: ['jquery'],
			exports: 'Spinner'
		},
		modernizr: {
			exports: 'Modernizr'
		}
	},
	paths: {
		jquery: '/js/vendor/jquery.min',
		underscore: '/js/vendor/underscore-min',
		backbone: '/js/vendor/backbone-min',
		templates: '/templates',
		spinner: '/js/vendor/spinner.min',
		modernizr: '/js/vendor/modernizr.min'
	}
});

require([
	// Load our app module and pass it to our definition function
	'app',
], function (App) {
	// The "app" dependency is passed in as "App"
	App.initialize();
});