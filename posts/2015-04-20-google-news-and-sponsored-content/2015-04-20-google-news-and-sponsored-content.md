---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/google-news-and-sponsored-content.html"
layout: post
title:  "Google News and sponsored content"
tags:
- blog
- google-news
- robotstxt
- seo
---
If your website — or a website you're working on — is on Google News, that's really good news (ha!). It allows your content to be indexed by Google's news platform and be shown to millions of readers around the globe interested in stories on a certain subject or category.

Getting a site into the platform is supposedly not that difficult — a good read through [this page](https://support.google.com/news/publisher/answer/40787?hl=en) should point you to the technical and editorial requirements you need to put in place before you [submit your site](https://partnerdash.google.com/partnerdash/d/news#p:id=pfehome) to the platform. Within those pages, there's a very important piece of information: **«Stick to the news--we mean it!»**.<!--more-->

>> Google News is not a marketing service. We don't want to send users to sites created primarily for promoting a product or organization, or to sites that engage in commerce journalism. (...) Otherwise, if we find non-news content mixed with news content, we may exclude your entire publication from Google News.

It's a common practice for news sites and blogs to have sponsored articles, often visually camouflaged as editorial content. If you're doing this and your website is on Google News, you might be breaching their guidelines and that can get your content removed from the platform.

## Blocking Google News robot

You need to flag all your sponsored/advertorial content appropriately to web crawlers — more specifically, Google News' robot — telling them not to index your page. You have two options here:

- **robots.txt**: You can add a rule to your `robots.txt` excluding all the pages within a certain directory from being indexed by Google News. This works best if all your advertorial pages are within the same directory.

```text
User-Agent: Googlebot-News
Disallow: /some-directory
```

- **meta tag**: You can add a meta tag to the pages you wish to exclude from Google News. With this option is easier to define which pages should be excluded.

```html
<meta name="Googlebot-News" content="noindex, nofollow">
```

## Or block all the robots

If you prefer to hide your page from all Google robots, including the one used by Google Web Search, use one of the options above and replace `Googlebot-News` with just `Googlebot`.<!--tomb-->