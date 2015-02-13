var blog = {
	initComments: function (data) {
		if (data.length > 0) {
			$("#comments").html(data);	
		} else {
			$("#comments").html('<p>This post doesn\'t have any comments yet.</p>');
		}
	},

	loadMorePosts: function () {
		var _this = this;
		var $blogContainer = $("#blogContainer");
		var nextPage = parseInt($blogContainer.attr("data-page")) + 1;
		var totalPages = parseInt($blogContainer.attr("data-totalPages"));

		$(this).addClass("loading");

		$.get("/blog/page" + nextPage, function (data) {
			var htmlData = $.parseHTML(data);
			var $articles = $(htmlData).find("article");

			$blogContainer.attr("data-page", nextPage).append($articles);

			if ($blogContainer.attr("data-totalPages") == nextPage) {
			  $(".loadMore").remove();
			}

			$(_this).removeClass("loading");
		});
	},

	bindUiEvents: function () {
		$("body").on("click", "pre", function () {
			$(this).toggleClass("expanded");
		});
	},

	bindGAEvents: function () {
		$("section.comments form").submit(function () {
			ga('send', 'event', 'Comments', 'New comment');
		});
	},

	processUrl: function () {
		var url = window.location.href;
	},
	
	init: function () {
		$('#fade-overlay').fadeOut();
		blog.bindUiEvents();
		blog.bindGAEvents();
	}
};

$(".loadMore").click(blog.loadMorePosts);
$(document).ready(blog.init);

if ((document.referrer == 'http://eduardoboucas.com/') || (document.referrer == 'http://eduardoboucas.com/#')) {
	var overlay = document.createElement('div');
	overlay.style.width = '100%';
	overlay.style.height = '100%';
	overlay.style.position = 'fixed';
	overlay.style.left = 0;
	overlay.style.top = 0;
	overlay.style.backgroundColor = 'white';
	overlay.id = 'fade-overlay';

	document.body.appendChild(overlay);
}