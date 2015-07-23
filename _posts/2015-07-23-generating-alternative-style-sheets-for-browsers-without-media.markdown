---
layout: post
title:  "Generating alternative style sheets for browsers without @media"
date:   2015-07-23 15:28:00
categories: blog
tags: include-media sass ie8 media
---
If your CSS code is built with a mobile-first approach, it probably contains all the rules that make up the "desktop" view inside `@media` statements. That's great, but browsers that don't support media queries (IE 8 and below) will simply ignore them, ending up getting the mobile view — not good.<!--more-->

An alternative is to create two separate style sheets — a regular one to be served to modern browsers, and another without media queries, served to older browsers that don't support them. But is this maintainable? Is it reasonable to keep a separate style sheet for a small subset of visitors? In the true spirit of making the web accessible for everyone, we probably should.

Turns out that, as [Jake Archibald described](http://jakearchibald.github.io/sass-ie/), Sass can be used to automate a great part of the process. In fact, breakpoint managers such as [include-media](http://include-media.com/) or [Sass MQ](https://github.com/sass-mq/sass-mq) provide a mechanism for dealing with this quite easily and with no extra maintainability effort.

In this article, I'll describe how to use include-media to generate an alternative style sheet without media queries, as well as to how to integrate that process in the workflow of popular build tools.

## A first approach

So how do we go about generating this alternative style sheet? We want to get rid of all `@media` statements, but it's not as simple as unwrap each one of them all and use its contents.

For example, let's imagine a grid of articles. On a mobile view, each article should take the full width of the screen, but as the viewport width grows, more articles should be fitted into one row. To do that, we gradually decrease the width of the article relative to its container with a few media queries — by the time we get to `1400px`, we'll be able to fit 8 articles per row.

{% highlight css linenos %}
/* Original rules (1) */
.article {
    width: 100%;

    @media (min-width: 768px) {
        width: 50%;
    }

    @media (min-width: 1024px) {
        width: 25%;
    }

    @media (min-width: 1400px) {
        width: 12.5%;
    }
}

/* All media queries flattened (2) */
.article {
    width: 100%;
    width: 50%;
    width: 25%;
    width: 12.5%;
}
{% endhighlight %}

Without any special treatment, IE 8 would simply ignore all media queries and therefore render full width articles, even on a large screen (1). However, if we blindly flatten all media queries and use their contents, the browser will end up using the last rule at all times (`width: 12.5%`, in this case), even thought it was originally intended for exceptionally large screens only (2).

That's not ideal, as we've gone from ignoring all media queries to the other extreme of including them all — which on a typical site probably means going from a mobile view to a really large one. A more reasonable approach is to pick a specific width and select only the media queries that contribute to that view.

## Enter include-media

Moving into include-media land, let's start with the same list of breakpoints.

{% highlight scss linenos %}
$breakpoints: (
    'small': 320px,
    'medium': 768px,
    'large': 1024px,
    'super-large': 1400px
);
{% endhighlight %}

It's fair to assume that our IE 8 users won't be on a phone or a tablet, so it seems reasonable to serve them the website as it looks on the *large* view, so `1024px`. Let's take a look at a few media queries from one of the modules of our website, part of `_module1.scss`.

{% highlight scss linenos %}
.module1 {
    // This rule interests us, as it affects 'large'
    @include media('>=phone') {
        color: tomato;
    }

    // This one doesn't, as it's between 'medium' and 'large' (excluding)
    @include media('>medium', '<large') {
        color: chocolate;
    }

    // Not this one either, it affects only 'super-large'
    @include media('>=super-large') {
        color: wheat;
    }
}
{% endhighlight %}

With include-media, you can simply tell the library that you want to generate a version of the style sheets without media queries support, and specify which breakpoint you want to emulate. To do that, you simply set two variables (`$im-media-support` and `$im-no-media-breakpoint` respectively).

A typical scenario is to have two copies of the main SCSS file: the normal one stays as is (`main.scss`), and the alternative one with the variables set (`main-old.scss`).

{% highlight scss linenos %}
// main.scss

@import 'include-media';
@import 'module1';
{% endhighlight %}

{% highlight scss linenos %}
// main-old.scss

$im-media-support: false;
$im-no-media-breakpoint: 'large';

@import 'include-media';
@import 'module1';

// Resulting CSS
.module1 {
    color: tomato;
}
{% endhighlight %}

You can even specify which media expressions to accept when flattening media queries. For example, if you have a media query that targets retina devices, you probably don't want to include its contents in the alternative style sheet, even if it matches the emulated breakpoint.

{% highlight scss linenos %}
$im-no-media-expressions: (
    'screen',
    'print'
);

// This is retina only, we don't want this!
@include media('>=medium', 'retina2x') {
    color: olive;
}
{% endhighlight %}

## Integrating build tools

Integrating this workflow into your build tools is quite simple and makes the whole process seamless. I'm including example tasks for both Grunt and Gulp (sorry Broccoli users, I never eat my greens).

{% highlight js linenos %}
// Gruntfile.js

module.exports = function(grunt) {
  grunt.initConfig({
    sass: {
      dist: {
        files: {
          'css/main.css': 'sass/main.scss',
          'css/main-old.css': 'sass/main-old.scss'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask('default', ['sass']);
};
{% endhighlight %}

{% highlight js linenos %}
// Gulpfile.js

var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function() {
  return gulp.src(['sass/main.scss', 'sass/main-old.scss'])
    .pipe(sass())
    .pipe(gulp.dest('./css'));
});

gulp.task('default', ['sass']);
{% endhighlight %}

With that in place, the build tool will generate both style sheets automatically, outputting them to `css/main.css` and `css/main-old.css`.

## Serving the style sheets

Finally, we just need to serve the appropriate style sheet depending on the browser, using good old-fashioned conditional comments.

{% highlight text linenos %}{% raw %}
<!--[if lte IE 8]>
    <link rel="style sheet" href="css/main-old.css">
<![endif]-->
<!--[if gt IE 8]><!-->
    <link rel="style sheet" href="css/main.css">
<!--<![endif]-->
{% endraw %}{% endhighlight %}

And that's it. IE-friendly mobile-first responsive websites!<!--tomb-->