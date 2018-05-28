---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/viewport-sized-typography-with-minimum-and-maximum-sizes.html"
layout: post
title:  "Viewport sized typography with minimum and maximum sizes"
tags:
- blog
- responsive
- viewport
- typography
- sass
redirect_from: /blog/2016/06/18/viewport-sized-typography-with-minimum-and-maximum-sizes.html
---
Viewport units for typography are quite a cool toy to have in your responsive web design toolbox, as they allow you to size fonts relatively to the dimensions of the viewport.<!--more--> If you've never used them before, [Chris Coyier's article](https://css-tricks.com/viewport-sized-typography/) is probably a good place to start.

These units can produce really interesting results, but they must be used with caution. From my experience, there's always a point where the font becomes unreadable on small screens, and sometimes too big on large screens. I end up setting a couple of media queries to set some boundaries on where the viewport units kick in.

As a result, I created a Sass mixin that abstracts what I wish you could more naturally in CSS: specify a minimum and a maximum size for the font while still using viewport based units. The mixin takes the viewport based size, a minimum value (in pixels), an optional maximum value (in pixels as well) and an optional fallback value, in whatever units you prefer, for [browsers that don't support viewport units](http://caniuse.com/#feat=viewport-units).

```scss
///
/// Viewport sized typography with minimum and maximum values
///
/// @author Eduardo Boucas (@eduardoboucas)
///
/// @param {Number}   $responsive  - Viewport-based size
/// @param {Number}   $min         - Minimum font size (px)
/// @param {Number}   $max         - Maximum font size (px)
///                                  (optional)
/// @param {Number}   $fallback    - Fallback for viewport-
///                                  based units (optional)
///
/// @example scss - 5vw font size (with 50px fallback), 
///                 minumum of 35px and maximum of 150px
///  @include responsive-font(5vw, 35px, 150px, 50px);
///
@mixin responsive-font($responsive, $min, $max: false, $fallback: false) {
  $responsive-unitless: $responsive / ($responsive - $responsive + 1);
  $dimension: if(unit($responsive) == 'vh', 'height', 'width');
  $min-breakpoint: $min / $responsive-unitless * 100;
  
  @media (max-#{$dimension}: #{$min-breakpoint}) {
    font-size: $min;
  }
  
  @if $max {
    $max-breakpoint: $max / $responsive-unitless * 100;
    
    @media (min-#{$dimension}: #{$max-breakpoint}) {
      font-size: $max;
    }
  }
  
  @if $fallback {
    font-size: $fallback;
  }
  
  font-size: $responsive;
}
```

**Caveat:** `vw` or `vh` units work, `vmin` or `vmax` don't.

Here's a pen showing the effect.

<p data-height="268" data-theme-id="0" data-slug-hash="YXxmwv" data-default-tab="result" data-user="eduardoboucas" class='codepen'>See the Pen <a href='http://codepen.io/eduardoboucas/pen/YXxmwv/'>Viewport sized typography with minimum and maximum values</a> by Eduardo Bouças (<a href='http://codepen.io/eduardoboucas'>@eduardoboucas</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

What are your thoughts?<!--tomb-->
