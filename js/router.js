define([
	'jquery',
	'underscore',
	'backbone',
	'views/index',
	'views/page'
], function ($, _, Backbone, IndexView, PageView) {
	var AppRouter = Backbone.Router.extend({
		routes: {
			'': 'index',
			'*route': 'default'
		}
	});

	var initialize = function (videoMinWidth) {
		var indexView = new IndexView();
		indexView.setVideoMinWidth(videoMinWidth);
		indexView.render();
		
		var app_router = new AppRouter;
	
		app_router.on('route:index', function () {
			window.userCameFromIndex = true;

			var videoPlayedCallback = function () {
				$("#menu").fadeIn("slow");
				$("#container").removeClass().addClass("home");
			};

			if ($(window).width() >= videoMinWidth) {
				indexView.beginVideo(videoPlayedCallback);	
			} else {
				$("#menu").removeClass("hidden");
			}
		});
		
		app_router.on('route:default', function (route) {
			var request = $.ajax(route + '.html');
			request.done(function (data) {
				var pageView = new PageView({el : $("#container")});
				pageView.render(route, data);
				
				if ($(window).width() >= videoMinWidth) {
					if (window.userCameFromIndex === true) {
						pageView.showPageAndPlayVideo();
					} else {
						pageView.showPage();					
					}
				} else {
					pageView.showPage();
					$("#menu").addClass("hidden");
				}
				
				indexView.bindUiEvents();				
			});

			request.fail(function (error) {
				console.log(error);
			});
		});
		
		Backbone.history.start();	
	};
	
	return {
		initialize: initialize
	};
});
		