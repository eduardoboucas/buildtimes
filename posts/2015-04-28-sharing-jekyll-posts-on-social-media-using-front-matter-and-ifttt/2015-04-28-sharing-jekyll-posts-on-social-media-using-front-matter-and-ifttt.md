---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/sharing-jekyll-posts-on-social-media-using-front-matter-and-ifttt.html"
layout: post
title: "Sharing Jekyll posts on social media using front matter and IFTTT"
tags:
  - blog
  - jekyll
  - social
  - media
  - ifttt
---

Whenever I write a post on my blog, I like to share it on the different social media platforms I have a presence on. I started by doing that manually, creating updates myself with links to my posts, but soon realised that something like [IFTTT](https://ifttt.com/) would be perfect to automate the process. Jekyll comes with an RSS feed out of the box so it's just a matter of creating a recipe where you say _"whenever there's a new post on this feed, publish an update to A, B and C"_.

But I wanted a bit more flexibility. Maybe I'm writing a post that is way too technical to share on Facebook, or a post that I definitely want on my LinkedIn, or even a post that just adds a couple of points to a previous one so I don't want to share it at all. What I wanted was a way to select which social platforms to share on right from the post's front matter.<!--more-->

This is something that I had been thinking for a while and I even considered creating a my own service people could use to do this, but actually it can be done with IFTTT and a bit of creativity on the Jekyll side.

## The idea

Instead of using the normal RSS feed as the trigger for our IFTTT, we can have one feed for each social platform. For example, `feed-facebook.xml` would contain all the posts we want to share on Facebook. If we want to share a post on Twitter and LinkedIn, then it would appear in both `feed-twitter.xml` and `feed-linkedin.xml`. Then we can use those feeds as the source for the individual IFTTT recipes.

Here's the idea:

{% include helpers/image.html name:"jekyll-social-after.png" caption:"Serving separate feeds to different IFTTT channels" %}

## Creating the feeds

The first step is to create the RSS feeds for the different platforms. Instead of duplicating the code over and over again for each platform, we can define a layout that all feeds will inherit.

```html
<!-- _layouts/social-feed.xml -->
---
layout: social-feed
---
{% raw %}<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>{{ site.blog_title | xml_escape }}</title>
    <description>{{ site.blog_description | xml_escape }}</description>
    <link>{{ site.site_url }}{{ site.blog_url }}</link>
    <atom:link href="{{ "/feed.xml" | prepend: site.blog_url | prepend: site.site_url }}" rel="self" type="application/rss+xml" />
    <pubDate>{{ site.time | date_to_rfc822 }}</pubDate>
    <lastBuildDate>{{ site.time | date_to_rfc822 }}</lastBuildDate>
    <generator>Jekyll v{{ jekyll.version }}</generator>
    {% assign platform = page.title | downcase %}
    {% for post in site.posts limit:10 %}
        {% assign share = post.share | downcase %}
        {% if share contains platform %}
        <item>
            <title>{{ post.title | xml_escape }}</title>
            <description>{{ post.content | xml_escape }}</description>
            <pubDate>{{ post.date | date_to_rfc822 }}</pubDate>
            <link>{{ post.url | prepend: site.site_url }}</link>
            <guid isPermaLink="true">{{ post.url | prepend: site.site_url }}</guid>
            {% for tag in post.tags %}
            <category>{{ tag | xml_escape }}</category>
            {% endfor %}
            {% for cat in post.categories %}
            <category>{{ cat | xml_escape }}</category>
            {% endfor %}
        </item>
        {% endif %}
    {% endfor %}
  </channel>
</rss>
{% endraw %}
```

This looks really similar to the normal RSS feed file Jekyll ships with, but there are a few nuances. When we're looping through the posts, instead of echoing an `item` node automatically we check to see if it has a `share` property and if it contains the name of the social platform we're testing for — after converting everything to lowercase to do a case-insensitive comparison (lines 15 and 17).

With this layout in place, adding a new platform to the system means creating a simple file with just a bit of information in the front matter and no body. Here's an example of such file for Facebook:

```text
<!-- social-feeds/facebook.xml -->
---
layout: social-feed
title: Facebook
---
```

When your site is compiled, there should have an RSS file on _http://your-site/social-feeds/facebook.xml_ containing only the posts selected to be shared on Facebook. Of course we didn't select any posts yet, so read on.

## Working on the front matter

We want to be able to select which social platforms to share each individual post on, so we need to add that information to the front matter of every post. Taking the example of this very post you're reading, this is how it would look if I wanted to share it on Facebook, Twitter and LinkedIn (assuming I have created the individual feeds for those platforms following the steps above):

```text
---
layout: post
title:  "Sharing Jekyll posts on social media using front matter and IFTTT"
date:   2015-04-28 09:32:00
categories: blog
tags: jekyll social media ifttt
share: facebook twitter linkedin
---
Whenever I write a post on my blog (...)
```

On line 7 you can see that I define a property called `share` with the list of the platforms I want to share this post on. Note that the names must match the `title` property of your individual XML files.

If you find yourself sharing the majority of your posts on the same platforms, you can define a default value for `share` which you can then override if necessary on a per-post basis. To do that, add the following to your `_config.yml` file.

```text
defaults:
  -
    scope:
      path: ""
      type: "posts"
    values:
      share: facebook linkedin # Sharing on Facebook and LinkedIn by default
```

## Setting up IFTTT

With everything good to go on the Jekyll side, it's time to set everything up on IFTTT — create an account if you don't have one and click on [Create a Recipe](https://ifttt.com/myrecipes/personal/new).

The first step is to select the channel that triggers the action (the **This** part); in our case, a it's a Feed.
In the next step we select _New feed item_ as the trigger, meaning that the recipe will run every time there's a new item in the feed and then enter the feed URL.

{% include helpers/image.html name:"IFTTT-1.png" caption:"Setting up my Facebook feed on IFTTT (step 3 of 7)" %}

Then we're off to the **That** part. In this example, I'm setting up the feed for Facebook so I select it from the list of available action channels — you have plenty of other options to choose from here. In the next step we go with _Create a link post_ as that allows us to share a link to our post along with any message we want. That can be configured in the next screen, where you can use "Ingredients" to form your link and message. In this example, I'm going with a direct link to the article and a message saying "New blog post:" and then the title of the post.

{% include helpers/image.html name:"IFTTT-2.png" caption:"Setting up my Facebook feed on IFTTT (step 6 of 7)" %}

## Going one step further: the Twitter case

We're pretty much done, you just need to repeat the above steps for each of the social media platforms you want to use. But we could go one step further. When posting things to Twitter, it's a common practice to include hashtags to make the tweet easier to find by people who are interested in the topics you're writing about. So if you're using tags in your posts, wouldn't it make sense to add them to your tweet as hashtags?

This is actually easier said than done because it isn't just a matter of grabbing all the tags from a post and appending them to the tweet. There's a limit on the number of characters in a tweet, so we need to check how many will fit — depending on the post's title and tags, we might be able to fit just one of them, all of them or even none at all.

My solution was to create a separate feed file for Twitter using its own logic rather than inheriting the `social-feed` layout. In a nutshell, here's what it does:

1. Check if the author wants to include hashtags by checking for the presente of `--twitter-hashtags` in the `share` property of a post;
2. Calculate how much space there is left in the tweet for tags;
3. Go through the list of tags, in order of appearence, and add it to the post title until there's no more space;
4. Generate a tweet following a pre-defined format using the post's title, link and tags.

I'm not going through the specifics of how to implement this because this post would become huge, so I've created [a GitHub repository](https://github.com/eduardoboucas/jekyll-social) where you can find more information about the full implementation and grab the code to use in your project.

## Wrapping up

And that's it! Now just sit down, find the inspiration and write your posts — you don't even need to be social anymore because Jekyll and IFTTT will take care of that for you. You're welcome.<!--tomb-->
