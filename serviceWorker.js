---
layout: null
---
importScripts('js/vendor/serviceworker-cache-polyfill.js');

var cacheName = 'eduardoboucas.com-cache-v2';
var filesToCache = [
    // Stylesheets
    '/css/main.css',

    // Pages and assets
    {% for page in site.html_pages %}
    '{{ page.url }}',{% endfor %}
    '/assets/images/glitch.png',
	'/assets/images/drawing.png',  
	'/assets/images/bust.png',
	'/assets/images/background.gif',

	// Portfolio pages
    {% for project in site.portfolio %}'{{ project.url }}',
    {% endfor %}    

    // JS files, Portfolio assets and main video
	{% for file in site.static_files %}{% if file.extname == '.js' or file.path contains '/portfolio/screenshots' or file.path contains '/portfolio/thumbnails' %}'{{ file.path }}',
	{% endif %}{% endfor %}

	// Blog posts
	'/blog',
	'/feeds/search.json',
    {% for post in site.posts %}'{{ post.url }}',
	{% endfor %}
];

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
					console.log('* [Serving cached]: ' + event.request.url);
					return response;
				}

				console.log('* [Fetching]: ' + event.request.url);
				return fetch(event.request);
			}
		)
	);
});