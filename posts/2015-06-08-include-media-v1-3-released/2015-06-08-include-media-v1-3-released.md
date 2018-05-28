---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/include-media-v1-3-released.html"
layout: post
title:  "include-media v1.3 released"
tags:
- blog
- include-media
- sass
- media-queries
---
Version 1.3 of [include-media](http://include-media.com) is out and I'm excited to say it's quite a big one. For the past couple of weeks, [Hugo Giraudel](http://hugogiraudel.com/) has been doing some of his Sass wizardry on the project, refactoring some parts and adding new features.<!--more-->

If you ever read an article about Sass, there's a good chance that it was written by Hugo. He authors and maintains projects like [Sass Guidelines](http://sass-guidelin.es/), [SassDoc](http://sassdoc.com/), [Sass Compatibility](http://sass-compatibility.github.io/) and [others](https://github.com/HugoGiraudel/awesome-sass), so it was a no-brainer when he told me that he started using include-media on a big project and that he had a couple of ideas on how to improve it.

The keyword for what we've been doing is *simplicity*. Some big parts of the logic were changed under the hood, but always with the objective of keeping the library lightweight and maintaining its API clean and simple to use. So without further due, here's version 1.3.

## Content-specific breakpoints (or tweakpoints)

With content-specific media queries — or tweakpoints, as coined by [Jeremy Keith on Adactio](https://adactio.com/journal/6044) — you can refer to breakpoints or media expressions that only exist within a certain module or component. In its essence, the idea is the same as defining on-the-fly breakpoints, where breakpoint values that only make sense for a certain element shouldn't pollute the global breakpoint list. However, it takes it one step further and allow those values to be defined an reused multiple times within the component. 

Here's an example.

```scss
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
```

Hugo initially wrote about this on [his SitePoint article](http://www.sitepoint.com/breakpoints-tweakpoints-sass/) and now it's available on include-media.

## Ligatured operators

This might seem a small one, but it follows the library's key principle of a clean and natural syntax. As of v1.3, the `≤` and `≥` operators can be used can be used in conjunction with the previous `<=` and `>=` ones.

```scss
@include media('≥phone', '≤tablet') {
    color: tomato;
}

// Same as:
@include media('>=phone', '<=tablet') {
    color: tomato;
}
```

This way, any expression can be written with just a single-character operator.

## Improved development workflow

We used to Grunt, but now we Gulp. Gulp is automating a lot of things for us now, such as generating and publishing the latest [SassDoc document](http://include-media.com/documentation/), automatically printing the library version on the distribution file, or running some tests (more on this in a second).

There's also a new [CONTRIBUTING.md](https://github.com/eduardoboucas/include-media/blob/master/CONTRIBUTING.md) file which is a great reference for people that wish to contribute to the project (which we obviously welcome!).

## Testing and QA

We spent some time in re-thinking the testing and QA process of the project, to make sure each that version released is robust and that the API doesn't break. To do this, there's a new linter in place to make sure the code submitted meets our standards and we've also added Hugo's [SassyTester](https://github.com/HugoGiraudel/SassyTester) test engine, entirely built in Sass and incredibly simple.

For every commit, Gulp will run an extensive list of tests, both on Ruby Sass and LibSass, to make sure the code is passing the quality tests.

## Sache

The project has been added to [Sache](http://www.sache.in/), so there's yet another place people will be able to find us.

## Wrapping up

There were [a couple](https://github.com/eduardoboucas/include-media/pull/31) of [pull requests](https://github.com/eduardoboucas/include-media/pull/24) that people submitted with proposed new features for the library. While we appreciate the effort put into them and the value they would add to the project, we're committed to keeping include-media as simple and minimalistic as possible. As a result, we propose that bigger additions like these should find their place in the project as additional plugins and not in the core codebase. However, filing a pull request and starting the discussion is always the place to start.

And there you have it. The [website](http://include-media.com) has been updated with the new features and a couple of code snippets to demonstrate them and both me and Hugo will keep an eye on any issues filed on GitHub.<!--tomb-->
