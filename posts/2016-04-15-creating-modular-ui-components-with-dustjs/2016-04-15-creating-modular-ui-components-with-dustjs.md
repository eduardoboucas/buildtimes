---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/creating-modular-ui-components-with-dustjs.html"
layout: post
title:  "Creating modular UI components with Dust.js"
tags:
- blog
- dust
- dustjs
- atomic
- design
- modular
- components
---
One of the most important changes in my mindset as a front-end engineer happened when I started to look at websites as a group of components, rather than a group of pages. The principle is not new, and articles like *[Don’t Build Pages, Build Modules](http://www.ebaytechblog.com/2014/10/02/dont-build-pages-build-modules/)* from the eBay engineering team or the reference piece on [atomic design by Brad Frost](http://bradfrost.com/blog/post/atomic-web-design/) provide a far better explanation than I could ever attempt to do — in short, building monolithic pages that are not reusable in different contexts isn't scalable, sustainable or maintainable in the long term.<!--more-->

Imagine, as an example, a *About us* page that contains some copy, an image and a modal dialog, triggered from a *Contact* link, with three fields: name, country and message. It's a simple layout, so one could be tempted to house everything (markup, styling and any JavaScript logic) under a *About us* block and call it a day. 

But what happens if you also need to use the modal dialog in the homepage, perhaps with a different colour scheme? And what if you also want to use just the country picker somewhere in the shopping cart process? Will you summon a "about us country picker" even though you're in a completely different context? Will you simply duplicate the code and live with the burden of maintaining it in two different places?

## Thinking in components

A more reasonable approach is to create a *country picker* component, self-contained and independent of its context, which will then be used in a *contact form* component (along with several other components), which will then be used in a larger *contact us* component and so on. You see where I'm going with this.

Ideally, a developer should be able to create a consistent and centrally-managed instance of any of these components, and include it with ease anywhere on the project. This is a difficult problem to tackle when considering all the languages involved in a web project. In CSS, it's possible (albeit with huge limitations until we have [CSS containment](https://justmarkup.com/log/2016/04/css-containment/)) to visually describe our country picker component with just a `.country-picker` class.

Similarly, it's fairly easy to create a modular JavaScript piece that contains all the logic required by our component, even before [ES6 modules](http://exploringjs.com/es6/ch_modules.html) land.

But what about HTML? Regardless of how compartmentalised the CSS and JavaScript are, one still needs to include the correct HTML markup required to render the component every time it needs to be rendered.

## Enter Dust.js

[Dust.js](http://www.dustjs.com/) is LinkedIn's JavaScript templating engine, that works both on the server and on the browser. Like most templating languages, it introduces the concept of partials, which are essentialy templates that can be reused by other templates.

```html
<!-- page/contact-us.dust -->
<section class="about-us">
  <p>Lorem ipsum</p>
  <img src="/about-us.jpg">
  {>"partials/contact-modal" title="Contact us"/}
</section>

<!-- partials/contact-modal.dust -->
<div class="contact-modal">
  <p class="contact-modal__title">{title}</p>
  
  <input type="text" name="name">
  {>"partials/country-picker" name="country"/}
  <textarea name="message"></textarea>
  
  <button class="contact-modal__cancel">Cancel</button>
  <button class="contact-modal__confirm">OK</button>
</div>

<!-- partials/country-picker.dust -->
<select class="country-picker" name="{name}">
  <option value="uk">United Kingdom</option>
  <!-- (...) -->
</select>
```

As you'd expect, `contact-us.dust` will display the copy, the image and will include the partial where the modal dialog is defined (`contact-modal.dust`), which in its turn will render some components including another partial where the country picker is defined, and so on.

It seems clear what the next step into making our modal dialog truly independent and reusable should be: instead of a contact modal component, we should really be building a generic modal dialog component, that in addition to a set of immutable elements (e.g. a title bar, close and confirm buttons), is also capable of rendering any arbitrary block of markup it receives, be it a form, an image, a video or anything else.

> We need a Dust partial capable of accepting an arbitrary block of markup as a parameter (...). This is where we hit our first problem with Dust.js.

To make our component capable of rendering anything we throw at it, we need a Dust partial capable of accepting an arbitrary block of markup as a parameter, just like a plain `<div>` in HTML can render whatever you put inside it. This is where we hit our first problem with Dust.js, since the tag used to render a partial must be self-closing, there's no body block.


```html
<!-- Just like we do this -->
<div>
  <ul>
    <li>Whatever we want</li>
    <li>Can go <strong>inside</strong> this div</li>
  </ul>
</div>

<!-- We want to do this (doesn't work) -->
{>"partials/modal-dialog" title="My modal"}
  <p>Some text perhaps</p>
  <img src="/an-image-too.jpg">
{/"partials/modal-dialog"}
```

## Finding a solution

I [asked the question](https://github.com/linkedin/dustjs/issues/715) to the LinkedIn engineers and a few suggestions were discussed. One of them was to use define the component using [helpers](http://www.dustjs.com/guides/dust-helpers/) instead of partials. Helpers are globally-available JavaScript functions that can run arbitrary code on a template, useful for implementing more complex logic operations or other types of processing (e.g. parsing Markdown text). More importantly to our case, and unlike partials, they do support a content block.

```html
<!-- This does work! -->
{@modal-dialog title="My modal"}
  <p>Some text perhaps</p>
  <img src="/an-image-too.jpg">
{/modal-dialog}
```

This solution comes with a massive caveat though, in that helpers are defined as plain JavaScript functions, so any markup required by our modal dialog component would have to be kept as a String in the middle of a function — *yikes!*

At first, I thought the huge maintainability costs of that approach could be mitigated if I managed to still keep the markup in a Dust-flavoured HTML file and could somehow generate the JavaScript functions from it automatically as part of the build process, using something like Gulp or Grunt. This could be an acceptable solution, but still not ideal.

Then I realised there's a much better way of doing it, by creating a helper that calls a partial and makes its own content block available to it as a context variable.

```html
<!-- partials/modal.dust -->
<div class="modal" data-foo="whatever" data-bar="we-need">
  <p class="modal__title">{title}</p>

  {$content}

  <button class="modal__cancel">Cancel</button>
  <button class="modal__confirm">OK</button>
</div>

<!-- partials/contact-modal.dust -->
{@partial name="partials/modal" title="Contact us"}
  <input type="text" name="name">
  {>"partials/country-picker" name="country"/}
  <textarea name="message"></textarea>
{/partial}
```

So, what's happening? Our modal component is still declared in a normal Dust template, but it can now make use of a special context variable called `$content`, where all the markup to be rendered in the modal will reside. 

This is made possible by calling the template using our new `@partial` helper instead of the traditional `{>"partial"/}` self-closing tag. The partial to be called is defined in `$name`, and any other parameters will be made available to the partial (in this case we only used `title`, but it could be anything).

The code for the helper itself is incredibly simple.

```javascript
(function (dust) {
  dust.helpers.partial = function (chunk, context, bodies, params) {
    var newContext = {
      $content: bodies.block
    };

    return chunk.partial(params.$name, context.push(newContext), params);
  };
})(typeof exports !== 'undefined' ? module.exports = require('dustjs-linkedin') : dust);
```

And that's it. We now have a modal dialog component that follows Addy Osmani's principle of [FIRST](https://addyosmani.com/first/): Focused, Independent, Reusable, Small and Testable.<!--tomb-->