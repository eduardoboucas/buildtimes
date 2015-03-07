define([
	'jquery',
	'backbone',
	'text!/../home.html'
], function ($, Backbone, HomeTemplate) {
	var IndexView = Backbone.View.extend({
		el : $('body'),

		initialize: function () {
			$(window).on('resize', this.resizeVideo);
		},

		render: function () {
			this.$el.html(HomeTemplate);
			
			VideoLooper.init(['#video1', '#video2', '#video3'], false);
			this.resizeVideo();

			this.bindUiEvents();
		},
		
		beginVideo: function (callback) {
			VideoLooper.beginWhenReady(callback);
			$('#content').fadeOut('slow');
		},
		
		resizeVideo: function () {
			var $menu = $('#menu');
			var menuHeight = $menu.outerHeight();
			var videoWidth = $(window).width();

			if (videoWidth < 768) {
				return;
			}
			
			var videoHeight = $(window).width() / (1920 / 1080);
			var verticalMargin = $(window).height() - videoHeight;
			
			$('.background__video').css({
				width: videoWidth,
				height: videoHeight,
				top: ((verticalMargin / 2) - menuHeight) + 'px'
			});
			
			$menu.css({
				bottom: ((videoHeight / 2) + (verticalMargin / 2)) - (videoHeight * (210 / 756)) + menuHeight - 10 + 'px'
			});			
		},
		
		bindUiEvents: function () {
			// Handling external links on main menu
			$('html.videoautoplay .menu__item--external').click(function () {
				$('#menu').removeClass('visible');
				var link = $(this).attr('href');

				VideoLooper.end(function () {	
					window.location.href = link;
				});

				return false;
			});
		}
	});	
	
	return IndexView;
});