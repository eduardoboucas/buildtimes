---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/lazy-loading-dadi-cdn.html"
layout: post
title:  "Lazy loading images with DADI CDN recipes"
tags:
- blog
- dadi
- cdn
- webperf
- performance
external-url: https://forum.dadi.tech/topic/17/lazy-loading-images-with-cdn-recipes
external-name: DADI forum
external-date: 2017-10-23
---
Images are amongst the most common culprits of poor performance in websites, as they often require sending several megabytes of data across the wire for a single asset. When the network conditions are less than ideal, this can have a huge impact on load times and potentially make the website unusable.

To get around this, developers typically resort to *lazy loading*, a technique that comprises of sending a tiny temporary image with the initial payload (usually a blank pixel), which is then replaced when the real image, fetched asynchronously, has been downloaded and is ready to be used. <!--more-->In practice, this means that users don't have to wait for a large asset to be downloaded before they start seeing content on the screen, which is an improvement in perceived performance.

## Using a placeholder

As an alternative to a blank pixel, we can use a placeholder generated from the original asset, as long as it's still small enough to have a marginal impact on the size of the initial payload. This creates a more pleasant visual effect, as users start seeing something that resembles the image they're expecting instead of just a blank slot.

For example, we can take the original image and reduce its dimensions and compression quality, drastically bringing down the file size. To avoid getting a terribly pixelated image, we can add a blur effect to mask the imperfections.

Here's how it looks like:

{% include helpers/image.html, name:"leaf.jpg", caption:"Original image (203 KB)" %}

{% include helpers/image.html, name:"leaf-placeholder.jpg", caption:"100px wide placeholder (1 KB)" %}

{% include helpers/image.html, name:"leaf-placeholder.jpg", caption:"Placeholder stretched to 650px", width:"650" %}

## Using CDN recipes

We could use [DADI CDN](https://dadi.tech/cdn/) to generate a placeholder from any image using a set of URL parameters.

[https://cdn.somedomain.tech/samples/tree.jpg?width=120&quality=75&resizeStyle=aspectfit&blur=4](https://cdn.somedomain.tech/samples/tree.jpg?width=120&quality=75&resizeStyle=aspectfit&blur=4)

A more convenient way is to use recipes (click [here](https://www.youtube.com/watch?v=4wYq8fmyYhA) for a video where I talk about them). Just copy the following recipe file to your `workspace` directory.

```json
{
  "recipe": "placeholder",
  "settings": {
    "format": "jpg",
    "quality": "75",
    "width": "120",
    "resizeStyle": "aspectfit",
    "blur": 4
  }
}
```

And then you can generate a placeholder for any file by prepending its path with `/placeholder` , like [https://cdn.somedomain.tech/placeholder/samples/leaf.jpg](https://cdn.somedomain.tech/placeholder/samples/leaf.jpg).

Depending on how large your image slots are, you might want to adapt the recipe settings to better fit your needs. In particular, you can experiment with the `width`, `quality` and `blur` settings.

## Demos

In the following pens I've used this technique to lazy load large images using in conjunction with a small placeholder.

<p data-height="550" data-theme-id="0" data-slug-hash="RLOVGm" data-default-tab="result" data-user="eduardoboucas" data-embed-version="2" data-pen-title="DADI / CDN: Lazy loading a large image with a placeholder" data-preview="true" class="codepen">See the Pen <a href="https://codepen.io/eduardoboucas/pen/RLOVGm/">DADI / CDN: Lazy loading a large image with a placeholder</a> by Eduardo Bouças (<a href="https://codepen.io/eduardoboucas">@eduardoboucas</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

<p data-height="344" data-theme-id="0" data-slug-hash="OxGVqb" data-default-tab="result" data-user="eduardoboucas" data-embed-version="2" data-pen-title="DADI / CDN: Lazy loading images with placeholders" data-preview="true" class="codepen">See the Pen <a href="https://codepen.io/eduardoboucas/pen/OxGVqb/">DADI / CDN: Lazy loading images with placeholders</a> by Eduardo Bouças (<a href="https://codepen.io/eduardoboucas">@eduardoboucas</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## Wrapping up

Visit [https://dadi.tech/cdn/](https://dadi.tech/en/cdn/) to learn more about DADI CDN.<!--tomb-->