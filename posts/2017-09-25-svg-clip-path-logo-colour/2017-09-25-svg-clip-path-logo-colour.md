---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/svg-clip-path-logo-colour.html"
layout: post
title: "Using SVG clip-path to change a logo's colour on scroll"
tags:
  - blog
  - svg
  - clip
  - path
  - logo
  - colour
  - scroll
---

Last week I put together a landing site for a new business. The design was quite straightforward: a single page with various sections represented as full-width horizontal blocks with different background colours, and a fixed positioned logo on the top-left corner.

The only particularity was that the logo should change colours, as the user scrolls, depending on which section it overlaps.<!--more--> When positioned over a section with a dark background, the logo should be white. When overlapping a section with a light background, it should be dark blue.

{% include helpers/image.html, name:"fortblocks-design.png" caption:"Landing site design" %}

The first thought that comes to mind is to use two images and swap them as the user scrolls, but that doesn't work here. If you look closer at the designs above, the second screen shows the logo overlapping a dark/light cross-section. When that happens, the portions of the logo that overlap each section must be coloured accordingly.

## Attempt #1: animate position

After searching around, I found [this pen](https://codepen.io/eighthday/full/MKqBjX/). It works by having a _master_ version of the logo, as `position: fixed`, and several copies – one for each section – with `position: absolute`. As the user scrolls, the position of each copy is moved up or down so it perfectly overlaps the _master_, creating the illusion that it's the same element.

During my tests, it worked beautifully in Chrome, but it was quite jittery in Safari.

{% include helpers/video.html, name:"first-approach.mov" , caption:"Animating the position looks jittery in Safari" %}

## Attempt #2: SVG clip-path

When attempt #1 failed, I tried to approach it from a different angle. Instead of having one copy of the element per section and animate their positions so they overlap, I created two copies (one dark and one light) of the logo and placed them exactly on top of each other, both with fixed positioning.

Next, I had to find a way of hiding a portion of a logo in such a way that the void created reveals a part of the other one. This sounded like a mask, so `clip-path` was a good candidate. When used on HTML elements, its browser support is [quite limiting](http://caniuse.com/css-clip-path/embed), but my logo was an SVG, in which case the support is pretty much ubiquitous.

### Creating the masks

I started by creating an SVG `<clipPath>` element for each logo.

```html
<!-- Main logo -->
<svg>
  <defs>
    <clipPath id="logo-main-mask">
      <rect x="0" y="0" width="200" height="120" />
    </clipPath>
  </defs>

  <g clip-path="url(#logo-main-mask)">
    <use xlink:href="#logo" />
  </g>
</svg>

<!-- Secondary (alt) logo -->
<svg>
  <defs>
    <clipPath id="logo-alt-mask">
      <rect x="0" y="120" width="200" height="0" />
    </clipPath>
  </defs>

  <g clip-path="url(#logo-alt-mask)">
    <use xlink:href="#logo" />
  </g>
</svg>
```

Then I created a function that allowed me to manipulate the dimensions and position of the masks in such a way that the exact amount of each logo would be shown. The following function receives two arguments:

- `amount` is the number of pixels to be revealed from the logo that is displayed on top
- `isDark` is a boolean that defines whether the first section that overlaps the logo has a dark background

```javascript
// `logoDimensions` is an object containing the dimensions
// of the main logo element
function blendLogoMasks(amount, isDark) {
  if (maskCache.isDark === isDark && maskCache.amount === amount) {
    return;
  }

  var alt = {};
  var main = {};

  if (isDark) {
    alt.y = amount + 1;
    alt.height = logoDimensions.height - amount;

    main.y = 0;
    main.height = amount;
  } else {
    alt.y = 0;
    alt.height = amount;

    main.y = amount + 1;
    main.height = logoDimensions.height - amount;
  }

  $("#logo-alt-mask rect").attr({
    y: alt.y,
    height: alt.height
  });

  $("#logo-main-mask rect").attr({
    y: main.y,
    height: main.height
  });

  maskCache.isDark = isDark;
  maskCache.amount = amount;
}

// This would generate a logo with the first 100px of white
// and the rest as dark blue
blendLogoMasks(100, false);
```

Couple of things to note here:

- The examples are using jQuery to more succinctly represent DOM interactions, but it's absolutely not essential to build this functionality;
- `maskCache` is an object that stores the last pair of arguments (`amount` and `isDark`) that the function was called with, avoiding touching the DOM for multiple calls with the same values. It's a performance optimisation that will make more sense shortly.

### Mapping the sections

To more easily calculate when the logo is overlapping each section, I mapped each section as an object containing the vertical position at which the section ends, whether the section has a light or dark background and a reference to the DOM node.

```javascript
function generateSectionsMap() {
  var sections = [];

  $sections.each(function() {
    var top = $(this).offset().top;

    sections.push({
      $el: this,
      end: top + $(this).outerHeight(),
      isDark: $(this).hasClass("js-section-dark")
    });
  });

  return sections;
}
```

### Updating the blend on scroll

Finally, we need to update the blend of the masks as the user scrolls. To do that, I first created a function that detects when the logo is overlapping one or two sections, and what the colours of their backgrounds are.

```javascript
function updateLogo(sections) {
  var scrollOffset = $body.scrollTop();
  var logoStart = $logoMain.offset().top;
  var logoEnd = logoStart + logoDimensions.height;
  var section;

  $.each(sections, function(index, section) {
    if (section.end >= logoStart) {
      if (
        section.end <= logoEnd &&
        sections[index + 1] &&
        sections[index + 1].isDark !== section.isDark
      ) {
        // Logo is on a cross-section, the first element in the
        // blend gets the amount of pixels in the section not
        // overlapping the logo. We only do this if the sections
        // have a different background, otherwise we treat it as
        // a single section.
        blendLogoMasks(section.isDark, section.end - logoStart);
      } else {
        // Logo is on a single section, the first element in the
        // blend can have the entire height of the logo.
        blendLogoMasks(section.isDark, logoDimensions.height);
      }

      return false;
    }
  });
}
```

Finally, we just need to attach this function to the `onScroll` event and also call it when the page loads.

```javascript
var sections = generateSectionsMap();

updateLogo(sections);

$(window).on("scroll", function() {
  updateLogo(sections);
});
```

And it works! :tada:

## The end result

Here's how it looks on the same version of Safari that was being problematic before.

{% include helpers/video.html, name:"second-approach.mov", caption:"The result of animating the logos using SVG clip-path" %}

~~You can see it live (and dissect the source) here~~ (The site is no longer live, unfortunately.)<!--tomb-->
