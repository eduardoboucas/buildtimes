---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/is-linkedin-ignoring-your-open-graph-meta-tags.html"
layout: post
title: "Is LinkedIn ignoring your open graph meta tags?"
tags:
  - blog
  - linkedin
  - opengraph
  - social
  - butler
  - html
  - javascript
  - php
  - ajax
---

So you're trying to share your website on LinkedIn because you're a professional and all, but it decides to completely ignore your open graph meta tags? Just read along.<!--more-->

With the relevance social media has these days, any web developer will include [open graph meta tags](http://ogp.me/) on every website build without even thinking. These tags turn any web page into shareable "graph" object, consumed by social networks like Facebook or LinkedIn, giving the developers some level of customisation over how the page is displayed when published on those platforms.

Some of the most used tags are the `og:title`, `og:description` and `og:image`, which allow you to specify what's the title, the description that accompanies the URL and the thumbnail image of the post, respectively. David Walsh has a [great article](http://davidwalsh.name/facebook-meta-tags) about this, listing the most common tags and their syntax.

When I launched my blog, I included these tags because I knew I would be sharing my posts on social networks. I used Facebook's [open graph debugger tool](https://developers.facebook.com/tools/debug/) to make sure my tags were being picked up correctly and the thumbnail image was looking alright — the tool actually gives you a preview of how your link will look in a post when shared in the network.

Everything was looking great on Facebook, but LinkedIn was not picking up any information when I tried to share a link to my blog. Here's how it looked:

{% include helpers/image.html name:"linkedin-before.png" caption:"Sharing my blog on LinkedIn" %}

I found this odd, because they clearly state in [their documentation](https://developer.linkedin.com/documents/setting-display-tags-shares) that _LinkedIn supports Open Graph tags_. I thought that maybe there was something wrong with my tags and that Facebook was just being merciful, so I went on [Open Graph Check](http://opengraphcheck.com/result.php?url=http%3A%2F%2Feduardoboucas.com%2Fblog#.VIDbvJOsUmw) to get some answers. Nope, all good here.

After doing some research on the subject, I found that [many people have encountered this issue](https://developer.linkedin.com/forum/attempts-share-url-linkedin-ignore-open-graph-tags) where LinkedIn simply refused to read their meta tags. Some people suggested that LinkedIn is a bit strict when parsing the HTML code, so I used the [W3C Validator](http://validator.w3.org/) to see if there was something that could be causing the issue. Nothing.

Because I got really frustrated by this, as I really wanted to post my articles on LinkedIn, and especially because I'm an upright citizen concerned with my fellow colleagues, I decided to build a service to work around this limitation. I present you the [Open Graph Butler](http://butler.eduardoboucas.com)!

{% include helpers/image.html name:"butler.png" caption:"Screenshot of the Open Graph Butler" %}

Here's the idea: you log in with your LinkedIn account, type or paste the URL that you want to share, and the butler will parse your site, look for the open graph meta tags and use [LinkedIn's API](https://developer.linkedin.com/javascript) to form a request and post on your behalf. By using the API, you don't rely on their system to parse the information for you, as it allows you to specify exactly what goes in the title, description, image, etc.

{% include helpers/image.html name:"linkedin-after.png" caption:"A LinkedIn post created by the butler" %}

Point your browsers to [butler.eduardoboucas.com](http://butler.eduardoboucas.com) to use the butler. And please be nice to him!<!--tomb-->
