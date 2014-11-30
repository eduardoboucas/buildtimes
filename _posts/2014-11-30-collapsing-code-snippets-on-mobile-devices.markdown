---
layout: post
title:  "Collapsing code snippets on mobile devices"
date:   2014-11-30 22:35:00
categories: blog
tags: code snippet expandable html5 javascript
---
If you have a blog about coding — GOSH, aren't you geeky — you probably find yourself showing your readers portions of code to guide them through specific problems and to outline the solutions. Taking the time to change how you display these code snippets can mean the difference between a good and a terrible user experience for your readers.<!--more-->

A monospaced font, as used in any decent code editor, would probably be the first step, as it helps readability. Showing line numbers and using a nice syntax highlighter, such as [Pygments](http://pygments.org/), is also a nice idea. If Jekyll is your platform of choice, you're good to go because its [syntax highlighter](http://jekyllrb.com/docs/templates/#code-snippet-highlighting) gives you all this right out of the box.

But what if the code snippets are not exactly crucial to the story, but more of an additional guide to the readers that want to implement the code themselves while reading the article? In some cases, they can become not only unnecessary but also potentially inconvenient to some readers.

For example, people that are reading your post on a mobile device are very unlikely to be experimenting with the code as they read along, and the space taken by the snippets can be disruptive on a device with limited screen real-estate. My approach is to automatically collapse every code snippet on narrow viewports and to give the readers the option to expand them with a click (or, most likely, a tap) if they want.

First, the CSS (SASS):

{% highlight sass linenos %}
@include media("screen", "<tablet") {
	.highlight:not(.expanded) {
		$highlightHeight: 23px;

		max-height: $highlightHeight;
		overflow: hidden;
		position: relative;

		&:before {
			content: "</> Code snippet: click to expand";
			height: $highlightHeight;
			font-weight: bold;
			cursor: pointer;
			@include font-size(18);
		}

		pre {
			margin-top: 15px;
		}
	}
}
{% endhighlight %}

So what's happening here? I used [my media query mixin]({% post_url 2014-10-29-how-i-write-media-queries-in-sass %}) to apply some rules when the viewport width is less than a given breakpoint (768 pixels in my case). I then target all the code snippets, which in my case have the class `highlight`, and reduce their height to a value that will be filled with a `:before` saying "Code snippet: click to expand" (lines 5 and 9 to 14).

All this will be applied only when the element does NOT have a class named `expanded`, so all we have to do to revert the element to its original state is to add that class when the element is clicked, using a bit of Javascript.

{% highlight javascript linenos %}
bindUiEvents: function () {
	$(".highlight").click(function () {
		$(this).addClass("expanded");
	});
}
{% endhighlight %}

And that does it. Try resizing this window and you'll see the code snippets collapsing below 768px. Once expanded, the snippets can be collapsed again with a tap/click, since every click event will simply toggle the `expanded` class on the element.<!--tomb-->