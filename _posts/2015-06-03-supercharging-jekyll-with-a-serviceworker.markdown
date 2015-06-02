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
- On the portfolio section, there's a page for each project featured, accompanied by a thumbnail and a small video (<1MB) demoing the interaction with that website. It didn't seem right to be caching all the video files as it'd be mean downloading like 15MB in videos, so instead I've just cached the thumbnail and a screenshot that serves as a poster image for the video. If you're offline, you'll see the still image in place of the video — not a bad deal.

The blog part was a bit trickier though, because unlike the main site, it's updated frequently and the content is expected to grow indefinitely. For now, I decided that I would cache the HTML files for every post but not any assets used in it, such as images (given that my blog is very text-oriented and I rarely use images in posts). I will likely change this strategy in the future; maybe it's better to just cache the most recent 3 pages of posts, for example, along with all the assets?

## Some caveats

There are some important things to take in before getting your hands dirty with the development.

- **The browser support is very limited**: As of the time of writing this article, ServiceWorker itself is supported by Chrome 40+, Opera 28+ and Chrome Mobile 42. However, if you want to use the Cache API you'll need to grab [a polyfill](https://github.com/coonsta/cache-polyfill) to make it work. This is as simple as getting a JavaScript and calling from your ServiceWorker using `importScripts()`. You can follow [Is ServiceWorker Ready?](https://jakearchibald.github.io/isserviceworkerready/) to see the status of adoption by other browser vendors.
- **It only works on HTTPS**: With great power comes great responsibility, right? Being able to hijack every request is some very serious business, so to avoid malicious use it only works on websites served through HTTPS. `localhost` is an exception, so you'll still be able to test everything locally.
- **It uses Promises**: ServiceWorker relies heavily on the use of [JavaScript Promises](http://www.html5rocks.com/en/tutorials/es6/promises/). Make sure you get comfortable with them before moving on.

## Implementation

Right, let's get to the implementation at last. The first step is to register a ServiceWorker (providing our browser supports it). Because users can get to my site either via the main web app or through the blog, I need to be able to register the ServiceWorker in both `index.html` and `blog/index.html`. Instead of creating a separate JavaScript file for this and require an additional HTTP request, I created a partial (`serviceWorker.html`) that I include in my files, so the code is automatically embedded in the pages.

{% highlight html linenos %}
<!-- serviceWorker.html -->
<script>
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/sw.js').then(function(reg) {
	    if (!reg.installing) return;
	    console.log("[*] ServiceWorker is installing...");

	    var worker = reg.installing;
	    worker.addEventListener('statechange', function() {
	        if (worker.state == 'redundant') {
	            console.log('[*] Install failed');
	        }
	        if (worker.state == 'installed') {
	            console.log('[*] Install successful!');
	        }
	    });
	});
}

</script>
{% endhighlight %}

This will register the ServiceWorker written in the `serviceWorker.js` file in my root directory. The `scope` option defines the scope in which the ServiceWorker will be able to operate — e.g. if set to `.dir1/`, it will be able to intercept any requests sent from `http://site/dir1` and any sub-directory inside, but not from `http://site/` or `http://site/dir2`.

Now let's look at the ServiceWorker itself. That's where we'll choose which files to cache and define the functions that will handle the requests. The files to be cached are defined as an array of filenames that we could simply keep updating it manually, but we can take advantage of some of Jekyll's internal variables to generate this list for us.

{% highlight javascript linenos %}{% raw %}
// serviceWorker.js
---
layout: null
---
importScripts('js/vendor/serviceworker-cache-polyfill.js');

var cacheName = 'eduardoboucas.com-cache-v1';
var filesToCache = [
    // Stylesheets
    '/css/main.css',

    // Pages and assets
    {% for page in site.html_pages %}
    	'{{ page.url }}',
    {% endfor %}
    '/assets/images/glitch.png',
	'/assets/images/drawing.png',
	'/assets/images/bust.png',
	'/assets/images/background.gif',

	// Portfolio pages
    {% for project in site.portfolio %}
    	'{{ project.url }}',
    {% endfor %}

	// Blog posts
	'/blog',
	'/feeds/search.json',
    {% for post in site.posts %}
    	'{{ post.url }}',
	{% endfor %}

    // JS files, Portfolio assets and main video
    // (!) This will throw a Liquid error. Read below.
	{% for file in site.static_files %}
        {% if file.extname == '.js' or
              file.path contains '/portfolio/screenshots' or
              file.path contains '/portfolio/thumbnails' %}
              '{{ file.path }}',
		{% endif %}
	{% endfor %}
];
{% endraw %}{% endhighlight %}

*Note: The "if" tag on line 29 will throw an error as it is. I've separated it into multiple lines to make it more readable, but unfortunately you'll have to compress it into a single line for Liquid to accept it.*

Here's what's happening:

- Including the path to my stylesheet and to some images I need for my pages (lines 10 and 16-19);
- Iterating over `site.html_pages` and grabbing the `url` property of each page, which will give me the paths for all the HTML pages generated by Jekyll. This does not include posts or collections, so we'll have to include those later (lines 13-15);
- Going through the `site.portfolio` collection to get the paths to all the individual portfolio pages (lines 22-24);
- Adding the actual blog posts by looping through `site.posts` (lines 29-31). If I wanted to limit the number of blog posts to cache, this would be a good place to do it. I'm also adding the JSON file used by the search plugin;
- Finally, I need to add my JS files and also the media assets (thumbnails and screenshots) needed for the Portfolio section. `site.static_files` is a nice place to get this, as it's' an array of files not touched by Jekyll's templating engine. It contains absolutely everything, including the assets used in the posts which I don't want to include, so I add a few filters to the "if" statement to say that I only want files with a `.js` extension or any files located within `/portfolio/screenshots/` or `/portfolio/thumbnails/` (lines 35-41);

Then we add the functions to handle the requests:

{% highlight javascript linenos %}
// serviceWorker.js
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    console.log('[*] Serving cached: ' + event.request.url);
                    return response;
                }

                console.log('[*] Fetching: ' + event.request.url);
                return fetch(event.request);
            }
        )
    );
});
{% endhighlight %}

The `install` event is fired when the ServiceWorker is triggered for the first time. I wanted to start caching files right away so this is a good place to do it. We open the cache, which returns a promise, and then start adding our files to it. If any of the files fail, the entire process will fail, so it's important that you get all your file paths correctly.

The star of the show, however, is our `fetch` event which gets fired whenever a request is made. When we intercept the request, we can check to see if the file exists in the cache — if it does, we can serve a cached version, otherwise we request it from the network.