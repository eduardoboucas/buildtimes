// Filename: app.js
define([
	'jquery',
	'underscore',
	'backbone',
	'router',
], function ($, _, Backbone, Router) {
	// The minimum viewport width for the video to be played (pixels)
	var videoMinWidth = 768;

	var initialize = function () {
		Router.initialize(videoMinWidth);
	}

	return {
		initialize: initialize
	};
});