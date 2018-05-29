---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/the-story-behind-my-website.html"
layout: post
title: "The story behind my website"
tags:
- blog
- eduardoboucas.com
- video
- backbonejs
---
It was the beginning of 2013 and I needed a website. I wanted to apply for a job in London as a creative developer and I knew I needed a portfolio that would stand out. At that time, websites with full-screen background videos were starting to be a trend. The first one I saw that I really liked was Beyoncé's website, which included a looping background video that would change depending on the section. That was cool, but I wanted something more.<!--more--> 

A couple of weeks later, a friend of mine sent me the link to a NYC agency called [Sagmeister & Walsh][sagmeister] and I was blown away by their website. This is what I wanted: a video element that would offer some sort of interaction with the content, rather than being just ornamental. After digesting this idea for a while and doing some technical research on HTML5 video, I started to plan what I wanted to do and doing some experimentation. 

The idea was a video divided into three segments:

1. **Intro:** A video that would start as a blank canvas and suddenly reveal me appearing from the edge of the screen, introducing the navigation menu;
2. **Loop:** A short video of me doing something extremely simple and repetitive (blinking my eyes?), seamlessly replacing the first one and looping indefinitely until the user clicked on a link;
3. **Outro:** As soon as the user clicked on a link, the loop would end and the looping video would be replaced by a third video of me leaving the frame, transitioning back to the white canvas and leaving space for the page content.

I wanted to take care of the video capturing and editing all by myself, because <s>I am cheap and I didn't want to spend a dime</s> I am a perfectionist that wants to meticulously control all aspects of the creative process. *Ahem*. I knew right away that I would face some technical challenges, given that my experience in video land is purely self-taught. In particular, I had to record everything in a way that I could completely erase the background and make it pure white so it could blend seamlessly with the background of the page.

How on earth would I do that? I didn't have a fancy green screen with an expensive lighting rig to pull out a decent chroma key. I just had a Canon 550d with a stock lens, a garage with walls that are half white (ish) and the blazing sun on a hot Portuguese summer day to light things up.

{% include helpers/image.html, name:"studio.jpg", caption:"My parent's garage transformed into a studio" %}

I wanted the final video to be black and white with a kind of low-fi vibe to it, which made things easier. I bought a cheap roll of scenery paper to cover the floor and the tiles on the wall, hoping that with the right colour treatment I could make this work. It was time to get everything in place, start rolling some test takes and have some fun with Final Cut Pro X.

{% include helpers/image.html, name:"editing.jpg", caption:"Saturation down, exposure up et voilà!" %}

Sweet! I framed everything in a way that I would have the chair centred and scenery paper going all the way to the left edge of the frame, because I wanted to enter the video from that side. A bit of cropping would take care of the rest.

As for the development itself, I started by creating a small [JavaScript library][videolooper] to put together the three videos and allow me to start or end the video sequence with just a function call. I wanted to synchronise the navigation menu with the videos in a way that it would only appear once the first video ended and the second one started looping. Similarly, I wanted to make it go away and make room for the content once the third video started. I implemented a system of callbacks so I could tell the library exactly what to do at specific points during the sequence.

This video thing gave the website a very special structure and architecture. As far as navigation goes, I couldn't simply load a new page whenever a user clicked on a menu item because a whole choreography had to take place before the content could be loaded. As a result, I decided to use [Backbone.js][backbonejs] to create a single-page application that would communicate with the video sequence depending on the request URL.

There was a little twist, though: I want to play the video sequence if you land on the homepage, but what if I want to link directly to one of the pages? I want to see the content right away, and not any part of the video sequence (that would look broken anyway, because I can only display the video OR the content at the same time). Luckily, Backbone lets me handle that pretty easily:

```js
// This route is triggered when we access the homepage
app_router.on('route:index', function () {
	window.userCameFromIndex = true;

	var videoPlayedCallback = function () {
		$("#menu").fadeIn("slow");
		$("#content").removeClass().addClass("home");
	};

	indexView.beginVideo(videoPlayedCallback);
});

// This route is triggered when we access any other page
app_router.on('route:default', function (route) {
	if (window.userCameFromIndex) {
		pageView.showPageAndPlayVideo();
	} else {
		pageView.showPage();					
	}
});
```

So basically I'm saying "if you're trying to access a page and you got here through the homepage, I'll play you the video sequence and then show you the content; otherwise, I'll just show you the content right away".

The way the application is routed in Backbone works extremely well and makes the overall experience really smooth, even though we're playing, stopping and replacing videos and fetching content in the background. For example, when you navigate from the homepage to another page, you'll see an icon that takes you back to the homepage through video #3, but if you just hit the _Back_ button on your browser you will get the exact same behaviour.

In the end, I was happy with the result. There are obvious problems and downsides with a website built with this architecture. First of all, browser support. HTML5 video is [IE9+][caniusehtml5video] and it's not like you can provide a simple fallback — if you want to access a website that is based around a video element on a browser that doesn't support video, you're in a bit of a pickle. Also, watching the video sequence every time you navigate to another page can get a bit annoying. 

"Why did you do it like this, then?", the dear reader will ask. Well, because I can. This is not a corporate website that can't afford the luxury of not supporting dumb browsers, or a content-rich magazine website that must provide quick and easy navigation to its users. It's my four-page website that the average Joe will only visit once in his lifetime. But instead of living in his brain for 2 minutes as a "nicely built, sober website", I'm hoping it can be carved in his memory forever as the "kick-ass video website with the guy blinking". Well, maybe not forever, that was a bit cocky.<!--tomb-->

_Check out the archived website at [https://v1.eduardoboucas.com](https://v1.eduardoboucas.com)._

[sagmeister]: http://www.sagmeisterwalsh.com/ "Sagmeister & Walsh website"
[videolooper]: https://github.com/eduardoboucas/eduardoboucas.github.io/blob/master/js/VideoLooper.js "VideoLooper.js library"
[backbonejs]: http://backbonejs.org/ "Backbone.js website"
[caniusehtml5video]: http://caniuse.com/#feat=video "HTML5 video browser support from caniuse.com"