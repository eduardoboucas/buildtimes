---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/exporting-breakpoints-from-css-to-javascript-with-include-media.html"
layout: post
title:  "Exporting breakpoints from CSS to JavaScript with include-media"
tags:
- blog
- include-media
- sass
- javascript
- json
redirect_from: /blog/2016/06/29/exporting-breakpoints-from-css-to-javascript-with-include-media.html
---
If you're using [include-media](http://include-media.com) or any other pre-processor library for managing breakpoints in CSS, you probably like the idea of declaring the values once and reference them by name whenever necessary, keeping the code DRY. But when you also need to make decisions based on the viewport dimensions on the JavaScript side, things can get a bit ugly.<!--more-->

Let's imagine that we want to make one of those navigation menus that become sticky after scrolling past a certain point on the page. Unfortunately, there's no reliable way of doing this with only CSS, so we'll need JavaScript. At a first glance, that would probably involve listening to the scroll event and regularly checking whether the scroll position is greater than a certain value so we could toggle a class on the navigation element that makes it sticky.

But what if we don't want that behaviour on a small screen, perhaps because it takes too much space? Sure, we can change our CSS class to say that the menu only becomes sticky if the viewport is wider than a certain amount:

```scss
// Using include-media

$breakpoints: ('small': 320px, 'medium': 768px, 'large': 1024);

.menu--sticky {
    @include media('>=medium') {
        position: fixed;
    }
}
```

So, adding the class `menu--sticky` to the element on a mobile screen won't make it sticky anymore, but we're still computing those expensive calculations on the JavaScript side. We can skip that whole process if the viewport is narrower than our breakpoint.

```javascript
// In the JavaScript side

function isSticky() {
  // Are we on a mobile view?
  if (window.outerWidth < 768) {
    return false;
  }

  // Do calculations here
}
```

Cool, that works! But there goes the beauty of storing the breakpoints once — we're referencing `768` again, not DRY anymore!

## Enter include-media plugins

I've been working a lot with [Hugo Giraudel](https://twitter.com/hugogiraudel) on include-media lately, and while we were determined to [keep the library simple and lightweight](/blog/2015/06/08/include-media-v1-3-released.html), we felt that it could be extended to include more interesting features. The solution for that was to keep the core at its simplest and distribute individual pieces of functionality as plugins.

Anyway, back to our conundrum. It would be great if we could still declare the breakpoints once, in our Sass, but being able to use them in the JavaScript as well. Turns out there's an include-media plugin for that.

## Exporting breakpoints to JavaScript

[This plugin](https://github.com/eduardoboucas/include-media-export) consists of a bit of Sass that automatically exports your breakpoints to a hidden element in the DOM (by default, `body::after`), and a small JavaScript library that allows us to query them.

To get started, we just need to import the plugin file into the Sass project and call the JavaScript code somewhere (does not require jQuery or any other library).

```sass
@import 'include-media';
@import 'include-media-export';
```

We can then rewrite the function above like so:

```javascript
function isSticky() {
  // Are we on a mobile view?
  if (im.lessThan('medium')) {
    return false;
  }

  // Do calculations here
}
```

## Controlling the update process

By default, the JavaScript will read from the DOM element and parse the JSON every time the library is queried, which ensures that you'll always get the current active breakpoint regardless of how many times the browser is resized. 

However, this might become expensive when polling too many times — the code above is a good example for that, because we're querying the library every time the resize event fires, which is not a good idea even if we debounce the function.

The library allows the developer to handle the updating, by calling `im.setUpdateMode('manual')` to cache the JSON string and `im.update()` to update it.<!--tomb-->

**[include-media-export on GitHub](https://github.com/eduardoboucas/include-media-export)**
