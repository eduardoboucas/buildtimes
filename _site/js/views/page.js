define([
	'jquery',
	'underscore',
	'backbone'
], function ($, _, Backbone) {
	var PageView = Backbone.View.extend({
		el : $("#container"),

		route: "",

		getCallbackForRoute: function (route) {
			var callback;

			switch (route) {
				case 'about':
					callback = function () {
						$('code').each(function () {
							$(this).width($(this).text() + '%');
						});
					};
					
					break;

				case 'findme':
					callback = function () {
						var $icons = $(".mediaIcons img");

						$icons.hover(
							function () {
								$(".activePlatform").text(' on ' + $(this).data("title"));
							},
							function () {
								$(".activePlatform").text('');
							}
						);

						var rollInterval = 200;
						var numberOfPlatforms;

						$icons.each(function (index) {
							var _this = this;

							setTimeout(function () {
								$(".activePlatform").text(' on ' + $(_this).data("title"));
							}, (index * rollInterval));

							numberOfPlatforms = (index + 1);
						});

						setTimeout(function () {
							$(".activePlatform").text('');
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

			$("#menu").fadeOut("slow");
			setTimeout(function () {
				$("#container").fadeIn("slow");

				var callback = _this.getCallbackForRoute(_this.route);

				if (callback !== undefined) {
					callback();
				}
			}, videoDelay);
			VideoLooper.end();
		},

		render: function (route, pageContent) {
			this.$el.html(pageContent);
			this.$el.removeClass().addClass(route);

			this.route = route;
		}
	});	
	
	return PageView;
});