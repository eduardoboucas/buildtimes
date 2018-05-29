---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/experimenting-with-sass-and-grids.html"
layout: post
title:  "Experimenting with Sass and grids"
handle: "experimenting-with-sass-and-grids"
tags:
- blog
- sass
- css
- responsive
- grid
---
CSS grid systems are very popular nowadays and a preprocessor is a good friend to have if you're looking to use them. Systems like [Gridle](http://gridle.org/), [Neat](http://neat.bourbon.io/) or [Susy](http://susy.oddbird.net/) are very powerful (and considerably complex) tools, and in case you're already using any of them let me warn you straight away: this post won't bring anything new or add anything to what they do.
If you're like me, however, you'll most likely want to create your own solution at some point, something small and with code that you fully understand, giving you full control over things. If that's the case, read along.<!--more-->

A grid system is actually not difficult at all to write and Chris Coyier [did a pretty good job](http://css-tricks.com/dont-overthink-it-grids/) in demystifying that belief. I often find myself using that same approach to build a very simple grid system on my projects, but it recently hit me that actually I could use Sass to do some of the boring parts of the job for me. 

Let's take a very simple grid layout as an example.

<p data-height="300" data-theme-id="0" data-slug-hash="myWEpX" data-default-tab="result" data-user="eduardoboucas" class='codepen'>See the Pen <a href='http://codepen.io/eduardoboucas/pen/myWEpX/'>myWEpX</a> by Eduardo Bouças (<a href='http://codepen.io/eduardoboucas'>@eduardoboucas</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

As you can see from the code in the pen, the CSS implementation of this is really straightforward:

```css
[class^="col-"] {
  float: left;
}

.col-1-1 {
	width: 100%;
}

.col-1-2 {
	width: 50%;
}

.col-1-3 {
	width: 33.3333%;
}

.col-2-3 {
	width: 66.6666%;
}

/* We'd also need to clearfix the parent, 
   but I'm skipping that for simplicity. */
```

We start by saying that all the columns must float left (lines 1 to 3). Then we define the column classes, the centrepiece of our grid system, so we can give an element a relative width based on its class (`.col-1-1`, `.col-1-2`, etc.).
We can add as many classes as we want to make the columns as granular as necessary to give us enough control over the widths of the columns, but what if we get to things like `.col-1-8`? Will we manually write all the possible combinations? This is where I knew Sass could help.

## Sass to the rescue

We can quickly put something together to help us.

```sass
$granularity: 3;

@for $i from 1 through $granularity {
  @for $j from 1 through $i {
    .col-#{$j}-#{$i} {
      width: $j/$i * 100%;    
    }
  }
}
```

This will generate:

```css
.col-1-1 {
  width: 100%;
}

.col-1-2 {
  width: 50%;
}

.col-2-2 {
  width: 100%;
}

.col-1-3 {
  width: 33.33333%;
}

.col-2-3 {
  width: 66.66667%;
}

.col-3-3 {
  width: 100%;
}
```

This codes generates all the possible combinations for the granularity we specify, so if we did want to go all the way to `.col-x-8` we'd just set `$granularity` to 8. 
That alone is quite helpful already, but it annoys me a little bit to see `.col-1-1`, `.col-2-2` and `.col-3-3` with 3 different declarations when they are equivalent (this is where it starts getting a bit crazy, but bare with me).

I'm not saying we should solve this by getting rid of equivalent classes, because sometimes one name can make more sense than others. For example, if I'm dividing a layout in sixths and I want one div to take 2 slots, another to take 3 slots and the last one 1 slot, I would rather declare them as `.col-2-6`, `.col-3-6` and `.col-1-6` than `.col-1-3`, `.col-1-2` and `.col-1-6`. Yes, they are equivalent and the math is not rocket science, but is syntactically more confusing and feels less natural to me.

Instead, I wanted to group equivalent classes together to have a more compressed CSS output. For example, I wanted the example shown above to look like this:

```css
.col-1-1, .col-2-2, .col-3-3 {
  width: 100%;
}

.col-1-2 {
  width: 50%;
}

.col-1-3 {
  width: 33.33333%;
}

.col-2-3 {
  width: 66.66667%;
}
```

See how we group `.col-1-1`, `.col-2-2` and `.col-3-3` together with the same set of rules? I would also want to group `.col-1-3` with `.col-2-6` and `.col-1-2` with `.col-3-6` from the example I mentioned before. How can we implement something like this in Sass?

```sass
@mixin grid-columns($granularity: 2, $breakpoints: ()) {
  $widths: ();
  
  @each $i in $granularity {
    @for $j from 1 through $i {
      $newWidth: unquote('.col-#{$j}-#{$i}');
      $width: $j/$i;
      
      @if (map-has-key($widths, $width)) {
        $newWidth: append(map-get($widths, $width), $newWidth, comma);
      } @else {
        $newWidth: $newWidth;
      }
      $widths: map-merge($widths, ($width: $newWidth));
    }
  }
  
  @each $granularity in $widths {
    $value: nth($granularity, 1);
    $classes: nth($granularity, 2);
    
    #{$classes} {
      width: $value * 100%;
      
      @each $breakpoint in $breakpoints {
        $width: nth($breakpoint, 1);
        $factor: nth($breakpoint, 2);
        
        @media (max-width: $width) {
          $newWidth: $value * $factor * 100%;
          
          width: if($newWidth <= 100%, $newWidth, 100%);
        }
      }
    }
  }
}
```

Definitely! Pretty, right? In a nutshell, we're putting everything in a map where the widths are the keys (so 2/6 and 1/3 will have the same key). So how to use it?

```sass
@include grid-columns((1, 2, 4));
```

This will have the mixin generating the column classes for 1, 2, and 4 (`.col-1-1`, `.col-x-2` and `.col-x-4`) for us.

## A little bonus: breakpoints

As you can see, our mixin includes an extra argument, `$breakpoints`. The idea behind this is that in some very specific cases, you want to change the width of the columns proportionally on certain breakpoints. Take the following example.

Let's go back to the grid layout we built before and let's imagine it's being used to display a list of articles on a magazine website. On the full desktop view, the pattern is a `1-1` taking a full row (maybe it's a featured article), two `2-2` in the next row (still relevant stories) and four `4-4` in the last row (probably less important stories). This pattern could be repeated indefinitely and alternated with others. The typical approach to make this responsive is to make all the columns go full-width when the browser gets narrower than a certain width.

```css
@media (max-width: 500px) {
	[class^="col-"] {
	  /* Depending on how you create the grid, you might need an !important here. 
	  Breathe, it's all right. */
	  width: 100% !important;
	}	
}
```

But actually we could have an intermediate layout (or multiple intermediate layouts) before going full-width, where we make the columns bigger to compensate for the smaller screen while still making use of the space we still have (and thus keeping the hierarchy a bit longer). Something like this (try resizing your browser):

<p data-height="300" data-theme-id="0" data-slug-hash="PwpzRB" data-default-tab="result" data-user="eduardoboucas" class='codepen'>See the Pen <a href='http://codepen.io/eduardoboucas/pen/PwpzRB/'>PwpzRB</a> by Eduardo Bouças (<a href='http://codepen.io/eduardoboucas'>@eduardoboucas</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

Our mixin handles that just fine:

```sass
@include grid-columns((1, 2, 4), (768px: 2));
```

This will tell the mixin that below 768px all the widths will be multiplied by a factor of 2 (always making sure they don't exceed 100%, line 32). Again, this works fine on very specific cases where the layout is divided symetrically and with an even number of columns (or just one) per row.

## Final thoughts

Before you call me crazy for suggesting that you use this in production, remember that I did not suggest that (even though I probably will, because why the hell not). This was an experiment that resulted from my experience with grid systems, my curiosity for pushing the limits of Sass and my boredom.
I hope you find this interesting and if you do find an use for this in a real-world scenario, give me a shout in the comments.<!--tomb-->