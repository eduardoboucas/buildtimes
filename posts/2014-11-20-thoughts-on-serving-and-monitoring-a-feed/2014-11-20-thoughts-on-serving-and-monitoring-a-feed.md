---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/thoughts-on-serving-and-monitoring-a-feed.html"
layout: post
title: "Thoughts on serving and monitoring a feed"
tags:
  - blog
  - rss
  - feed
  - feedburner
  - jekyll
---

Creating an alternative version of a website or a blog has become common practice, allowing authors to syndicate their content to other sites and offering readers the ability to use third-party applications to read and merge articles with other sources of content. RSS and Atom are some of the most used formats and most popular blog platforms are capable of creating these feeds.

Jekyll is no exception as it ships with a `feed.xml` file that automatically generates a feed every time the site is built, so you could start pointing your readers to your feed at `http://yourblog.url/feed.xml` right away. But is that the best strategy? What if, at some point, you decide to move your blog to a different platform with a different URL? And most importantly, how do you keep track of how many people actually read and subscribe to your content?<!--more-->

## Analytics: FeedBurner to the rescue

[FeedBurner](http://feedburner.google.com) is a (free) service owned by Google that serves as a middleman between your feed and the readers. When you sign up to the service, you insert a link to your feed's XML file and you are given a URL that you can point your users to (such as http://feeds.feedburner.com/yourblog). After doing that, you can move your blog platform whenever necessary without having to worry about broken links, as you simply need to update your FeedBurner preferences with the new URL.

But the cool thing about FeedBurner is that it gives you some important metrics about your feed, namely subscribers and reach. What do those mean exactly? Google tells us:

> > Subscribers is a measure of how many people are subscribed to your feed. At any given time, you can expect that a certain percentage of this subscriber base is actively engaging with your content and this “Reach” measurement provides this additional insight.
> >
> > Additionally, there may be people viewing your content beyond your known subscriber base. For example, they may view your content on a feed search engine or news filter site.
> >
> > Reach aggregates both of these groups, providing an accurate and useful measurement of your true audience.

{% include helpers/image.html name:"feedburner-dashboard.png" caption:"My FeedBurner dashboard" %}

As you can see from my modest dashboard above (hey, this set-up is a couple of days old so give me a break!), I can now have an idea of how many people read and interact with my content.

## Making it homey with a custom domain

If you run your blog with a custom domain, you'll probably think it's a bit lame to publish your feed with a FeedBurner URL. Also, if we advocated earlier that it's not a good idea to rely on a platform-specific URL to diffuse your feed, it would be a bit of a countersense to
use a FeedBurner URL right?

Luckily, FeedBurner allows you to use the service with your own domain, so if you have one just stick with it. To set everything up, log-in to FeedBurner and go to _My Account_. On the left-hand side menu, click on _My Brand_. You will then see instructions on how you should set up a CNAME entry and point it to FeedBurner.
After you set up the CNAME with your DNS provider, add it to FeedBurner.

{% include helpers/image.html name:"feedburner-custom-domain.png" caption:"Adding a custom domain to FeedBurner" %}

The service allows you to have multiple feeds, so they recommend setting up a subdomain like `feeds.yourdomain.com` and have all your feeds with URLs like `feeds.yourdomain.com/yourfeed1`.

That's it. Your feed is ready to roll with a custom domain.

## Announcing the feed to the world

After setting up the feed, it's time to add it to the website. Sure, we could just add a link to it somewhere on the page and expect readers to find it, but there's a way to make it official. By adding the right meta tags we can tell browsers and feed readers that there's an RSS version of our content.

I started by adding a line to my Jekyll config file with the full URL of my feed:

```text
feed_url: "http://feeds.eduardoboucas.com/eduardoboucas"
```

Then I added the meta tag:

```html
<link rel="alternate" type="application/rss+xml" title="{{ "{{" }} site.title
}}" href="{{ "{{" }} site.feed_url }}" />
```

After doing this, I can use any feed reader application to search for my blog and hopefully it will pull the correct information. Here's how it looks on [Feedly](http://feedly.com/):

{% include helpers/image.html name:"feedly-search.png" caption:"Searching for my blog on Feedly" %}

And that's pretty much it. Now please subscribe to my feed, will you? My subscriber numbers are just sad.<!--tomb-->
