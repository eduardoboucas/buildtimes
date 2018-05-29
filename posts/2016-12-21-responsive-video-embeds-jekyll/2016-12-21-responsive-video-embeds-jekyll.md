---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/responsive-video-embeds-jekyll.html"
layout: post
title:  "Creating responsive video embeds in Jekyll"
tags:
- blog
- jekyll
- video
---
Making video embeds responsive is not always straightforward. Ideally, we'd have a way of making the embed take up the full width of a container (no more, no less) whilst maintaining the original aspect ratio of the video. Most providers, such as YouTube and Vimeo, provide these embeds in the form of iframes, which are not particularly friendly with responsive layouts.<!--more-->

Iframes are effectively isolated sandboxes that cant't inherit styling from their parent. Yes, there was the idea of a [seamless attribute](http://benvinegar.github.io/seamless-talk/#/) at some point, but it was eventually [removed](https://github.com/whatwg/html/issues/331)).

Here's how the default embed code for a YouTube video looks like:

```html
<iframe width="560"
        height="315" 
        src="https://www.youtube.com/embed/fy7q0klb0yI" 
        frameborder="0" 
        allowfullscreen></iframe>
```

As you can see, the `<iframe>` element will ask you to define a fixed width and height, which you can't really get away from.

## The padding-bottom trick

You're probably asking: "can't you set `width` to `100%` so that the video takes the full width of its parent"? That works, at least in some browsers, but what about the height? If you set a fixed height, you'll get a video element with different aspect depending on the viewport width.

To get around that, front-end developers typically leverage the properties of the `padding` property to lock an element to a certain aspect ratio. When using percentages, any of the four dimensions of `padding` (top, right, bottom and left) are relative to the width of the parent, not the height — this means that `padding-bottom: 50%` means *pad the bottom edge of an element with half the width (not height) of its parent*.

With that, you can do this:

```html
<style>
.video-holder {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%;
  overflow: hidden;
}

.video-holder iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>

<div class="video-holder">
  <iframe width="560"
          height="315" 
          src="https://www.youtube.com/embed/fy7q0klb0yI" 
          frameborder="0" 
          allowfullscreen></iframe>
</div>
```

What's the magic here? We create an element (`.video-holder`) that takes up the entire width of the page. We set its height to `0`, but compensate by adding some bottom padding (`56.25%`, or `9/16`, since our video is `16:9`). We then absolute position the iframe inside that component, taking its full width and height.

## Making a Jekyll partial

This is great, but having to include the wrapper `<div>` as well as the `<iframe>` every time you want to embed a video is not convenient. Plus, the value of `56.25%` seen above works perfectly for `16:9` videos, but if we want to use a video with a different aspect ratio we need to recalculate that.

It's easy to make a Jekyll helper/partial to handle all this automatically for us.

```html
{% raw %}
{% assign width = include.width | times: 1.0 %}
{% assign height = include.height | times: 1.0 %}
{% assign paddingBottom = height | divided_by: width | times: 100 %}

<div class="video-holder" style="padding-bottom: {{ paddingBottom }}%">
  <iframe width="{{ include.width }}" 
          height="{{ include.height }}" 
          src="{{ include.url }}" 
          frameborder="0" 
          allowfullscreen></iframe>
</div>
{% endraw %}
```

This means we can embed a video simply by specifying the embed URL and the original dimensions, which will be used to size the video container according to the aspect ratio. Here's how it's used:

```text
{% raw %}
{% include helpers/video.html url="https://www.youtube.com/embed/fy7q0klb0yI" width="560" height="315" %}
{% endraw %}
```

And that's it! You can check the [source of this site](https://github.com/eduardoboucas/eduardoboucas.github.io) to see some examples of this approach in action.<!--tomb-->
