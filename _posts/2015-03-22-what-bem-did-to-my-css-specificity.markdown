---
layout: post
title:  "What BEM did to my CSS specificity"
date:   2015-03-22 00:25:00
categories: blog
tags: css specificity bem
---
I have recently refactored the entire front-end structure of my website ([a bit by accident, actually](https://twitter.com/eduardoboucas/status/573609357914603520)) and using the [BEM naming convention](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/) on my DOM tree was one of the things I finally got to implement.<!--more-->
In a nutshell, BEM brings concepts of object-oriented programming to your HTML and CSS. 

As Philip Walton explains in his brilliant article *[Side effects in CSS](http://philipwalton.com/articles/side-effects-in-css/)*, BEM helps you avoid a problem that is known to all front-end developers: sometimes your CSS ends up affecting elements that it wasn't supposed to. That happens because of the cascading nature of CSS and the fact that all the class names belong to a global namespace.

With BEM, every HTML tag has to have a class and that's how it will be styled, as stylesheets can only contain class selectors. Those classes follow a very strict naming convention and can be of one of three types:

- **Block**: A self-sufficient and independent entity. A building block of the application.
- **Element:** A part of a block. An element depends on the block it is part of and doesn't make sense without it or in any other context.
- **Modifier:** Represents variations of state of the block.

This is how the DOM structure of my blog posts looked like before BEM:

{% highlight html linenos %}
<article class="post">
	<header>
		<h1>{{ post.title }}</h1>
		<p class="post-meta"><!-- (...) --></p>
	</header>
	<div class="excerpt">
		<p><a href="{{ post.link }}">Read full post</a></p>
	</div>
</article>
{% endhighlight %}

And here's how it looks after BEM:

{% highlight html linenos %}
<article class="post">
	<header class="post__header">
		<h1 class="post__title">{{ post.title }}</h1>
		<p class="post__meta"><!-- (...) --></p>
	</header>
	<div class="post__excerpt">
		<p><a href="{{ post.link }}">Read full post</a></p>
	</div>
</article>
{% endhighlight %}

Right off the bat, it makes the DOM elements more structured and tightly coupled. But what about the CSS? If every element in the page can be targeted by a unique and unambiguous class name, then in theory I should be able to reduce the amount of nesting in my Sass code and see a lighter, more compact and less specific resulting CSS.

To measure that I used Jonas Ohlsson's [CSS Specificity Graph Generator](http://jonassebastianohlsson.com/specificity-graph/) to see how the specificity of my shiny new BEM-powered stylesheet looked like when compared to the previous version using the plain old habit of naming things randomly. Here's how it looks:

{% include image width="600" name="graph-before.png" caption="CSS specificity graph before BEM" %}

{% include image width="600" name="graph-after.png" caption="CSS specificity graph after BEM" %}

(*«Spikes are bad, and the general trend should be towards higher specificity later in the stylesheet.»* — [More info](http://csswizardry.com/2014/10/the-specificity-graph/))

Not bad, I guess. As Philip points out in his article, turning a blind eye to some of BEM's rules and therefore dilluting it with your own rules can be dangerous, but I'm knowingly doing that and on every instance I have a solid reason. My website is powered by Jekyll and it takes care of converting Markdown into HTML, so Jekyll gets to create a lot of the markup for me. The result? I can't tell Jekyll to attach BEM-friendly classes to the elements it creates. In that case, I sometimes have to style things by element type and not class name.

My second exception happens because I'm setting global rules for headings, lists and paragraphs because it just doesn't seem practical to me to be adding classes to all instances of those elements. Things like font families, line heights and colours will be pretty much global so I shouldn't have a problem there.

I've been using BEM in production on all my projects and I don't look back.<!--tomb-->