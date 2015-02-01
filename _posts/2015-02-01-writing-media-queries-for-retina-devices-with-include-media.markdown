---
layout: post
title:  "Writing media queries for Retina devices with include-media"
date:   2015-02-01 12:25:00
categories: blog
tags: retina include-media media-query
---
Devices with Retina displays have been with us for a while, and now Retina 3x is a thing. So how to write media queries to target devices with those pixel densities?<!--more-->

If you use [include-media](http://include-media.com), a Sass library for writing simple, elegant and maintainable media queries that I've talked about [here](http://css-tricks.com/approaches-media-queries-sass/) and [here](http://davidwalsh.name/sass-media-query), then all you'll need is:

{% highlight sass linenos %}
/* Retina 2x */
@include media("retina2x") {
	color: #bad;
}

/* Retina 3x */
@include media("retina3x") {
	color: #bad;
}
{% endhighlight %}

Under the hood, this will generate this CSS:

{% highlight css linenos %}
/* Retina 2x */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  color: #bad;
}

/* Retina 3x */
@media (-webkit-min-device-pixel-ratio: 3), (min-resolution: 350dpi) {
	color: #bad;
}
{% endhighlight %}

So yes, you can just use plain CSS and ditch the library, but things get more complicated when you also want to limit the viewport width because of the way the *OR* operator works in CSS. Let's say that you want to target retina 2x devices on a viewport width greater than 750px.

{% highlight css linenos %}
/* Plain CSS */
@media (min-width: 751px) and (-webkit-min-device-pixel-ratio: 3), 
(min-width: 751px) and (min-resolution: 350dpi) {
	color: #bad;
}
{% endhighlight %}

Whereas with include-media you can just write:

{% highlight sass linenos %}
@include media("retina2x", ">750px") {
	color: #bad;
}
{% endhighlight %}

See more examples at [include-media.com](http://include-media.com).<!--tomb-->