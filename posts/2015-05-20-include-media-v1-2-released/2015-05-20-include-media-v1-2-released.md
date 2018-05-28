---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/include-media-v1-2-released.html"
layout: post
title:  "include-media v1.2 released"
tags:
- blog
- include-media
- sass
- media-queries
---
Five months ago, I released [include-media](http://include-media.com), a library for writing simple, elegant and maintainable media queries in Sass. What started as a simple solution to solve my own problems quickly became a tool used and discussed by fellow developers around the world.<!--more-->

The beauty of making a project open sourced is that it kind of gets out of your control in a way, becoming something with a life of its own. Bugs and fixes are now discovered and discussed by an entire community of developers, and the roadmap for future features is shaped by the needs and opinions of the collective rather than the author's.

As a result, 1.2 was the first version of the library that has been released purely based on feedback from the community. Nothing major has changed, but I thought it'd be nice to write a post to accompany each release to keep everyone informed of what's happening with the project.

## Min-height expressions

*[Issue #16](https://github.com/eduardoboucas/include-media/issues/16)*

Several people showed interest in having height-based media queries, using `min-height` expressions instead of `min-width`. The challenge here was how to incorporate this functionality without compromising the simplistic and natural syntax that the library avidly promotes. The solution was to accept a `height` keyword before the operator, which makes the breakpoint work with a `min-height` expression.

```sass
$breakpoints: ('medium': 768px, 'large': 1280px);

// Default syntax, resulting in (min-width: 768px)
@include media('>=medium') {
    // ...
}

// With 'height' keyword, resulting in (min-height: 768px)
@include media('height>=medium') {
    // ...
}

// It also accepts the 'width' keyword for consistency
@include media('width>=medium') {
    // ...
}
```

Thanks to [mattberridge](https://github.com/mattberridge), [KrisOlszewski](https://github.com/KrisOlszewski), [CREEATION](https://github.com/CREEATION), [pauleustice](https://github.com/pauleustice), [joseluis](https://github.com/joseluis) and [stacyk](https://github.com/stacyk) for their feedback on this one.

## Aliases for declarations

*[Issue #26](https://github.com/eduardoboucas/include-media/issues/26)*

Another request was for adding support to aliases for declarations, as offered by other libraries. The main idea is that when you use a list of conditions frequently, you would benefit from having a shorter way of declaring the media query.

A lot of solutions were proposed, but in the end [joseluis](https://github.com/joseluis) came up with a way to achieve this without actually adding anything to the codebase. It envolves creating a variable with the expressions in a list format, and then pass that variable to the mixin with the `...` suffix.

```sass
$my-weird-bp: '>=tablet', '<815px', 'landscape', 'retina3x';

@include media($my-weird-bp...) {
    // ...
}
```

## Orientation expressions

This is quite a simple one, but the `$media-expressions` array was extended with `landscape` and `portrait` expressions, compiling to `(orientation: landscape)` and `(orientation: portrait)` respectively.

```sass
// Targets "tablet" devices on portrait mode
@include media('>=tablet', '<desktop', 'portrait') {
    // ...
}
```

## The future

Some people flagged an issue with other libraries where a mixin named `media` exists (such as Bourbon Neat) causing naming conflicts with include-media. [We've been discussing the issue](https://github.com/eduardoboucas/include-media/issues/32), trying to come up with a solution to fix this without breaking the compatibility with previous versions. I'd love to hear your thoughts on this and other things about the library.

Thanks for using it and for making it awesome.<!--tomb-->
