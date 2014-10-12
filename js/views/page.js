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
							var percentage = parseInt($(this).text());

							$(this).css('width', percentage + '%');
						});
					};
					
					break;

				case 'blog':
					$('a.readPost').on('click', function () {
						$.get($(this).attr('href'), function (data) {
							var goBackCode = '<a class="backToAllPosts" href="/#/blog"><h2 class="backToAllPosts">&#8592; Back to all posts</h2></a>';
							var $fullArticle = $(data).find('article');

							if ($fullArticle) {
								$("#blogPosts").hide();
								$("#blogPost").html(goBackCode).append($fullArticle).fadeIn('slow');
							}
						});

						return false;
					});

					$(document).on("click", 'a.backToAllPosts', function () {
						$("#blogPost").hide();
						$("#blogPosts").fadeIn("slow");

						return false;
					}); 

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