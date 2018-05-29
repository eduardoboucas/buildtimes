---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/writing-media-queries-for-retina-devices-with-include-media.html"
layout: post
title:  "Writing media queries for Retina devices with include-media"
tags:
- blog
- retina
- include-media
- media-query
---
Devices with Retina displays have been with us for a while, and now Retina 3x is a thing. So how to write media queries to target devices with those pixel densities?<!--more-->

If you use [include-media](http://include-media.com), a Sass library for writing simple, elegant and maintainable media queries that I've talked about [here](http://css-tricks.com/approaches-media-queries-sass/) and [here](http://davidwalsh.name/sass-media-query), then all you'll need is:

```sass
/* Retina 2x */
@include media("retina2x") {
	color: #bad;
}

/* Retina 3x */
@include media("retina3x") {
	color: #bad;
}
```

Under the hood, this will generate this CSS:

```css
/* Retina 2x */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  color: #bad;
}

/* Retina 3x */
@media (-webkit-min-device-pixel-ratio: 3), (min-resolution: 350dpi) {
	color: #bad;
}
```

So yes, you can just use plain CSS and ditch the library, but things get more complicated when you also want to limit the viewport width because of the way the *OR* operator works in CSS. Let's say that you want to target retina 2x devices on a viewport width greater than 750px.

```css
/* Plain CSS */
@media (min-width: 751px) and (-webkit-min-device-pixel-ratio: 3), 
(min-width: 751px) and (min-resolution: 350dpi) {
	color: #bad;
}
```

Whereas with include-media you can just write:

```sass
@include media("retina2x", ">750px") {
	color: #bad;
}
```

See more examples at [include-media.com](http://include-media.com).<!--tomb-->