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
		}
	},
	paths: {
		jquery: '//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min',
		underscore: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min',
		backbone: '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min',
		templates: '/templates'
	}
});

require([
	// Load our app module and pass it to our definition function
	'app',
], function (App) {
	// The "app" dependency is passed in as "App"
	App.initialize();
});