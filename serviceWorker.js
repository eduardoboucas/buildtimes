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

    // HTML pages
    '/index.html',
    '/home.html',
    '/404.html',
    '/about.html',
    '/findme.html',
    '/portfolio.html',

    // Video
    '/js/VideoLooper.js',
    '/assets/videos/Part1.mp4',
    '/assets/videos/Part2.mp4',
    '/assets/videos/Part3.mp4',

    // Typography
    'https://fonts.googleapis.com/css?family=Lato:400,700',
    'https://fonts.googleapis.com/css?family=Economica:700'
];

self.addEventListener('install', function(event) {
	console.log('* Installing Service Worker...');

	event.waitUntil(
	caches.open(CACHE_NAME)
	  .then(function(cache) {
	    console.log('* Opened cache');
	    return cache.addAll(urlsToCache).then(function () {
	    	alert('Files have been cached!');
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
					console.log('* Delivering cached response: ' + event.request.url);
					return response;
				}

				console.log('* Fetching asset: ' + event.request.url);
				return fetch(event.request);
			}
		)
	);
});