var eb = (function ($) {
  var $main = $('#main');

  // --------------------------------------------------------------
  // UI events
  // --------------------------------------------------------------
  
  function bindUiEvents() {
    $(window).load(function () {
      adjustFeatureWidth();

      // Init masonry
      $('.js-posts').masonry({
        itemSelector: '.post-wrapper'
      });

      // Loading content from previous pages
      if ($('#main').data('paginator-current') > 1) {
        var $firstPost = $('.js-post').eq(0);
        var initialOffset = $firstPost.offset().top;
        
        loadPosts(function () {
          var diff = $firstPost.offset().top - initialOffset;

          $(document).scrollTop(diff);
        }, true);
      }
    });

    $(window).resize(function () {
      adjustFeatureWidth();
    });

    $(document).ready(function() {
      // Lazy load images
      $('.js-lazyload').unveil();
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
            var message = response.success ? 'Thanks for your comment. It will appear on the site shortly.' : 'Oops! There was an error when submitting your comment. Please try again.';

            toaster(message);
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
      
      loadPosts((function () {
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

  function fetchPages(pageNumbers, callback) {
    var pages = [];

    $.each(pageNumbers, function (index, pageNumber) {
      var endpoint = (pageNumber === 1) ? '/' : '/page/' + pageNumber + '/';

      $.get(endpoint, function (response) {
        var html = $.parseHTML(response);

        pages[index] = $(html);

        if (pages.length === pageNumbers.length) {
          var output = pages[0];

          if (!output) return;

          for (var i = 1; i < pageNumbers.length; i++) {
            output = output.add(pages[i]);
          }

          callback(output);
        }
      });
    });
  }

  function getRangeArray(from, to) {
    var range = [];

    for (var i = from; i <= to; i++) {
      range.push(i);
    }

    return range;
  }

  function loadPosts(callback, previousPages) {
    var currentPage = parseInt($main.attr('data-paginator-current'));
    var totalPages = parseInt($main.attr('data-paginator-total'));
    var $existingPosts = $main.find('.js-posts');
    var pageNumbers;

    if (previousPages) {
      pageNumbers = getRangeArray(1, currentPage - 1)
    } else {
      var nextPage = currentPage + 1;

      if (nextPage > totalPages) {
        return;
      }

      if (nextPage === totalPages) {
        $('.js-paginator').remove();
      }

      pageNumbers = [nextPage];

      if (typeof window.history !== 'undefined') {
        window.history.pushState({}, '', '/page/' + nextPage + '/');
      }
    }

    fetchPages(pageNumbers, function ($pages) {
      var $posts = $pages.find('.js-post');

      if (previousPages) {
        $existingPosts
          .prepend($posts)
          .masonry('prepended', $posts)
          .one('layoutComplete', callback);

        // Appending featured post (if any)
        var $featuredPost = $pages.find('.js-post-featured')

        if ($featuredPost) {
          $existingPosts.before($featuredPost);

          setTimeout(adjustFeatureWidth, 300);
        }
      } else {
        $existingPosts
          .append($posts)
          .masonry('appended', $posts);
        $main.attr('data-paginator-current', currentPage + 1);

        if (typeof callback === 'function') {
          callback();
        }
      }
    })
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
  // Toaster
  // --------------------------------------------------------------

  function toaster(message) {
    $('#toaster').remove();

    var html = '<div id="toaster" class="toaster">'
    + '<button type="button" class="toaster__close js-close-toaster">&times;</button>'
    + '<p>' + message + '</p>'
    + '</div>'

    $('#main').append(html);

    setTimeout(function () {
      closeToaster();
    }, 5000);
  }

  function closeToaster() {
    $('#toaster').fadeOut(300, function () {
      $(this).remove();
    })
  }

  $('body').on('click', '.js-close-toaster', function () {
    closeToaster();
  });

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

    initAudio();
  }

  function initSearch() {
    var resultTemplate = '';

    resultTemplate += '<a href="{url}" class="search-result small-card">';
    resultTemplate += ' <p class="small-card__pre">{date}</p>';
    resultTemplate += ' <p class="small-card__title">{title}</p>';
    resultTemplate += '</a>';

    SimpleJekyllSearch({
      searchInput: document.getElementById('search-input'),
      resultsContainer: document.getElementById('search-results'),
      json: window.searchDatabase,
      noResultsText: '<p class="search-results__message">No results, sorry.</p>',
      searchResultTemplate: resultTemplate
    });   
  }

  function initAudio() {
    var $audio = $('.js-audio');
    var audio = $audio.get(0);
    var $audioControlPlay = $('.js-audio-play');
    var $audioControlPause = $('.js-audio-pause');

    var updateAudioControl = function (playing) {
      if (playing) {
        $audioControlPlay.attr('aria-hidden', 'true');
        $audioControlPause.removeAttr('aria-hidden');
      } else {
        $audioControlPlay.removeAttr('aria-hidden');
        $audioControlPause.attr('aria-hidden', 'true');
      }
    }

    var toggleAudio = function () {
      if (!audio.paused) {
        audio.pause();
        updateAudioControl(false);
      } else {
        audio.play();
        updateAudioControl(true);

        sendGAEvent('Articles', 'Audio play');
      }
    }

    $audioControlPlay.click(toggleAudio);
    $audioControlPause.click(toggleAudio);
    $audio.on('ended', function () {
      updateAudioControl(false);
    });
  }

  init();

  // --------------------------------------------------------------
  // Public access
  // --------------------------------------------------------------

  return {
    init: init,
    toaster: toaster
  }
})(jQuery);
