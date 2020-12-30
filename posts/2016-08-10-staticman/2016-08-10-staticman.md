---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/staticman.html"
layout: post
title:  "Adding user-generated content to a static site using Staticman"
tags:
- blog
- jekyll
- staticman
---
I've been really interested in finding the ideal solution to add user-generated content, such as comments on a blog post, to a static site. My incursion started with a [PHP middleman application](/blog/2014/12/14/building-a-bespoke-commenting-system-for-a-static-site.html) that would interact with the now defunct Poole platform. 

A few months later, a [talk by Tom Preston-Werner](https://www.youtube.com/watch?v=BMve1OCKj6M) made me rethink the whole concept, and I ended up building [a bespoke commenting system](/blog/2015/05/11/rethinking-the-commenting-system-for-my-jekyll-site.html). After several iterations, that project eventually evolved into a public, open-source platform called [Staticman](https://staticman.net).<!--more-->

In a nutshell, I love the fact that my entire site lives in a GitHub repository and can go into a ZIP file with just a click, content included. I wanted to allow users to comment on my posts, but refused to accept the fact that introducing user-generated content would mean breaking that premise above.

Commenting platforms like Disqus are great, but the content is no longer under your control, not to mention the fact that it's difficult to fully customise visually so it blends in with your existing design.

With Staticman, you can have user comments stored as data files in the repository, along with the rest of your content. When users submit a new entry, Staticman will process, validate and push it to your GitHub repository, either directly to the branch where your site lives or as a pull request for your approval.

Instead of writing an essay, I figured the video below would be a good way of showing the process of integrating the platform with a Jekyll site. It's called [Popcorn](http://popcorn.staticman.net) and it's running on GitHub Pages.

{% include helpers/video-embed.html url:"https://player.vimeo.com/video/178244050" width:"640" height:"360" %}

The example shows how to use the hosted version available on [staticman.net](https://staticman.net), but you can choose to run your own instance as the entire project is fully open source and available [on GitHub](https://github.com/eduardoboucas/staticman).

If you need help or get stuck, feel free to drop any questions in the comments box below — which is powered by Staticman, of course!<!--tomb-->
