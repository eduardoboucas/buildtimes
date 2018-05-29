---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/transforming-javascript-edge.html"
layout: post
title:  "Transforming JavaScript at the edge"
tags:
- blog
- javascript
- transpile
- es6
- dadi
- cdn
external-url: https://medium.com/@daditech/transforming-javascript-at-the-edge-e7e9836b6c83
external-name: DADI Medium
external-date: 2018-03-09
---
One of the greatest challenges of building for the Web is the plethora of devices, operating systems and browser combinations that the product must support. How do you move this universal platform forward whilst retaining compatibility with older setups, which often still represent a significant percentage of the market?

At its core, the technology of the Web has evolved quite conservatively over the years – we still have HTTP requests with verbs, headers and body. However, the applications that we build on top of them are as complex as ever, not only on the server, where the complexity of web applications has traditionally lived, but also on the client, with front-end applications handling astonishing amounts of business logic and data access operations.<!--more-->

This paradigm puts additional pressure on the technologies that live in the browser, especially the JavaScript language, to evolve in such a way that gives developers the tools they need to write powerful, concise and performant code. Which brings us back to the opening question: how do you push JavaScript forward whilst retaining compatibility with those browsers whose capabilities are locked in time forever?

## Polyfills

ECMAScript 2015 (aka ES6) introduced [`Number.isNaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN), a new and more robust method for determining whether a variable is `NaN`. Older browsers, such as Internet Explorer, don't recognize this method and therefore will throw an error when interpreting it.

In this particular case, it's fairly straightforward to equip legacy browsers with the missing feature. Syntactically, there is nothing in the expression `Number.isNaN(x)` that legacy systems won't understand – it's a case of calling a function that doesn't exist, so we can simply create it ourselves.

```javascript
Number.isNaN = Number.isNaN || function (value) {     
  return value !== value;
}
```

The code above is called a *polyfill*. It starts by checking whether the feature in question already exists, doing nothing if so. If not, it extends the `Number` object with a new function that mimics the desired behavior as best as possible using a subset of the language that is fully compatible with the target system.

## Transpiling

Things get a bit more complicated when we talk about changes to the syntax of the language, such as the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) or [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions). If an unsupported system encounters this code, it will just break. It's not possible to polyfill this type of functionality.

In such cases, the only option is to rewrite the unsupported code using only the subset of features that are supported by the target system (e.g. converting ES6 to ES5).

```javascript
// Translating this
const greeter = name => `Hello, ${name}`

// ... into this
var greeter = function (name) {
  return 'Hello, ' + name
}
```

It's possible to automate this translation with a process called *transpiling*, which is made possible by tools like [Babel](https://babeljs.io/).

Traditionally, this happens at build time, similarly to how Sass or Less are translated to CSS before it reaches the server. This allows developers to write their applications using modern code, whilst the end user will receive a translated, backward compatible code that was automatically generated from the original.

This may seem like the best of both worlds, but in reality it means that the modern code will never reach the end user. Any user.

Even if they're running the latest version of a modern browser, users will still be served the legacy code for as long as support for legacy systems is required. The modern code may be faster to transfer, parse or run, but those benefits will be lost at build time with the transpiling process.

## Transforming at the edge

[DADI CDN](https://github.com/dadi/cdn) offers *at the edge* support for some transforming operations that are typically done at build time, such as *minification*. With [version 2.0](https://github.com/dadi/cdn/releases/tag/v2.0.0-rc1), we started experimenting with taking that concept further and extending it to transpiling.

By transforming the code on-demand rather than once at build time, we're able to tweak the asset based on the capabilities of who's requesting it. In practice, this means we can see which portions of the code are natively supported by the client and leave those alone, translating only the ones that aren't.

In a way, this is like taking to transpiling the principles of polyfilling – extend native behavior only when absolutely necessary.

## How it works

When a request for a JavaScript file is made with `compress=1` in the URL, we run the code through Babel. Instead of supplying a generic list of targets (e.g. `">1% in US"` or `"last 2 versions"`) as typically done, we specify the exact vendor and version of the requesting browser, which we obtain from the user agent string. This tells Babel to optimize the transpilation for the exact browser we're dealing with.

### Caching

Transpiling a large JavaScript bundle can be quite an expensive operation, so to make this a viable approach it's imperative that a smart and effective caching layer is in place. One of the challenges around that is choosing the right cache key.

The first obvious candidate is the user agent string, as we can avoid transpiling the same file twice for the same exact browser. But different browsers can have the same capabilities and yet have different user agent strings (e.g. Chrome 64 and Firefox 54, or even the same version of Chrome on Windows vs. Mac OS). This would generate different cache keys and therefore unnecessary cache misses.

The solution was to tap into [babel-preset-env](https://babeljs.io/env/) to get a list of transformation functions that the asset requires in order to be compatible with the given target browser. That list of functions is ran through a fingerprinting algorithm to generate a unique hash. By using this hash as our cache key we ensure that requests from browsers with identical capabilities are mapped to the same cached asset.

This makes it possible to perform cache pre-warming for a reasonably sized list of browsers, ensuring that the delivery of the assets will be pretty much instant for the majority of people, and yet bespoke at the same time. *This* starts to look like the best of both worlds.

## Lab coat and goggles required

There is still a lot of room for improvement in the implementation and loads of questions to answer, but we figured the best way to move it forward is by involving the community from day one, making the feature available behind an experimental feature flag.

To start using it today, install the latest version of CDN and add `experimental.jsTranspiling: true` to your configuration file or start the app with the `JSTRANSPILING="true"` environment variable.

## Just getting started

We're working hard on making CDN more powerful. We'll add support for [on-demand polyfilling](https://github.com/dadi/cdn/issues/273) in the near future, making use of [polyfill.io](https://polyfill.io/v2/docs/). If you would like to share your thoughts on this vision, or even better, if you're planning on building something with it, please [let me know](https://twitter.com/eduardoboucas) – I'm always around to help!<!--tomb-->