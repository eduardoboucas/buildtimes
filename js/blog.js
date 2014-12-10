var blog = {
	initComments: function (data) {
		if (data.length > 0) {
			$("#comments").html(data);	
		} else {
			$("#comments").html('<p>This post doesn\'t have any comments yet.');
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
		$(".highlight").click(function () {
			$(this).toggleClass("expanded");
		});
	},
	
	init: function () {
		blog.bindUiEvents();
	}
};

$(".loadMore").click(blog.loadMorePosts);
$(document).ready(blog.init);