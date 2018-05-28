---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/bem-wrappers-and-nesting-and-why-i-love-twitter.html"
layout: post
title:  "BEM, wrappers and nesting (and why I love Twitter)"
tags:
- bem
- html
- twitter
---
I'm a huge fan of the BEM convention for naming elements in a page. It brings concepts of namespacing, inheritance and modularity to the otherwise messy world of CSS. But because BEM is just a naming convention you can adopt and not a technology put in place by a preprocessor or compiler, it has to be enforced by you and your team. If you fail to do it properly, you lose the guarantee that it will solve all the problems it promises to solve.<!--more-->

One thing that always confused me, though, is what happens to that naming convention when there are elements in the markup that serve no real semantic purpose, but that are required for cosmetic reasons. They're often referred to as *wrappers* or *containers* and if you float elements in your layouts, they're probably familiar to you. 

So what happens to them in the BEM world? Should they be independent blocks? Should they be elements of the block they're wrapping? Modifiers? I wasn't sure about the best practices so I asked around on Twitter to see what other people are doing:

<blockquote class="twitter-tweet" lang="en"><p>When using BEM, what do you do naming-wise when you have lots of divs that serve no purpose other than to wrap things for styling purposes?</p>&mdash; Eduardo Bouças (@eduardoboucas) <a href="https://twitter.com/eduardoboucas/status/591332733944598528">April 23, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Folks started sharing their own approaches, finding conflicts with the rules of BEM and discussing options to fix them. Further down the discussion, Mr. Harry Roberts — author of [this reference article](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/) — shared his views and helped me come up with a structure that makes sense and respects the rules:

```html
<!-- 1 -->
<div class="blocky-wrapper">
  <!-- 2 -->
  <div class="blocky">
    <!-- 3 -->
    <div class="blocky__inner">
      <!-- 4 -->
      <h1 class="blocky__title">BEM</h1>
    </div>
    <!-- 3 -->
    <div class="blocky__inner">
      <!-- 5 -->
      <div class="blocky__inner-deeper">
        <!-- 6 -->
        <p class="blocky__copy">BEM is cool.</p>
        <!-- 7 -->
        <p class="blocky__copy blocky__copy--small">And so are you!</p>
      </div>
    </div>
  </div>
</div>
```

And this is how each element fits in the BEM naming convention:

1. I'm just a wrapper. In BEM world, I'm a block with no relation to "blocky"
2. I'm *THE* block, the main player here
3. I'm an inner wrapper. In BEM world, I'm an element and I'm part of "blocky"
4. I'm a proper element, children of "blocky"
5. I'm another wrapper, even deeper in the tree. I serve no real purpose other than grouping things for layout purposes. In BEM world, I'm an element and I'm part of "blocky".
6. I'm a proper element, children of "blocky"
7. I'm a proper element, children of "blocky", and I have a modifier with me. Note that the modifier is not sufficient, I still need my element class.

The first step is to pick your block, a self-contained and independent element. If you need to wrap it in another element, that element needs to be a block itself, never an element or a modifier of your block. You can adopt a naming convention for it like `.block-wrapper` or `.block-container` to make it clear that it relates to your block, but their will be two interdependent elements in the BEM world.
Any wrappers or containers **inside** your block become elements (e.g. `.block__inner`), independently of how deeply nested they are.

And BEM! It works, it's clean and it makes sense, so I'm happy and still a big fan of BEM. Ah, and this is why I love Twitter and the awesome web development community.<!--tomb-->
