---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/rapid-deployment-with-sass.html"
layout: post
title:  "Rapid deployment with Sass"
tags:
- blog
- sass
- scaffold
- grunt
---
A CSS processor like Sass is nowadays a must-have tool for web projects with a large codebase — maintaining a large website in pure CSS simply doesn’t cross my mind these days, personally. But what about medium-sized and small projects? <!--more-->My job involves rapidly deploying relatively small sites almost every week and all of them are using Sass. 

We don’t use any CSS frameworks or UI libraries, but we’ve been creating our own small library of reusable functions and mixins that we can just throw in a project and start using right away. We also keep our code modular, having separate files for our BEM blocks, a file for typography, another one for colours and so on. To be able to quickly implement this entire structure on new projects, I created [a very simple scaffolding Sass template](https://github.com/eduardoboucas/sass-scaffold) containing all the pieces we need and that anyone can just pull and start modifying right away.

Here’s the structure:

```text
.
├── sass/
|   ├── base/
|   |	├── _base.scss
|   |	└── _reset.scss
|   ├── global/
|   |	├── _colors.scss
|   |	├── _global.scss
|   |	└── _typography.scss
|   ├── helpers/
|   |	├── _font-size.scss
|   |	└── _include-media.scss
|   ├── modules/
|   └── main.scss
```

And here's the idea:

- **base/**: This is the place for the stuff we don't really need to touch. Eric Meyer's [CSS reset](http://meyerweb.com/eric/tools/css/reset/), `box-sizing: border-box` by default for all the things, font-size of 62.5% in `<html>` for easier rem usage and clearfix.
- **global/**: For rules that affect the site globally - e.g. declaration of colour variables, typography imports. In `_global.scss` I typically declare font sizes for headings and paragraphs, line heights, list styles and whatnot.
- **helpers/**: For mixins and functions. From a simple mixin to declare font-sizes in rems with a pixel fallback to the more complex [include-media](http://include-media.com) for writing media queries. I also include a mixin that generates classes that I use to build a grid system, detailed [here](/2015/01/13/experimenting-with-sass-and-grids.html).
- **modules/**: Here's where all the individual elements in the page are styled. I use BEM as a naming convention for my classes and typically each block is a separate file inside this directory. For larger projects, it may make sense to divide modules into sub-folders.
- **main.scss**: This file is used to import all the other files, so it contains nothing but `@import` instructions.

## Using Grunt to load everything

I use Grunt to watch changes on any SCSS file, compile the Sass and auto-prefix the resulting CSS code. But there was still something that was pretty much manual: every time someone added a new file to the structure, be it a mixin or a new module, they would have to manually add an `@import` to `main.scss`. Ideally, you'd want to be able to import entire directories instead of individual files, but Sass doesn't support it. 

I started to look for solutions for this (without using Compass) and found a [couple](https://github.com/chriseppstein/sass-globbing) [of](https://www.npmjs.com/package/sass-import-compiler) [options](https://www.npmjs.com/package/grunt-sass-directory-import), but none of them dealt in any way with the problem of source order. "What is that?", you might ask. Well, when your Sass files have dependencies (i.e. make use of variables, mixins or functions declared in another file) the order in which you import them into your project actually matters. 

For example, if `_moduleA.scss` uses a mixin declared in `_include-media.scss`, you have to import `_include-media.scss` first or you'll see an error. The solutions mentioned above wouldn't be a problem in this case, because the two files would be in separate directories and I could just import `helpers/` first and `modules/` last. But I wanted a way to solve that issue for when files within the same directory have dependencies.

As a result, I created [grunt-sass-import](https://www.npmjs.com/package/grunt-sass-import), a Grunt plugin that offers a very basic mechanism for handling source order. In a nutshell, you still import entire directories of SCSS files but you can say "look, when you handle directory `a/`, import file `_d.scss` first and leave `_a.scss` to the end".

In the case of my structure described above, I want to load `modules/` last, because that's where I use most of the stuff defined in `global/` and all the mixins and functions declared in `helpers/`. So the import order can be `base/`, `global/`, `helpers/` and finally `modules/`, but `global/` contains `_global.scss` that makes use of stuff declared in `_typography.scss` and `_colours.scss`, in the same directory. At that point I can say "when you load `global/`, leave `_global.scss` to the end".

This is how I define that task in my `Gruntfile.js`:

```javascript
sass_import: {
  options: {
    basePath: 'sass/'
  },
  dist: {
    files: {
      'main.scss': ['base/*', {last: 'global/_global.scss', path: 'global/*'}, 'helpers/*', 'modules/*']
    }
  }
},
```

## Final thoughts

This Sass structure was created to suit my needs and with small to medium sized projects in mind. I do not intend to propose any of this as a standard or good practice guide. For something like that, you should probably check the [Architecture section]( http://sass-guidelin.es/#architecture) on Hugo Giraudel’s Sass Guidelines.

The Grunt plugin is in a very early stage of development. I have only very recently released it to the webs so the lack of testing and feedback from the community makes it a very immature project. It came about to solve a problem (25%) and because it's fun to play with Node and I wanted to write a Grunt plugin (75%).<!--tomb-->

*References:*

*[sass-scaffold on GitHub](https://github.com/eduardoboucas/sass-scaffold)*

*[grunt-sass-import on npm](https://www.npmjs.com/package/grunt-sass-import)*

*[grunt-sass-import on GitHub](https://github.com/eduardoboucas/grunt-sass-import)*