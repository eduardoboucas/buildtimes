---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/adding-ajax-pagination-to-jekyll.html"
layout: post
title:  "Adding Ajax pagination to Jekyll"
tags:
- blog
- jekyll
- pagination
- backbonejs
---
Jekyll has a [built-in pagination system](http://jekyllrb.com/docs/pagination/) that allows you to break your blog posts into pages with a given number of posts, automatically creating all the files and folders necessary and making it really easy to generate and include the page navigation interface for your pages.

By adding `paginate: 5` to the config file (`_config.yml`) and doing a couple of minor tweaks to the code that loads site posts, Jekyll will automatically create pages with a maximum of 5 posts with the default URL pattern of *yourblog.url/page2*, *yourblog.url/page3* and so on. But this wasn't exactly what I was after.<!--more-->

I find it annoying to keep clicking next and watching a page reload over and over again when trying to find an older post. I wanted to dynamically append more posts to the page as the user demanded them, without having to reload the page. Yes, you're thinking Ajax and you're absolutely right.

So this is exactly what I wanted:

- I define the number of posts per page in my `_config.yml` .
- If I have enough posts to make a second page, I display a link saying *Load more posts*.
- Clicking that link will append the additional posts to the bottom of the page.
- I still want to be able to directly access a given page by its URL (e.g. *http://eduardoboucas.com/blog/page8*).
- All this has to work with the two entry points to my blog: the standalone version and the Backbone.js integration (more on this later).

Let's first understand how Jekyll deals with pagination and how we can implement the classic pagination system before we extend it further.

## Understanding pagination in Jekyll
The centrepiece of Jekyll's pagination system is [an object called *paginator*](http://jekyllrb.com/docs/pagination/#liquid-attributes-available), which exposes information such as the current page number, the posts for the current page or the total number of pages. 
With this, we can quickly implement pagination in our blog posts listing page:

```html
<!-- Without pagination (we load all posts) -->
{{ "{%" }} for post in site.posts %}
  <a href="{{ "{{" }} post.url }}">{{ "{{" }} post.title }}</a>
{{ "{%" }} endfor %}

<!-- With pagination (we load the posts for the current page) -->
{{ "{%" }} for post in paginator.posts %}
  <a href="{{ "{{" }} post.url }}">{{ "{{" }} post.title }}</a>
{{ "{%" }} endfor %}
```

And then we add a very simple navigation system

```html
<!-- If we have a previous page, we show a link to it -->
{{ "{%" }} if paginator.previous_page %}
  <span class="previous"><a href="{{ "{{" }} paginator.previous_page_path }}"><- Previous</a></span>
{{ "{%" }} endif %}

<!-- If we have a next page, we show a link to it -->
{{ "{%" }} if paginator.next_page %}
  <span class="next"><a href="{{ "{{" }} paginator.next_page_path }}">Next -></a></span>
{{ "{%" }} endif %}
```

BAM! It works. Now you can navigate using the generated links or link directly to a specific page by appending */pageN* to your site url (where *N* is the page number, duh).

## Dodging some limitations
Before flying to Ajax land, let me go back to that last bullet point of my requirements list for a bit. I'll quickly sum up why I needed to do it and why that forced me to do things a bit different. You probably won't have the same problem as I did because you're very unlikely to use the same architecture, but it's still worth reading this bit to understand how everything works and what parts you can change and adapt.

The centrepiece of my blog is a file called *posts.html* located inside my `_includes/blog` folder. Instead of having a main *index.html* loading the posts, I have two completely separate front pages (the standalone version of my blog, located at *blog/index.html*, and the [Blog](http://eduardoboucas.com/#/blog) section of my Backbone.js website, located at *blog.html*) including a file that loads the posts and writes them into a DOM structure, which they then wrap and handle in different ways ([more on this here](/blog/2014/10/09/the-story-behind-my-website.html)).

One of the limitations of the *paginator* is that [it's only available in index files](http://jekyllrb.com/docs/variables/#paginator), so I could access it from the standalone version of the blog, but I was getting an empty object when accessing it from the Backbone version. After banging my head against the wall for a couple of hours, I overcame this limitation by manually iterating over the site posts instead of using the *paginator* for that. It turned out to be very didactic so I'm sharing that with you.

```html
<!-- Normal approach: Iterating through posts using paginator -->
{{ "{%" }} for post in site.posts limit:site.paginate offset:offset %}
  <!-- Display post -->
{{ "{%" }} endfor %}

<!-- My approach: Iterating through posts manually (without paginator) -->
{{ "{%" }} if paginator.page %}
  {{ "{%" }} assign offset = paginator.page | minus:1 | times:paginator.per_page %}
{{ "{%" }} else %}
  {{ "{%" }} assign offset = 0 %}
{{ "{%" }} endif %}

{{ "{%" }} for post in site.posts limit:site.paginate offset:offset %}
  <!-- Display post -->
{{ "{%" }} endfor %}
```

So what's happening here? I start by calculating the offset in the posts array. If we can access the paginator, then the offset will be the current page number (minus one, because our page numbers start on 1 and not 0) multiplied by the number of posts per page (line 8). It's all simple math, really: if we have 5 posts per page and we want to access page 3, our offset will be `(3-1) * 5 = 10` which is the index of the first post we display.
Otherwise, if we can't access the paginator (which for me happens everything this file is included in the Backbone version of the blog), we just say the offset is 0, which will display the first page of posts (line 10).

With the offset calculated, it's really simple to get the exact portion of posts we're after. In line 13, we iterate through all posts with a limit of `site.paginate` (the number of posts per page defined in our config file) starting in post number `offset`. Note that I'm using `site.paginate` instead of the equivalent `paginator.per_page` because this expression must run in both versions of the blog and our paginator object is not always available.

## Let's finally Ajaxify this thing, shall we?
The plan is to have the first page displaying the 5 most recent posts. If there are enough posts to fill a second page, I will show the *Load more posts* link. When I click that link, I want to append the second page of posts to the bottom of the list and then re-evaluate the status of the pagination: if I still have posts that haven't been shown, I'll leave the link; otherwise, I know I've reached the end of the post box and so I'll remove the link.

Let's write some code then.

```html
{{ "{%" }} if paginator.page %}
  {{ "{%" }} assign offset = paginator.page | minus:1 | times:paginator.per_page %}
  {{ "{%" }} assign currentPage = paginator.page %}
{{ "{%" }} else %}
  {{ "{%" }} assign offset = 0 %}
  {{ "{%" }} assign currentPage = 1 %}
{{ "{%" }} endif %}

<div id="blogContainer" class="postContainer" data-page="{{ "{{" }} currentPage }}" data-totalPages="{{ "{{" }} paginator.total_pages }}">
  {{ "{%" }} for post in site.posts limit:site.paginate offset:offset %}
    <article class="post list">
      <header>
        <h1><a class="readPost" href="{{ "{{" }} post.url | prepend: site.baseurl }}">{{ "{{" }} post.title }}</a></h1>
        <p class="postMeta">
          <span class="date"><img src="/assets/images/icons/time.svg" class="postIcon"/> {{ "{{" }} post.date | date: "%b %-d, %Y" }}</span>
          <span class="permalink"><img src="/assets/images/icons/link.svg" class="postIcon"/> <a href="{{ "{{" }} post.url }}">Permalink</a></span>
        </p>
      </header>
      <div class="excerpt">
        {{ "{%" }} if post.content contains '<!--more-->' %}
          <a class="readPost" href="{{ "{{" }} post.url }}">{{ "{{" }} post.content | split:'<!--more-->' | first }}</a>
          <p class="cta"><a class="readPost rightArrow" href="{{ "{{" }} post.url }}">Read full post</a></p>
        {{ "{%" }} else %}
          {{ "{{" }} post.content }}
        {{ "{%" }} endif %}
      </div>
    </article>
  {{ "{%" }} endfor %}
</div>

{{ "{%" }} assign postCount = site.posts | size %}
{{ "{%" }} assign postsCovered = site.paginate | plus:offset %}
{{ "{%" }} if postsCovered < postCount %}
  <button class="loadMore">Load more posts</button>
{{ "{%" }} endif %}

<script>
  {{ "{%" }} include blog/pagination.js %}
</script>
```

In lines 1 to 7 I create the `offset` variable I need to iterate through `site.posts`, as explained above. Additionally, I create a variable containing the current page. Again, I only need this because sometimes I don't have access to `paginator.page`, and so I need a variable that always works.

I then start by adding two data attributes to my post container, `data-page` and `data-totalPages`, containing the current page and the total number of pages, respectively. This information may seem redundant now, but it will be crucial for the JavaScript routine that will form and send the Ajax requests for more posts.

I then need to evaluate if all the posts have been covered or if there are still more pages to show (lines 31 to 33) and, based on that, I'll show or hide the *Load more posts button*. Finally, I include the JavaScript file that will handle the Ajax requests, shown below.

```javascript
$(".loadMore").click(loadMorePosts);

function loadMorePosts() {
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
}
```

The function `loadMorePosts()` does all the magic — and yes, you absolutely should wrap it inside your self-contained module or object. It reads the data attributes that we set before to know what the next page will be and how many pages there are in total (lines 6 and 7). With that information, it sends the Ajax request and gets ready to process the result (line 11).

It parses the resulting HTML code into the variable `htmlData` (line 12) and uses it to find the posts — `article` elements — which is the only thing we need anyway. We ignore everything else, such as the blog header and footer. It then appends the resulting articles to the end of the post container and updates the data attribute with the new page number (line 15).

If the new page number is the same as the total number of pages, then we don't have any more posts to show. In that case, we can just remove the *Load more posts* link from the page (lines 17 to 19).

Finally, you may notice that we're appending and removing the class `loading` from our link (lines 9 and 21). The idea is that when the user clicks on the link, its text changes to *Loading...*, giving the indication that the page is waiting for new content to be appended. As soon as the response from the Ajax request comes back and the posts are appended to the page, the link goes back to its original state.
This is the CSS behind it.

```sass
.loadMore {
  @extend %textButton;
  position: relative;
  display: block;
  margin: 0 auto;
  
  &.loading {
    &::after {
      position: absolute;
      left: 0;
      right: 0;
      background-color: white;
      width: 100%;
      content: 'Loading...';
      color: #bcbcbc;
    }
  } 
}
```

And that's it. It would be really simple to attach the `loadMorePosts()` function to the scroll event, so that you would automatically load more posts as the user reaches the bottom of the page. 

Feel free to drop me an email or a tweet if you have any questions. As for me, I'll be around writing more stuff so that I have enough posts to make use of my awesome pagination system.<!--tomb-->