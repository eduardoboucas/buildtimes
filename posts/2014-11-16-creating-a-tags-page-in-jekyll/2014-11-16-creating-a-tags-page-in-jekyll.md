---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/creating-a-tags-page-in-jekyll.html"
layout: post
title: "Creating a tags page in Jekyll"
tags:
- blog
- jekyll
- tags
- html5
---
Jekyll supports post tagging by default, but you have to do some work to get something out of it. It reads tags directly from the front matter on posts, but then what? Does it allow users to search posts by tag? Does it create a tags aggregation page? No sir. You'd probably need plugins to achieve that level of functionality, but there are still some things you can achieve without them.<!--more-->

In this post I'll describe how I implemented tags on my blog, from including them in posts to creating a tags page, with some cool new HTML5 stuff along the way. Buckle up!

## Including tags in posts
Attaching tags to a post is a no-brainer. This is how the front matter for this post looks like:

```text
---
layout: post
title: "Creating a tags page in Jekyll"
date: 2014-11-16 18:29:00
categories: blog
tags: jekyll tags html5 details
---
```

In line 6, I define all the tags I want to use. Then it's time to display them in my post layout:

```html
<!-- _layouts/post.html -->
{{ "{%" }} if page.tags %}
  <span class="tags">
    <img src="/assets/images/icons/tag.svg" class="postIcon"/> 
    {{ "{%" }} for tag in page.tags %} 
      <em>{{ "{{" }} tag }}</em>
    {{ "{%" }} endfor %}
  </span>
{{ "{%" }} endif %}
```

Iterating through all the tags in the post and printing the tag name. Nice and simple! But this alone isn't much useful, is it? Let's see how we can create a page that aggregates all the tags with links to the posts they're associated with.

## Creating a tags page
Jekyll stores all tags in an array called `site.tags` where to each index (the tag name) corresponds an array containing all the posts associated with the given tag. I created a new page inside my *blog/* folder and used that array to create a tag aggregation page:

```html
<!-- blog/tags.html -->
...

<h2>Tags</h2>
{{ "{%" }} assign sortedTags = (site.tags | sort:0) %}
{{ "{%" }} for tag in sortedTags %}
  <details id="tag-{{ "{{" }} tag[0] }}">
    <summary>
      <a name="{{ "{{" }} tag[0] }}">{{ "{{" }} tag[0] }} <span>({{ "{{" }} tag[1].size }})</span></a>
    </summary>
    <ul>
      {{ "{%" }} for post in tag[1] %}
        <li><a href="{{ "{{" }} post.url }}">{{ "{{" }} post.title }}</a> — {{ "{{" }} post.date | date_to_string }}</li>
      {{ "{%" }} endfor %}
    </ul>         
  </details>
{{ "{%" }} endfor %}

...
```

Okay, so what's happening here? I start by sorting the tabs alphabetically by tag name, since the `site.tags` array seems to be sorted by post date (line 4). The next step is to iterate through the sorted array of tags and start displaying them using an expandable/collapsible element, using the new and shiny [details and summary elements from HTML5](http://html5doctor.com/the-details-and-summary-elements/). This will make the page less messy as the number of posts and tags increases, since we'll only expand the tags we want to browse.

Each tag will have the tag name on index 0 and the list of posts on index 1, so we start by printing the tag name with an anchor as well as an indication of the number of posts the tag is associated with (line 8). After that, it's time to iterate through all those posts to print them in a list, with a link to the post and the post date (12).

The idea behind attaching an anchor to a tag is that we can link directly to it (e.g. *blog.url/tags.html#javascript) and the page will scroll automatically to the right place, but that won't work very well with the `details` element. By default, all those elements will be collapsed, so when you link directly to one of the tags you'll still have to expand it manually to see the posts it contains. We can use a bit of JavaScript as a workaround:

```javascript
window.addEventListener("load", function () {
  if (window.location.hash != "") {
    var tagId = "tag-" + window.location.hash.slice(1);
    var tagObject = document.getElementById(tagId);
    var attribute = document.createAttribute("open");
    attribute.value = "open";

    tagObject.setAttributeNode(attribute);
  }
});
```

So when the page loads, we check if the URL contains an hash (meaning that we're trying to link directly to a specific tag). If so, we extract the tag name from the URL, get the `details` element containing the tag and expand it by appending the *open* attribute. Not extremely sexy, but it works.

The [browser support for the `details` element](http://caniuse.com/#feat=details) is not very appealing, but the good thing is that non-supporting browsers will just see everything expanded, so nothing will look broken. There are some [polyfills](http://html5doctor.com/the-details-and-summary-elements/#fallbacks) you can use if you really want to have a consistent behaviour across browsers.

As for the tags page itself, it works. Conventional blog platforms would probably provide a more advanced system with a tag search system or a tag cloud, but these are trickier to achieve in Jekyll, especially without plugins. To me, this solution is a good enough implementation of tags and it helps keeping the system simple and effective.<!--tomb-->

*Check out the result of this implementation [on my tags page](http://eduardoboucas.com/blog/tags.html).*