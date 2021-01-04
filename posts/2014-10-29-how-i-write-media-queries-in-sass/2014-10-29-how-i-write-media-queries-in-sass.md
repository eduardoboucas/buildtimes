---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/how-i-write-media-queries-in-sass.html"
layout: post
title:  "How I write media queries in Sass"
tags:
- blog
- sass
- css
- media queries
---
Once you Sass, you never go... ah, damn it. I can't make the pun work, but you get the idea. [Sass](http://sass-lang.com/) is a really powerful tool for front-end developers that I would really struggle to live without. CSS pre-processors, like any kind of power, come with great responsibility. They enable poor, lazy and inefficient designs, but they also allow you to write some really cool stuff with little to no effort.<!--more-->

One example of that is media queries. There are a lot of mixins out there that allow you to easily write media queries in a nice way, such as [Chris Coyier's approach](http://css-tricks.com/conditional-media-query-mixins/) or [Dmitry Sheiko's technique](http://codepen.io/dsheiko/pen/KeLGy). I started by using the latter, which allows you to do define global breakpoints and combine them to form the media query expression.

```scss
@include media("screen", ">bp1Width", "<maxWidth" ) {
  background: red;
  color: white;
};
```

This makes your code cleaner because you don't have to keep specifying the point at which the media query kicks in, which can become a bit messy in case you suddenly decide to change your breakpoints. I used to define 3 breakpoints and call them _phone_, _tablet_ and _desktop_ instead of _bp1Width_ and this worked great. I could easily write a media query to affect a range of devices and that would be clear in the code.

However, at some point I needed to change the layout of an element at a specific viewport width that is different from the ones I had set for the devices. Maybe you want a burger menu on the phone layout but it starts to look weird when you hit 620px. Maybe you have a different version of the tablet layout that only works from 550px upwards.

Dmitry's mixin didn't allow me to do this, so one option would be to go back to using regular media queries for these cases, which I wasn't too happy about because a) I would be mixing two syntaxes and b) I would end up manually specifiying the device breakpoints that I defined because I couldn't combine them with custom widths.

The other option would be to extend the functionality of the mixin to allow the combination of defined breakpoints with custom ones. Did I go for that one? Oh you bet.

```scss
$breakpoint-phone: 480px !default;
$breakpoint-tablet: 768px !default;
$breakpoint-desktop: 1024px !default;

@function translate-media-condition($c) {
  $condMap: (
    "screen": "only screen",
    "print": "only print",
    "retina": "(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 3/2), (min-device-pixel-ratio: 1.5), (min-resolution: 120dpi)",
    ">phone": "(min-width: #{$breakpoint-phone})",
    "<phone": "(max-width: #{$breakpoint-phone - 1})",        
    ">tablet": "(min-width: #{$breakpoint-tablet})",
    "<tablet": "(max-width: #{$breakpoint-tablet - 1})",    
    ">desktop": "(min-width: #{$breakpoint-desktop})",
    "<desktop": "(max-width: #{$breakpoint-desktop - 1})"
  );
  
  @if map-has-key($condMap, $c) {
    @return map-get( $condMap, $c );
  } @else {
    $operator: str-slice($c, 1, 1);
    $size: number(str-slice($c, 2));
    $rule: "";

    @if ($operator == ">") {
      $rule: "(min-width: #{$size})";
    } @else {
      $rule: "(max-width: #{$size - 1})";
    }

    @return $rule;
  }
}

@mixin media($args...) {
  $query: "";
  
  @each $arg in $args {
    $op: "";
    $translation: translate-media-condition($arg);
    
    @if ($query != "" ) {
      $op: " and ";
    }

    $query: $query + $op + $translation;
  }

  @media #{$query}  { @content; }
}
```

I start by defining default values for the breakpoints (lines 1 to 3), which can be overwritten at any point in the code since I'm using `!default`. I then parse the conditions and see if they match one of the default breakpoint expressions (line 19); if not, then we're dealing with a custom breakpoint.

In that case, I check if the first character matches a "greater than" or "less than" (lines 26 and 28), parse the number (using [Hugo Giraudel's](http://hugogiraudel.com/2014/01/15/sass-string-to-number/) function, line 23) and return the expression. Easy peasy.

This allows me to do things like:

```scss
@include media("screen", ">phone", "<620px") {
  nav.burger {
    display: block;
  }
}

@include media("screen", ">550px", "<desktop") {
  aside.help {
    width: 100%;
  }
}
```

That's it! What do you think of this approach? Erm, I guess I need to implement some sort of commenting system before I start asking questions, right? More on that later.<!--tomb-->

*[Sass Media queries on GitHub](https://github.com/eduardoboucas/include-media)*