define([
	'jquery',
	'underscore',
	'backbone',
	'spinner',
	'views/index',
	'views/page'
], function ($, _, Backbone, Spinner, IndexView, PageView) {
	var AppRouter = Backbone.Router.extend({
		routes: {
			'': 'index',
			'about': 'about',
			'portfolio(/:project)': 'portfolio',
			'findme': 'findme',
			'404': '404',
			'*default': '404'
		}
	});

	var previousRoute = '';
	var indexView;
	var autoplaySupport;
	var videoMinWidth;

	var initialize = function (_autoplaySupport, _videoMinWidth) {
		indexView = new IndexView();
		indexView.render();

		autoplaySupport = _autoplaySupport;
		videoMinWidth = _videoMinWidth;

		var app_router = new AppRouter;
	
		app_router.on('route:index', function () {
			var $menu = $('#menu');
			var videoPlayedCallback = function () {
				$menu.addClass('menu--visible');
				$('#content').attr('data-page', 'home');
			};

			if (($(window).width() >= videoMinWidth) && (autoplaySupport)) {
				indexView.beginVideo(videoPlayedCallback);	
			} else {
				$('body').removeClass('body--mobile-flow');
			}

			previousRoute = '';
		});
		
		app_router.on('route:about', function () {
			_loadAjaxPage('about.html', '#content', '#content');	
		});

		app_router.on('route:portfolio', function (project) {
			// Preparing callbacks
			var callbacks = {};

			callbacks.afterRender = function () {
				if (!autoplaySupport) {
					$('.project__video video').attr('controls', 'yes');
				}
			};

			// Are we after a specific project, or the general portfolio page?
			if (project) {
				var projectPage = 'portfolio/' + project + '.html';

				if (previousRoute.indexOf('portfolio') != -1) {
					// If we were previously on a portfolio page, we just load the project partial
					var targetElement = '#portfolio-project';
					var $targetElement = $(targetElement);

					// Loading the spinner
					var spinner = new Spinner().spin();
					$targetElement.html(spinner.el);

					// Changing the 'active' thumbnail
					$('.project-thumbnail').removeClass('project-thumbnail--active').filter('[data-projecthandle="' + project + '"]').addClass('project-thumbnail--active');

					callbacks.beforeRender = function () {
						spinner.stop();
					};

					_loadAjaxPage(projectPage, targetElement, targetElement, callbacks);
				} else {
					// Otherwise we load the whole thing
					_loadAjaxPage(projectPage, '#content', '#content', callbacks);
				}
			} else {
				_loadAjaxPage('portfolio.html', '#content', '#content', callbacks);
			}
		});

		app_router.on('route:findme', function () {
			_loadAjaxPage('findme.html', '#content', '#content');		
		});

		app_router.on('route:404', function () {
			_loadAjaxPage('404.html', '#content', '#content');		
		});

		app_router.on('route', function (route) {
			_trackPageview();

			previousRoute = route;
		});
		
		Backbone.history.start();	
	};

	var _loadAjaxPage = function (page, sourceElement, targetElement, callbacks) {
		if (!callbacks) {
			callbacks = {};
		}

		var routeBeforeRequest = previousRoute;
		var request = $.ajax(page);

		request.done(function (data) {
			// beforeRender callback
			if ('beforeRender' in callbacks) {
				callbacks.beforeRender(data);
			}

			// Preparing the view and parsing the data
			var $targetElement = $(targetElement);
			var pageView = new PageView({el : $targetElement});
			var html = $.parseHTML(data);

			// If the source element is at the root, we filter(). Otherwise, we find().
			var $sourceElement = $(html).filter(sourceElement);

			if ($sourceElement.length === 0) {
				$sourceElement = $(html).find(sourceElement);
			} 

			var $sourceContent = $sourceElement.contents();

			// Rendering the view
			pageView.render(page, $sourceContent);

			// Transferring all the classes from the source element to the target
			$targetElement.attr('class', $sourceElement.attr('class'));

			// afterRender callback
			if ('afterRender' in callbacks) {
				callbacks.afterRender($sourceContent);
			}

			if (($(window).width() >= videoMinWidth) && (autoplaySupport)) {
				if (routeBeforeRequest == 'index') {
					pageView.showPageAndPlayVideo();
				} else {
					pageView.showPage();	
				}
			} else {
				pageView.showPage();
				$('#menu').removeClass('menu--visible');
				$('body').addClass('body--mobile-flow');				
			}
		});

		request.error(function (error) {
			window.location.hash = '/404';
		});
	};

	var _trackPageview = function () {
		var url = Backbone.history.getFragment()

		if (url) {
			url = '/#/' + url;
		} else {
			url = '/';
		}

		ga('send', 'pageview', url);
	};
	
	return {
		initialize: initialize
	};
});
		