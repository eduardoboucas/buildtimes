---
layout: null
---
importScripts('js/vendor/serviceworker-cache-polyfill.js');

var CACHE_NAME = 'eduardoboucas.com-cache-v1';
var urlsToCache = [
    // Stylesheets
    '/css/main.css',

    // RequireJS files
    '/js/app.js',
    '/js/main.js',
    '/js/router.js',
    '/js/text.js',

    // Error page
	'/404.html',
    '/assets/images/glitch.png',

    // Pages and essential assets
    '/index.html',
    '/home.html',
    '/about.html',
    '/assets/images/drawing.png',
    '/findme.html',

    // Portfolio assets
    '/portfolio.html',
    {% for project in site.portfolio %}'/assets/images/portfolio/thumbnails/{{ project.thumbnail }}',
    '/assets/images/portfolio/screenshots/{{ project.screenshot }}',
    '/portfolio/{{ project.handle }}.html',
    {% endfor %}

    // Video
    '/js/VideoLooper.js',
    '/assets/videos/Part1.mp4',
    '/assets/videos/Part2.mp4',
    '/assets/videos/Part3.mp4'

    // Typography
    //'https://fonts.googleapis.com/css?family=Lato:400,700',
    //'https://fonts.googleapis.com/css?family=Economica:700'
];

self.addEventListener('install', function(event) {
	console.log('* Installing Service Worker...');

	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(function(cache) {
		    	console.log('* Opened cache');
		    	return cache.addAll(urlsToCache).then(function () {
		    		console.log('** [!] Files have been cached!');
		    	});
		  	})
		);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request)
			.then(function(response) {
				// Cache hit - return response
				if (response) {
					console.log('** [CACHED]: ' + event.request.url);
					return response;
				}

				console.log('** [Fetching]: ' + event.request.url);
				return fetch(event.request);
			}
		)
	);
});