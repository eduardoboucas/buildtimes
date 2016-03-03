var eb = (function ($) {
	var $main = $('#main');

	// --------------------------------------------------------------
	// UI events
	// --------------------------------------------------------------
	
	function bindUiEvents() {
		$(window).load(function () {
			adjustFeatureWidth();
		});

		$(window).resize(function () {
			adjustFeatureWidth();
		});

		$('#post-new-comment').submit(function () {
			var formData = $(this).serializeArray();
			var fieldsWithErrors = [];

			$(formData).each((function (index, element) {
				var required = $(this).find('[name="' + element.name + '"]').attr('required');
				var empty = (element.value.trim().length === 0);

				if (required && empty) {
					fieldsWithErrors.push(element.name);
				}
			}).bind(this));

			if (fieldsWithErrors.length === 0) {
				var postUrl = $(this).attr('action');
				var payload = $.param(formData);

				$.ajax({
					type: 'POST',
					url: postUrl,
					data: payload,
					success: function (response) {
						var comment = getComment(response);

						addComment(comment);
					},
					error: function (response) {
						console.log('** ERROR!');
						console.log(response);
					}
				});

				$(this).get(0).reset();
			}

			return false;
		});

		$('.js-load-more-articles').click(function () {
			$(this).addClass('cta--progress');
			
			loadMoreArticles((function () {
				$(this).removeClass('cta--progress');
			}).bind(this));

			sendGAEvent('Articles', 'Load more');

			return false;
		});

		$('#search-toggle').change(function () {
			if ($(this).is(':checked')) {
				setTimeout(function () {
					$('#search-input').focus();
				}, 500);

				sendGAEvent('Search', 'Open');
			}
		});

		$('.js-post-navigation-arrow').click(function () {
			sendGAEvent('Articles', 'Article navigation');
		});
	}

	function adjustFeatureWidth() {
		var $feature = $('.feature-title');
		var containerWidth = $feature.parent().width();

		$feature.children('.feature-title__part').each(function () {
			$(this).attr('style', '').css({
				'display': 'inline-block',
				'opacity': 0
			});

			var fontSize = Math.floor(containerWidth / $(this).width() * 100);

			$(this).css({
				'font-size': fontSize + '%',
				'display': 'block',
				'opacity': 1
			});
		});
	}

	function loadMoreArticles(callback) {
		var currentPage = parseInt($main.attr('data-paginator-current'));
		var totalPages = parseInt($main.attr('data-paginator-total'));
		var nextPage = currentPage + 1;

		if (nextPage > totalPages) {
			return;
		}

		if (nextPage == totalPages) {
			noMoreArticles();
		}

		$.get('https://eduardoboucas.com/page/' + nextPage, function (response) {
			var html = $.parseHTML(response);
			var posts = $(html).filter('#main').children();

			// Append posts
			$main.append(posts);

			// Update state
			$main.attr('data-paginator-current', nextPage);

			// Fire callback
			callback();
		});
	}

	function noMoreArticles() {
		$('.js-paginator').remove();
	}

	function sendGAEvent(primary, secondary) {
		if (window.ga !== undefined) {
			if (secondary !== undefined) {
				ga('send', 'event', primary, secondary);	
			} else {
				ga('send', 'event', primary);
			}
		}
	}

	// --------------------------------------------------------------
	// Templating
	// --------------------------------------------------------------

	function getComment(data) {
		var template = $('#template-comment').text();
		data.index = $('.js-comment').length;

		for (var variable in data) {
			var exp = new RegExp('{' + variable + '}', 'g');

			template = template.replace(exp, data[variable]);
		}

		return template;
	}

	function addComment(comment) {
		$('.js-comments').removeAttr('aria-hidden').append(comment);
	}

	// --------------------------------------------------------------
	// Initialisation
	// --------------------------------------------------------------

	function init() {
		bindUiEvents();

		if (window.SimpleJekyllSearch) {
			initSearch();
		} else {
			window.SimpleJekyllSearchInit = initSearch;
		}
	}

	function initSearch() {
		var resultTemplate = '';

		resultTemplate += '<a href="{url}" class="search-result">';
		resultTemplate += '	<p class="search-result__date">{date}</p>';
		resultTemplate += '	<p class="search-result__title">{title}</p>';
		resultTemplate += '</a>';

		SimpleJekyllSearch({
			searchInput: document.getElementById('search-input'),
			resultsContainer: document.getElementById('search-results'),
			json: window.searchDatabase,
			noResultsText: '<p class="search-results__message">No results, sorry.</p>',
			searchResultTemplate: resultTemplate
		});		
	}

	init();

	// --------------------------------------------------------------
	// Public access
	// --------------------------------------------------------------

	return {
		init: init,
		getComment: getComment,
		loadMoreArticles: loadMoreArticles
	}
})(jQuery);
