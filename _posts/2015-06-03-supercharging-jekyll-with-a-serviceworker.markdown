---
layout: post
title:  "Supercharging Jekyll with a ServiceWorker"
date:   2015-06-03 09:30:00
categories: blog
tags: serviceworker javascript jekyll offline cache
---
I've been reading a lot about JavaScript ServiceWorker and, of course, I was itching to try it. A ServiceWorker is like [a regular Web Worker](http://www.html5rocks.com/en/tutorials/workers/basics/) on steroids: it's still great for doing some heavy-lifting in the background without disrupting the main thread, but the really cool thing about it is that it can function as a reverse proxy capable of intercepting any request made from a page.<!--more-->

## Introduction and motivations

Cool, so what problem does this novelty thing solve for us? By itself, none. However, being able to have JavaScript intercepting every request before it’s actually sent to the network is a very powerful thing. 

From a performance point of view, it puts the developer in control of how local caching works — what files to cache, when to cache them, serve them and update them. Because it runs in the background, it can silently fetch and cache all the files for the *About me* and *Contact* sections whilst the visitor is still scrolling about on the *Homepage*. When they decide to actually visit those pages, they are served instantly without waiting for a trip to the server because all the files required are already on disk.

But we can take it a step further. If the files are cached, we can even serve them offline. If they’re not, we can still intercept the request, anticipate that a 404 is going to happen and serve an alternative page instead. We’re talking anything from a nicer error page to an entire offline experience for a website.

A ServiceWorker is a much more complex animal than what I’lol describing in this article. It can be used for things like push notifications or geofencing, but I'll be focusing on using it to improve the performance of my site and to make it available offline.

To get started, I recommend watching a short video called [Supercharging page load](https://www.youtube.com/watch?v=d5_6yHixpsQ) (from where I shamelessly stole the term *Supercharging* for this article) in which Jake Archibald explains some key features of the technology. Additionally, [Introduction to Service Worker](http://www.html5rocks.com/en/tutorials/service-worker/introduction/) from HTML5 Rocks is a great read if you want to dig deeper into this stuff.

## Getting started

Because ServiceWorker puts the developer in charge of the caching process, the first thing you have to decide is what files get cached and when you want to cache them. Do you want to cache absolutely everything right from the start? Do you want to cache pages as the user visits them? Do you want to give the user the option to specifically select what pages to cache using a *Read offline* button? Check [The offline cookbook](http://jakearchibald.com/2014/offline-cookbook/) to learn more about different caching strategies.

Because my site is powered by Jekyll and consists of just static HTML files, it's already pretty fast, so what got me really excited about ServiceWorker was the possibility of creating a full offline experience (at the expense of making it even faster, ugh!). 

So the plan was to start caching the files in the background as soon as the user accesses the site for the first time and the ServiceWorker is installed, making the content available offline for any future visit. But what files to cache? I can't start abusing the user's bandwidth and disk space and download the entire site, so I had to choose carefully what files were essential for a usable offline experience and what files could be dropped. 

## Deciding what to cache

My site consists of two main parts: a single-page application built with Backbone.js that serves the "About me", "Portfolio" and "Find me" sections (along with the weird video sequence thing), and a standalone blog section (at the "/blog" entry point). For the main part to work, I would definitely need:

- Style sheets;
- All the JavaScript skeleton associated with BackboneJS (jQuery, RequireJS, router, views, etc.);
- The three heavily-compressed .mp4 files required for the video sequence and the JavaScript module that controls them;
- The HTML files for each of the sections (*About me*, *Portfolio* and *Find me*) and a couple of images used there;
- On the portfolio section, there's a page for each of the projects featured, accompanied by a thumbnail and a small video (<1MB) demoing the interaction with that particular website. It didn't seem right to be caching all these video files as we're talking like 15MB for the projects that I have at the moment, so instead I've just cached the thumbnail and a screenshot that serves as poster image for the video — if you're offline, you'll see the still image in place of the video, not a bad deal. 

The blog part was a bit trickier though, because unlike the main site, it's updated frequently and the content is expected to grow indefinitely. For now, I decided that I would cache the HTML files for every post but not any assets used in it, such as images (given that my blog is very text-oriented and I rarely use images in posts). I will likely change this strategy in the future; maybe it's better to just cache the most recent 3 pages of posts, for example, along with all the assets?

## Some caveats
- browser support
- HTTPS
- cache polyfill

## Implementation

Before getting your hands dirty with the implementation, make sure you're comfortable with [JavaScript Promises](http://www.html5rocks.com/en/tutorials/es6/promises/), as ServiceWorker relies heavily on them.

The first step is to register a ServiceWorker (providing our browser supports it). Because users can get to my site either via the main web app or through the blog, I need to be able to register the ServiceWorker in both `index.html` and `blog/index.html`. Instead of creating a separate JavaScript file for this and require an additional HTTP request, I created a partial (`serviceWorker.html`) that I include in my files, so the code is automatically embedded in the pages.

{% highlight html linenos %}
<!-- serviceWorker.html -->
<script>
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/serviceWorker.js', {scope: './'})
        .then(function(registration) {
            showNotification('Site cached for offline use.');
            console.log('ServiceWorker registration successful');
        })
        .catch(function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
}
</script>
{% endhighlight %}

This will register the ServiceWorker written in the `serviceWorker.js` file in my root directory. The `scope` option defines the scope in which the ServiceWorker will be able to operate — e.g. if set to `.dir1/`, it will be able to intercept any requests sent from `http://site/dir1` and any sub-directory inside, but not from `http://site/` or `http://site/dir2`.

Now let's look at the ServiceWorker itself. That's where we'll choose which files to cache and define the functions that will handle the requests. 

{% highlight javascript linenos %}
// serviceWorker.js


{% endhighlight %}

