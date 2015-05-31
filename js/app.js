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
		startServiceWorker();

		Router.initialize(Modernizr.videoautoplay, videoMinWidth);
	}

	var startServiceWorker = function () {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register('/serviceWorker.js')
				.then(function(registration) {
					//showNotification('Website cached for offline use.');
					console.log('ServiceWorker registration successful');
				})
				.catch(function(err) {
					console.log('ServiceWorker registration failed: ', err);
				});
		}		
	}

	var bindUiVideoEvents = function () {
		$('body').on('click', 'a[data-hashlink]', function () {
			window.location.href = $(this).attr('data-hashlink');

			return false;
		});
	}

	var showNotification = function (message) {
		$(createNotification(message)).appendTo('body').hide().fadeIn('slow');

		setTimeout(function () {
			$('.notification-wrapper').fadeOut('slow', function () {
				$(this).remove();
			});
		}, 5000);
	}

	var createNotification = function (message) {
		var html = '';

		html += '<div class="notification-wrapper">';
		html += '	<div class="notification">';
		html += '		<p class="notification__copy">' + message + '</p>';
		html += '	</div>';
		html += '</div>';

		return html;
	}

	return {
		initialize: initialize
	};
});