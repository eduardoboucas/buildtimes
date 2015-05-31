// Filename: app.js
define([
	'jquery',
	'modernizr',
	'backbone',
	'router',
], function ($, Modernizr, Backbone, Router) {
	var videoMinWidth = 768;

	var initialize = function () {
		bindUiVideoEvents();
		
		Router.initialize(Modernizr.videoautoplay, videoMinWidth);
	}

	var bindUiVideoEvents = function () {
		$('body').on('click', 'a[data-hashlink]', function () {
			window.location.href = $(this).attr('data-hashlink');

			return false;
		});
	}

	return {
		initialize: initialize
	};
});