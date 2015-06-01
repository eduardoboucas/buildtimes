var blog = {
	loadMorePosts: function () {
		var _this = this;
		var $blogContainer = $('#blog');
		var nextPage = parseInt($blogContainer.attr('data-page')) + 1;
		var totalPages = parseInt($blogContainer.attr('data-totalPages'));

		$(this).addClass('loading');

		$.get('/blog/page' + nextPage + '/index.html', function (data) {
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
			$('html').addClass('search-mode');
			$('#search__field').focus();
		});

		$('#search__close').click(function () {
			$('html').removeClass('search-mode');
		});

		$('#comments-form').submit(function () {
			var url = $(this).attr('action');
			var data = $(this).serialize();

			var formName = $(this).find('[name="name"]').val().trim();
			var formUrl = $(this).find('[name="url"]').val().trim();
			var formEmail = $(this).find('[name="email"]').val().trim();

			$.ajax({
				type: "POST",
				url: url,
				data: data,
				success: function (data) {
					var parsedData = JSON.parse(data);

					blog.addComment(parsedData.hash, parsedData.date, formName, formUrl, parsedData.message);
				}
			});

			ga('send', 'event', 'Comments', 'New comment');

			return false;
		});
	},

	bindKeys: function () {
		$(document).keyup(function(e) {
			if (e.keyCode == 27) {
				$('html').removeClass('search-mode')
			}
		});
	},

	addComment: function (hash, date, name, url, message) {
		var template = document.getElementById('template--new-comment').innerHTML;

		template = template.replace('@hash', hash)
						   .replace('@date', date)
						   .replace('@name', name)
						   .replace('@message', message);

		if (url != '') {
			template = template.replace('@url', url);
		}

		$(template).insertBefore('.comments__new');
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
		blog.initSearch();
	}
};

$(document).ready(blog.init);