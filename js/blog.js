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

		$.get('/blog/page' + nextPage, function (data) {
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
		$('body').on('click', 'pre', function () {
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
	},

	bindGAEvents: function () {
		$('section.comments form').submit(function () {
			ga('send', 'event', 'Comments', 'New comment');
		});
	},

	init: function () {
		if ((document.referrer == 'http://eduardoboucas.com/') || (document.referrer == 'http://eduardoboucas.com/#')) {
			$('body').hide().fadeIn('slow');
		}
		
		blog.bindUiEvents();
		blog.bindGAEvents();
	}
};

$(document).ready(blog.init);