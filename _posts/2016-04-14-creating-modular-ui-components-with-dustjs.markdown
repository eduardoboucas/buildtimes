---
layout: post
title:  "Creating modular UI components with Dust.js"
categories: blog
tags: test
---
One of the most important changes in my mindset, as an engineer who builds for the web, happened when I started to look at websites as a group of components, rather than a group of pages. The principle is not new, and articles like *[Don’t Build Pages, Build Modules](http://www.ebaytechblog.com/2014/10/02/dont-build-pages-build-modules/)* from the eBay engineering blog or the mandatory piece on [atomic design by Brad Frost](http://bradfrost.com/blog/post/atomic-web-design/) provide a far better explanation than I could ever attempt to do — in short, building monolithic pages that are not reusable in different contexts isn't scalable, sustainable or maintainable in the long term. 

Imagine, as an example, a *About us* page that contains some copy, an image and a modal dialog, triggered from a *Contact* link, with three fields: name, country and message. It's a simple layout, so one could be tempted to house everything (markup, styling and any JavaScript logic) under a *About us* block and call it a day. 

But what happens if you also need to use the modal dialog in the homepage, perhaps with a different colour scheme? And what if you also want to use just the country picker somewhere in the shopping cart process? Will you summon a "about us country picker" even though you're in a completely different context? Will you simply duplicate the code and live with the burden of maintaining it in two different places?

## Thinking components

A more reasonable approach is to create a *country picker* component, self-contained and independent of its context, which will then be used in a *contact form* component (along with several other components), which will then be used in a larger *contact us* component and so on. You see where I'm going with this.

Ideally, a developer should be able to create a consistent and centrally-managed instance of any of these components, and include it with ease anywhere on the project. This is a difficult problem to take when considering all the languages involved in a web project. In CSS, it's possible (albeit with huge limitations until we have [CSS containment](https://justmarkup.com/log/2016/04/css-containment/)) to visually describe our country picker component with just a `.country-picker` class.

Similarly, it's fairly easy to create a modular JavaScript piece that contains all the logic required by our component, even more so when [ES6 modules](http://exploringjs.com/es6/ch_modules.html) land.

But what about HTML? Regardless of how compartmentalised our CSS and JavaScript are, one still needs to include the correct HTML markup required to render the component every time it needs to be rendered.

## Enter Dust.js

[Dust.js](http://www.dustjs.com/) is LinkedIn's JavaScript templating engine, that works both on the server and on the browser. Just like most templating languages, it introduces the concept of partials, templates that can be reused by other templates.

{% highlight html %}
<!-- page/contact-us.dust -->
<section class="about-us">
  <p>Lorem ipsum</p>
  <img src="/about-us.jpg">
  {>"partials/contact-modal" action="/formhandler.html"/}
</section>

<!-- partials/contact-modal.dust -->
<div class="contact-modal">
  <form method="POST" action="{action}">
    <input type="text" name="name">
  
    {>"partials/country-picker" name="country"/}
  
    <textarea name="message"></textarea>
    <input type="submit" value="Submit">
  </form>
</div>

<!-- partials/country-picker.dust -->
<select class="country-picker" name="{name}">
  <option value="uk">United Kingdom</option>
  <!-- (...) -->
</select>
{% endhighlight %}

As you'd expect, `contact-us.dust` will display the copy, the image and will include the partial where the modal dialog is defined (`contact-modal.dust`), which in its turn will render some components including another partial where the country picker is defined, and so on.

It seems clear what the next step into making our modal dialog truly independent and reusable should be: instead of a contact modal component, we should really be building a generic modal dialog component, that in addition to a set of immutable elements (e.g. a title bar, close and confirm buttons), is also capable of rendering any arbitrary block of markup it receives, be it a form, an image, a video or anything else.

> We need a Dust partial capable of accepting an arbitrary block of markup as a parameter (...). This is where we hit our first problem with Dust.js.

To make our component capable of rendering anything we throw at it, we need a Dust partial capable of accepting an arbitrary block of markup as a parameter, just like a plain `<div>` in HTML can render whatever you put inside it. This is where we hit our first problem with Dust.js, since the tag used to render a partial must be self-closing, there's no body block.


{% highlight html %}
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
{% endhighlight %}

## Finding a solution

I [asked the question](https://github.com/linkedin/dustjs/issues/715) to the LinkedIn engineers and a few suggestions were discussed. One of them was to use [helpers](http://www.dustjs.com/guides/dust-helpers/), a feature of Dust that allows a globally-available JavaScript function to run arbitrary code on a template, useful for implementing more complex logic tests or other types of processing (e.g. parsing Markdown text). The reason this was suggested was because, unlike partials, helpers do support a content block.

{% highlight html %}
<!-- This does work! -->
{@modal-dialog title="My modal"}
  <p>Some text perhaps</p>
  <img src="/an-image-too.jpg">
{/modal-dialog}
{% endhighlight %}

The massive caveat of this solution is that helpers are defined as plain JavaScript functions, so any markup required by our modal dialog component would have to be kept as a String in the middle of a function — *yikes!*. 

At first, I thought the huge maintainability costs of that approach could be mitigated if I managed to still keep the markup in a Dust-flavoured HTML file and somehow generated the JavaScript functions from it automatically as a build process, using something like Gulp or Grunt. This sounded like an acceptable solution to me.

But then I realised there's a much better way to do it, by creating a helper that makes use of its content block in a creative way by passing it to a partial as an inline parameter.


<!--tomb-->
