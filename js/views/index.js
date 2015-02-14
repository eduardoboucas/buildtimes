define([
	'jquery',
	'underscore',
	'backbone',
	'text!/../home.html'
], function ($, _, Backbone, HomeTemplate) {
	var IndexView = Backbone.View.extend({
		el : $("body"),

		videoMinWidth: 0,

		setVideoMinWidth: function (videoMinWidth) {
			this.videoMinWidth = videoMinWidth;
		},

		initialize : function () {
			$(window).on("resize", this.resizeVideo);
		},

		render : function () {
			this.$el.html(HomeTemplate);
			
			VideoLooper.init(["#video1", "#video2", "#video3"], false);
			this.resizeVideo();

			this.bindUiEvents();
		},
		
		beginVideo : function (callback) {
			VideoLooper.beginWhenReady(callback);
			$("#container").fadeOut("slow");
		},
		
		resizeVideo : function () {
			var menuHeight = 40;
			var videoWidth = $(window).width();

			if (videoWidth < this.videoMinWidth) {
				return;
			}
			
			var videoHeight = $(window).width() / (1920 / 1080);
			var verticalMargin = $(window).height() - videoHeight;
			
			$(".backgroundVideo").css({
				width : videoWidth,
				height : videoHeight,
				top : ((verticalMargin / 2) - menuHeight) + "px"
			});
			
			$("#menu").css({
				bottom : ((videoHeight / 2) + (verticalMargin / 2)) - (videoHeight * (210 / 756)) + menuHeight + "px"
			});			
		},
		
		bindUiEvents : function () {
			$(".hoverFade").unbind("mouseenter").mouseenter(function () {
				$(this).fadeOut(100).fadeIn(400);				
			});

			$('.menuItem:not([href^="#"])').click(function () {
				$('#menu').fadeOut('slow');
				var link = $(this).attr('href');

				VideoLooper.end(function () {	
					console.log('VideoLooper callback');
					window.location.href = link;
				});

				return false;
			});
		}
	});	
	
	return IndexView;
});