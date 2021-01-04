---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/supercharging-jekyll-with-a-serviceworker.html"
layout: post
title:  "Supercharging Jekyll with a ServiceWorker"
tags:
- blog
- serviceworker
- javascript
- jekyll
- offline
- cache
---
I've been reading a lot about JavaScript ServiceWorkers and, of course, I was itching to try them. A ServiceWorker is like [a regular Web Worker](http://www.html5rocks.com/en/tutorials/workers/basics/) on steroids: it's still great for doing some heavy-lifting in the background without disrupting the main thread, but the really cool thing about it is that it can function as a reverse proxy capable of intercepting any request made from a page.<!--more-->

## Introduction and motivations

Cool, so what problem does this novelty thing solve for us? None by itself. However, being able to have JavaScript intercepting every request before it’s actually sent to the network is a very powerful thing. 

From a performance point of view, it puts the developer in control of how local caching works — what files to cache, when to cache them, serve them and update them. Because it runs in the background, it can silently fetch and cache all the files for the *About me* and *Contact* sections of a website whilst the visitor is still scrolling about on the landing page. When they do visit those pages, they will be served instantly because the files are already on disk, there's no need to wait for a trip to the server.

But we can take it a step further: if the files are cached locally, we can even serve them without an internet connection. For the files that are not cached, we can still intercept the request, anticipate that an error is about to happen and serve an alternative page instead. This can be used for anything from a nice and simple "sorry, you seem to be offline" error page to a whole offline experience for a site.

A ServiceWorker is a much more complex animal than what I’ll describing in this article. It can be used for things like push notifications or geofencing, but I'll be focusing on using it to improve the performance of my site and to make it available offline.

To get started, I recommend watching a short video called [Supercharging page load](https://www.youtube.com/watch?v=d5_6yHixpsQ) (from where I shamelessly stole the term *Supercharging* for this article) in which Jake Archibald explains some key points about the technology. Additionally, [Introduction to Service Worker](http://www.html5rocks.com/en/tutorials/service-worker/introduction/) from HTML5 Rocks is a great read if you want to dig deeper into this stuff.

## Getting started

Because ServiceWorker puts the developer in charge of the caching process, the first thing you have to decide is what files get cached and when to cache them. Do you want to cache absolutely everything right from the start? Do you want to cache pages as the user visits them? Do you want to give the user the option to specifically select what pages to cache using a *Read offline* button? If you're not sure, [The offline cookbook](http://jakearchibald.com/2014/offline-cookbook/) is a great place to learn about different caching strategies.

Because my site is powered by Jekyll and consists of just static HTML files, it's already pretty fast, so what got me really excited about ServiceWorker was the possibility of creating a full offline experience — yes, at the expense of making it even faster, ugh!

So the plan was to start caching files in the background as soon as the user accesses the site for the first time and the ServiceWorker is installed, making the content available offline for any future visit. But what files to cache? I can't start abusing the user's bandwidth and disk space and download the entire site, so I had to choose carefully what files were essential for a usable offline experience and what files could be dropped. 

## Deciding what to cache

My site consists of two main parts: a single-page application built with Backbone.js that serves the "About me", "Portfolio" and "Find me" sections (along with the weird video sequence thing), and a standalone blog section (at the "/blog" entry point). For the main part to work, I would need:

- Style sheets;
- All the JavaScript skeleton associated with BackboneJS (jQuery, RequireJS, router, views, etc.);
- The three heavily-compressed .mp4 files required for the video sequence and the JavaScript module that controls them;
- The HTML files for each of the sections (*About me*, *Portfolio* and *Find me*) and a couple of images used in them;
- On the portfolio section, there's a page for each project featured, accompanied by a thumbnail and a small video (<1MB) demoing the interaction with a website. It didn't seem right to cache all the video files as it'd mean downloading around 15MB in videos, so instead I've just cached the thumbnail and a screenshot that serves as the poster image for the video. If you're offline, you'll see the still image instead of the video — not a bad deal.

The blog part was a bit trickier though, because unlike the main site, it's updated frequently and the posts are expected to grow indefinitely, not to mention the media assets used in them. For now, I've decided that I would cache the HTML files for every post but not the assets used in them, given that my blog is very text-oriented and in the not so frequent cases where I do use images, they're rarely crucial to the story. This is just a first strategy that will probably change in the future.

## Some caveats

There are some important things to take in before getting your hands dirty with the actual development:

- **The browser support is very limited**: As of the time of writing this article, ServiceWorker itself is supported by Chrome 40+, Opera 28+ and Chrome Mobile 42. However, if you want to use the Cache API you'll need to grab [a polyfill](https://github.com/coonsta/cache-polyfill), as it's still not supported natively. This is as simple as getting a JavaScript and calling it from the ServiceWorker using `importScripts()`.
- **It only works on HTTPS**: With great power comes great responsibility, right? Being able to hijack every request is some very serious business, so to avoid malicious use it only works on websites served through HTTPS. `localhost` is an exception, so you'll still be able to test everything locally.
- **It uses Promises**: ServiceWorker relies heavily on the use of [JavaScript Promises](http://www.html5rocks.com/en/tutorials/es6/promises/). Make sure you get comfortable with them before moving on.

## Implementation

Right, let's get to the implementation then. The first step is to register a ServiceWorker (providing the browser supports it). Because users can get to my site either via the main web app or through the blog, I need to be able to register the ServiceWorker in both `index.html` and `blog/index.html`. Instead of creating a separate JavaScript file for this and require an additional HTTP request, I created a partial (`serviceWorker.html`) that I include when needed, so the JS code is automatically embedded on the pages.

```html
<!-- serviceWorker.html -->
<script>
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/serviceWorker.js').then(function(reg) {
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
```

This will register the ServiceWorker written in the `serviceWorker.js` file in my root directory. The `scope` option defines the scope in which the ServiceWorker will be able to operate — e.g. if set to `.dir1/`, it will be able to intercept any requests sent from `http://site/dir1` and any sub-directory inside, but not from `http://site/` or `http://site/dir2`.

Now let's look at the ServiceWorker itself, where we'll choose which files to cache and define the functions that will handle the requests. The files to be cached are defined as an array of filenames that we could simply keep updating manually, but we can take advantage of some of Jekyll's internal variables to generate that list for us.

```javascript
{% raw %}
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
{% endraw %}
```

*Note: The "if" tag on line 29 will throw an error as it is. I've separated it into multiple lines to make it more readable in the article, but unfortunately you'll have to compress it into a single line for Liquid to accept it.*

Here's what's happening:

- Including the path to my stylesheet and to some images I need for my pages (lines 10 and 16-19);
- Iterating over `site.html_pages` and grabbing the `url` property of each page, which will give me the paths for all the HTML pages generated by Jekyll. This does not include posts or collections, so we'll have to include those later (lines 13-15);
- Going through the `site.portfolio` collection to get the paths to all the individual portfolio pages (lines 22-24);
- Adding the actual blog posts by looping through `site.posts` (lines 29-31) and the JSON file used by the search plugin — if I wanted to limit the number of blog posts to cache, this would be a good place to do it;
- Finally, I need to add my JavaScript files and also the media assets (thumbnails and screenshots) for the Portfolio section. `site.static_files` is a nice place to get this, as it's an array of files not touched by Jekyll's templating engine. It contains absolutely everything, including the assets used in the posts which I don't want to include, so I add a few filters to the "if" statement to say that I only want files with a `.js` extension *or* files located within `/portfolio/screenshots/` or `/portfolio/thumbnails/` (lines 35-41);

Then we add the functions to handle the requests:

```javascript
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
```

The `install` event is fired when the ServiceWorker is triggered for the first time. I wanted to start caching files right away so this is a good place to do it. We open the cache, which returns a promise, and then start adding files to it. If any of the files fail, the entire process will abort and the ServiceWorker won't install, so it's important that you get all your file paths correctly.

The star of the show, however, is our `fetch` event, which gets fired whenever a request is made. When we intercept the request, we can check if the file exists in the cache — if it does, we can serve a cached version, otherwise we request it from the network.

## Dealing with Google Fonts

Caching external font files from third-party providers, in my case Google Fonts, can be a bit tricky. At first, I tried to just include the URLs for the fonts on the list of files to cache (e.g. `https://fonts.googleapis.com/css?family=Lato:400,700`), which throws an error because it involves a redirect and that's considered unsecure. That redirect happens because Google Fonts API does some User Agent sniffing to determine which file format to serve. 

For example, when I open the URL above on my browser I get something like this:

```css
@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 400;
  src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/8qcEw_nrk_5HEcCpYdJu8BTbgVql8nDJpwnrE27mub0.woff2) format('woff2');
  unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;
}
```

Because I'm running the most recent version of Chrome, it serves me a WOFF2 font file. Now, I could simply take that URL and add it to the ServiceWorker and it should work fine, because that's a direct link and not a redirect anymore. The problem with that approach is that I would be caching a font format that not everyone can see. 

Another option would be to download the files and store them locally, but I don't want to start moving things from CDNs back to the server.

A more elegant solution is to cache the fonts at a later stage and not during the installation process. We can use the `fetch` event to sniff all the requests and detect when a request for a font has been made and simply cache that file — instead of going "let's cache the WOFF2 version and hope that users support it", we go "let's wait to see what font files they need and cache them for future visits".

Here's how we can modify our ServiceWorker to do just that:

```javascript
self.addEventListener('fetch', function(event) {
    var requestUrl = new URL(event.request.url);

    // Is this a request for a font?
    if (requestUrl.host == 'fonts.gstatic.com') {
        event.respondWith(
            caches.open('eduardoboucas.com-fonts')
                .then(function (cache) {
                    return cache.match(event.request).then(function (match) {
                        if (match) {
                            console.log('[*] Serving cached font: ' + event.request.url);

                            return match;
                        }

                        return fetch(event.request).then(function (response) {
                            cache.put(event.request, response.clone());
                            console.log('[*] Adding font to cache: ' + event.request.url);

                            return response;
                        });
                    });
                })
        );
    } else {
        // It's not a font, handle the request normally
        // as we were doing before
    }
});
```

## Demo

Here's a demo of the thing working. It's good because you get to see the ServiceWorker in action even if you're not running a recent version of Chrome, but bad because I'm terrible with screencasts.

{% include helpers/video-embed.html url:"https://www.youtube.com/embed/wCoUZXBlJWI" width:"420" height:"315" %}

The console errors I've mentioned are caused by calls to Google Analytics and there's a really elegant way of handling this. [This sample](https://googlechrome.github.io/samples/service-worker/offline-analytics/) shows how those calls can be stored in IndexedDB and sent to the server once a working internet connection is found. Yes, this means having analytics for offline visits, how cool is that?

## Final thoughts

The implementation described in this article is just my first experimentation with a ServiceWorker, but I will most likely tweak things as I go along. For example, it probably doesn't make sense to cache all the posts, as they'll eventually be too many. Instead, it might be better to cache a limited number of posts (the three most recent pages?) along with their assets. That's probably a better experience for the user.

Unfortunately, all this is not for everyone just yet. The ServiceWorker is on Chrome, but the Cache API is yet to be natively supported. Firefox is working on its implementation as well and, as for the other browsers, we'll have to wait and see. I would absolutely love to see this available on mobile browsers where all this stuff could be used to its full potential — that's already possible on Mobile Chrome (Android), but who knows when (and if) it'll land on iOS.

Come one, browsers. Let's move the web forward! We're all here waiting anxiously.<!--tomb-->