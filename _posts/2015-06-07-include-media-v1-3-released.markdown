---
layout: post
title:  "include-media v1.3 released"
date:   2015-06-07 14:30:00
categories: blog
tags: include-media sass media queries
---
Version 1.3 of [include-media](http://include-media.com) is out and I'm quite excited to say it's quite a big one. For the past couple of weeks, [Hugo Giraudel](http://hugogiraudel.com/) has been doing some of his Sass wizardry on the project, refactoring some parts and adding new features.<!--more--> 

If you ever read an article about Sass, there's a good chance that it was written by Hugo. He authors and maintains projects like [Sass Guidelines](http://sass-guidelin.es/), [SassDoc](http://sassdoc.com/), [Sass Compatibility](http://sass-compatibility.github.io/) and [others](https://github.com/HugoGiraudel/awesome-sass), so it was a no-brainer when he told me that he started using include-media on a big project and he had a couple of ideas on how to improve it.

So just three weeks after releasing 1.2, here's what's new in version 1.3.

## Content-specific breakpoints (or tweakpoints)

With content-specific media queries — or tweakpoints, as coined by Hugo on [his SitePoint article](http://www.sitepoint.com/breakpoints-tweakpoints-sass/) — you can refer to breakpoints or media expressions that only exist within a certain module or component. In its essence, the idea is the same as defining on-the-fly breakpoints, where breakpoint values that only make sense for a certain element shouldn't pollute the global breakpoint list. However, it takes it one step further and allow those values to be defined an reused multiple times within the component. Here's an example.

{% highlight sass linenos %}
// _my-component.scss
@include media-context(('custom': 678px)) {
    .my-component {
        @include media(">phone", "<=custom") {
            color: tomato;
        }

        @include media('>custom') {
            width: 100%;
        }
    }
}

// It works with media expressions too
@include media-context(('custom': 678px), ('tv': 'tv')) {
    .my-component {
        @include media(">phone", "<=custom") {
            color: tomato;
        }

        @include media('tv') {
            overflow: hidden;
        }
    }
}
{% endhighlight %}

## Ligatured operators

This is quite a small one, but it follows the library's key principle of a clean and natural syntax. As of v1.3, the `<=` and `>=` operators can be replaced with the `≤` and `≥` operators.

{% highlight sass linenos %}
@include media('≥phone', '≤tablet') {
    color: tomato;
}

// Same as:
@include media('>=phone', '<=tablet') {
    color: tomato;
}
{% endhighlight %}

This way, all expressions can be written with a single-character operator.

<!--- ligatured operators
- tweakpoints
- media merging
- grunt->gulp
- testing
- fix libsass issue-->