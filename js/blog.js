var blog = {
	initComments: function (data) {
		if (data.length > 0) {
			$('#comments').html(data);	
		} else {
			$('#comments').html('<p>This post doesn\'t have any comments yet.</p>');
		}
	},

	loadMorePosts: function () {
		var _this = this;
		var $blogContainer = $('#blog');
		var nextPage = parseInt($blogContainer.attr('data-page')) + 1;
		var totalPages = parseInt($blogContainer.attr('data-totalPages'));

		$(this).addClass('loading');

		$.get('/blog/page' + nextPage + '/', function (data) {
			var htmlData = $.parseHTML(data);
			var $articles = $(htmlData).find('article');

			$blogContainer.attr('data-page', nextPage).append($articles);

			if ($blogContainer.attr('data-totalPages') == nextPage) {
			  $('.load-more-posts').remove();
			}

			$(_this).removeClass('loading');
		});
	},

	bindUiEvents: function () {
		$('pre').click(function () {
			$(this).toggleClass('expanded');
		});

		$('.blog__back-to-site').click(function () {
			var _this = this;

			$('body').fadeOut('slow', function () {
				window.location.href = $(_this).attr('href');
			});

			return false;
		});

		$('.load-more-posts').click(blog.loadMorePosts);

		$('#blog-header__search').click(function () {
			$('body').addClass('body--search');
		});

		$('#search__close').click(function () {
			$('body').removeClass('body--search');
		});
	},

	bindGAEvents: function () {
		$('section.comments form').submit(function () {
			ga('send', 'event', 'Comments', 'New comment');
		});
	},

	bindKeys: function () {
		$(document).keyup(function(e) {
			if (e.keyCode == 27) {
				$('body').removeClass('body--search')
			}
		});
	},

	initSearch: function () {
		SimpleJekyllSearch.init({
			searchInput: document.getElementById('search__field'),
			resultsContainer: document.getElementById('search__results'),
			dataSource: '/feeds/search.json',
			searchResultTemplate: '<li class="search__result"><a href="{url}">{title}</a> — ({date})</li>'
		});
	},

	init: function () {
		if (((document.referrer == 'http://eduardoboucas.com/') || (document.referrer == 'http://eduardoboucas.com/#')) ||
		   ((document.referrer == 'https://eduardoboucas.com/') || (document.referrer == 'https://eduardoboucas.com/#'))) {
			$('body').hide().fadeIn('slow');
		}

		blog.bindKeys();
		blog.bindUiEvents();
		blog.bindGAEvents();
		blog.initSearch();
	}
};

$(document).ready(blog.init);