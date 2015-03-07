define([
	'jquery',
	'underscore',
	'backbone'
], function ($, _, Backbone) {
	var PageView = Backbone.View.extend({
		el : $('#content'),

		route: '',

		getCallbackForRoute: function (route) {
			var callback;
			
			switch (route) {
				case 'about.html':
					callback = function () {
						$('code').each(function () {
							var percentage = parseInt($(this).text());

							$(this).animate({
								width: percentage + '%'
							}, 2000);
						});
					};
					
					break;

				case 'findme.html':
					callback = function () {
						var $icons = $('.social__icon');
						var $activePlatform = $('.social__active-platform');

						$icons.hover(
							function () {
								$activePlatform.text(' on ' + $(this).data('title'));
							},
							function () {
								$activePlatform.text('');
							}
						);

						var rollInterval = 200;
						var numberOfPlatforms;

						$icons.each(function (index) {
							var _this = this;

							setTimeout(function () {
								$activePlatform.text(' on ' + $(_this).data('title'));
							}, (index * rollInterval));

							numberOfPlatforms = (index + 1);
						});

						setTimeout(function () {
							$activePlatform.text('');
						}, numberOfPlatforms * rollInterval);
					};
					
					break;
			}

			return callback;
		},

		showPage: function () {
			var callback = this.getCallbackForRoute(this.route);

			if (callback !== undefined) {
				callback();
			}
		},

		showPageAndPlayVideo: function () {
			var _this = this;
			var videoDelay = 3100;

			$('#menu').removeClass('menu--visible');

			setTimeout(function () {
				$('#content').fadeIn('slow');

				var callback = _this.getCallbackForRoute(_this.route);

				if (callback !== undefined) {
					callback();
				}
			}, videoDelay);
			VideoLooper.end();
		},

		render: function (route, pageContent) {
			this.$el.html(pageContent).attr('data-page', route);

			this.route = route;
		}
	});	
	
	return PageView;
});