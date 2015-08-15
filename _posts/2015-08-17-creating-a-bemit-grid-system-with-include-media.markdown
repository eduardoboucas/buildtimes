---
layout: post
title:  "Creating a BEMIT grid system with include-media"
date:   2015-08-17 09:28:00
categories: blog
tags: include-media grid bem bemit
---
Earlier this month, Harry Roberts wrote a blog post about a new naming convention for classes that he’s been using, called BEMIT. Just like everyone else in the web dev community, I listened.<!--more-->

Harry is known to be an avid proponent of the BEM naming convention — which I’ve also covered here countless times since I'm a fan of the technique myself — but he now took it up a notch [by coining the term BEMIT](http://csswizardry.com/2015/08/bemit-taking-the-bem-naming-convention-a-step-further/), an enhanced variation of BEM.

He introduces the concept of responsive suffixes, which he describes as:

> The next thing BEMIT adds to traditional BEM naming is responsive suffixes. These suffixes take the format @, and tell us this class when at this size

I loved that idea. I often find myself in a situation where I define a simple grid with elements that are supposed to take a third of the screen width, but that eventually will have to take 100% of the width once the screen gets smaller. It often looks like this:

{% highlight scss linenos %}
.col {
    float: left;
}

.col--1-3 {
    width: 33.3333%;
}

.my-element {
    @include media('<tablet') {
        width: 100%;
    }
}
{% endhighlight %}

The `.col--1-3` class is supposed to read as "a column that takes 1/3 of the space available", so similarly a division into two halves would use `.col--1-2` classes. In fact, it's possible to have Sass generating all those classes automatically, as I described [in this post]({% post_url 2015-01-13-experimenting-with-sass-and-grids %}).

This solution works, but it has some (ugly) caveats:

1. Depending on how/where the grid classes are defined, you might need an `!important` to override them. *Yikes!*
1. It seems odd to be overriding the column’s default width with a `max-width` media query. Not very mobile first.
1. Finally, and perhaps more importantly, the markup isn’t really semantic. The element has the class `.col-1-3`, which leads you to think it takes a third of the space available, but that’s not always the case; that only happens on certain viewport sizes.

So if we take the principles of *BEMIT* and apply them to our grid classes, we could have a semantic responsive grid system. Essentially, we’d need classes like `.col-1-2@small`, `.col--1-2@medium`, `.col--1-2@large` and so on, depending on the number of subdivisions required and the number of breakpoints used throughout the project.

## include-media marries BEMIT

When using a library for managing all the breakpoints in a project (such as [include-media](http://include-media.com)), it seems logical to use take advantage of its power to generate all the grid classes with the responsive suffixes. The following mixin, part of [the include-media-grid plugin](https://github.com/eduardoboucas/include-media-grid), does just that.

{% highlight scss linenos %}
@mixin im-grid($columns...) {
  @each $breakpoint in $breakpoints {
    $breakpoint-name: nth($breakpoint, 1);

    @include media('>=' + $breakpoint-name) {
      @each $i in $columns {
        @for $n from 1 through $i {
          .col--#{$n}-#{$i}\@#{$breakpoint-name} {
            width: ($n/$i) * 100%;
         }
       }
     }
    }
  }
}
{% endhighlight %}

So let's imagine a website with three breakpoints (small, medium and large), and a grid of articles that should display four items per row on the large view, two on the medium view and just one on the small view.
After importing include-media and the include-media-grid plugin, a call to the `im-grid()` mixin generates all the classes. In this case, we only need to divide the page into fourths.

{% highlight scss linenos %}
@import 'include-media';
@import 'include-media-make-grid';

@include im-grid(4);

// Using floats for the grid
.col {
    float: left;
}
{% endhighlight %}

{% highlight html linenos %}
<!-- HTML -->
<article class="col col--1-4@large col--2-4@medium col--4-4@small">
    <!-- Article here-->
</article>
{% endhighlight %}

Please note that the plugin alone is not sufficient to create a grid system *per se*, it only generates the classes that divide the page into equal portions. To achieve a grid effect, a method for positioning the various elements side-by-side is necessary.

In this example, I've used floats (lines 7-9), but a similar result could've been achieved by using `display: inline-block` or even Flexbox. [This article](https://mixitup.kunkalabs.com/learn/tutorial/responsive-grids/) is a good reference of all the possible approaches, along with their advantages and caveats.<!--tomb-->

**[include-media-grid on GitHub](https://github.com/eduardoboucas/include-media-grid)**
