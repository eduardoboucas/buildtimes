---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/how-i-used-jekyll-on-my-backbonejs-website.html"
layout: post
title:  "How I used Jekyll on my Backbone.js website"
tags:
- blog
- eduardoboucas.com
- jekyll
- backbonejs
---
Several months after [creating my website](/blog/2014/10/09/the-story-behind-my-website.html), I decided that I needed some form of content management system, especially since I was planning on throwing my blog into the mix. Content was mixed with layout and the mobile version wasn't great (it was a "m.dot" solution with different templates and content duplication — _YIKES!_).<!--more-->

I had been working with [Symphony](http://www.getsymphony.com/) for a while with really nice results, so that was my first choice. It's a PHP-based CMS with XSLT templates running on a MySQL database. It's open-source, has a nice community with people writing plugins for pretty much everything and the back-end interface is clean and effective. However, after doing some tests I realised that it wouldn't work for this case. Again, due to the very peculiar structure of this website, I had some exotic requirements.

## Problem: the structure and Backbone.js
The skeleton of the website consisted of Backbone.js grabbing HTML files and displaying them along with the videos. The less I could change in this, the less chaotic refactoring would have to take place. Sure, I could have Backbone fetching PHP pages, but what about the content? Was a relational database the best architecture to hold this type of content? 

It's a four-page website with content that is updated maybe once every two weeks — is it worth the overhead of having Backbone requesting a PHP page that would query the MySQL database, return a XML file that would be parsed with XSLT to finally generate an HTML file? 
There had to be a better way.

## Problem: the blog

I also wanted to add a blog to the site, where I could write about what I do on the web. On the one hand, I wanted it to be a proper standalone blog, SEO friendly, where people can go without having to go through the whole video choreography and where posts can be linked without the URL routing carried on by Backbone. 

On the other hand, would it make sense to have a website and a blog without any interaction between the two? I wanted to integrate the blog in the site, but how to keep the best of both worlds?

## Solution: Jekyll to the rescue

Everyone was talking about [Jekyll](http://jekyllrb.com/) and I was really curious about it. What is Jekyll, anyways? 

>> Jekyll is a simple, blog-aware, static site generator. It takes a template directory containing raw text files in various formats, runs it through Markdown (or Textile) and Liquid converters, and spits out a complete, ready-to-publish static website suitable for serving with your favorite web server.
>>
>>(from [jekyllrb.com](http://jekyllrb.com/docs/home/))

So basically I could write the content in Markdown (yay!), finally separating it from the content, and automatically generate plain HTML files which Backbone can deal with right away. But how would I structure the content?

Jekyll is _blog-aware_ in the sense that it looks for text files in a specific directory and converts them into posts. This was perfect for the blog, but there are other sections on the site that don't exactly fit in that structure. In addition to posts, Jekyll allows you to create fully customisable static pages, capable of adopting one of many layouts that you can create, based on a series of parameters defined at the beginning of the file, in a structure that serves as the file header — the [front matter](http://jekyllrb.com/docs/frontmatter/).

How does this work, exactly? Well, let me give you an example. Let's say we want two pages on your website, _About me_ and _Contact me_, with roughly the same structure: a header with the page title, a hero image, the copy and a footer.
We start by creating the page layout.

```html
---
layout: pageSimple
---
<!-- _layouts/pageSimple.html -->
<html>
  <head>
    // Your meta tags
  </head>
  <body>
    <h1>{{ "{%" }} page.title %}</h1>
    <img class="hero" src="{{ "{%" }} page.hero %}"/>
    <article>
  	  {{ "{%" }} page.content %}
    </article>
  </body>
</html>
```

And then the text files with our content.

```yaml
# aboutme.md
---
layout: pageSimple
title: About me
hero: images/aboutme.png
---
I'm a lonely boy
I'm a lonely boy
Oh, oh-oh I got a love that keeps me waiting
```

```yaml
# contactme.md
---
layout: pageSimple
title: Contact me
hero: images/contactme.png
---
I don't have an email account, my phone is broken and I don't like letters. Sorry!
```

Once you fire up Jekyll, it will find **aboutme.md** and **contactme.md** in the root of your site and, by examining the front matter, it will know that those files should become pages with the layout **pageSimple**. It will look for a file called **pageSimple.html** inside **_layouts/** and replace the variables with the appropriate values that come from the Markdown files and finally create **aboutme.html** and **contactme.html** with the result. Pretty cool, huh?

We could go a step further and separate our code into reusable modules. For example, it would make sense to create a header and footer files and call in the layouts we want. Using `{{ "{%" }} include header.html %}` will tell Jekyll to look for **header.html** inside **_includes/**. I've used this to, among other things, include logic for Google Analytics and Google Tag Manager.

In my case, I have structured the site using posts for the [Blog](http://eduardoboucas.com/blog) section, as its the obvious solution for that type of content, and pages for [About](http://eduardoboucas.com/#/about) and [Find me](http://eduardoboucas.com/#/findme) since these represent more static content.

[Portfolio](http://eduardoboucas.com/#/portfolio) was a bit different because I wanted to be able to add projects to my portfolio just like blog posts, but I wanted to keep them completely separate from the blog structure. I used [collections](http://jekyllrb.com/docs/collections/), which is basically a Jekyll feature that allows us to create our own document type. The documentation warns us that this feature is unstable and prone to change, but what the hell. Let's live life on the edge, right?

All I had to do was add this to my configuration file (`_config.yml`):

```yaml
collections:
  - projects
```

And each portfolio project is represented by a Markdown file like this:

```yaml
---
collection: projects
order: 1
title: "Monocle"
link: "http://monocle.com/"
images: 
  - screenshots/monocle/1.jpg
  - screenshots/monocle/2.jpg
  - screenshots/monocle/3.jpg
---
At Monocle I was responsible for maintaining the website, implementing new features, working on the integration between the website and M24 — Monocle's online radio station — as well as designing and building a series of internal tools. Front-end typically involves HTML5, CSS3 and JavaScript (with jQuery and Ajax always around) whilst the back-end part is mainly PHP, XSLT, MySQL, MongoDB and the constant integration with the CMS.
```

The front matter is pretty self-explanatory. Each project has a set of screenshots defined in the _images_ field. Additionally, I wanted to have the flexibility to order projects in the page exactly how I wanted and not just by date, so I'm using the _order_ field to do that:

```text
  {{ "{%" }} assign projects = site.projects | sort: 'order' %}
  {{ "{%" }} for project in projects %}
  // Display the project
  {{ "{%" }} endfor %}
``` 

## Creating the blog

For the blog I decided to have two different entry pages: one would be a regular route on Backbone just like the other pages, and the other would be a standalone page that would live on its own. That gives me the best of both worlds, allowing users to read the blog on the main site but also giving me a chance to link to articles on their own.

To do this, I created a main page for the blog posts (**_includes/blog/posts.html**) and two different pages: **blog.html** would be fetched by Backbone.js to be part of the main site and **blog/index.html** would be the homepage of the standalone version of the blog. The pages have their own distinct structures but both of them include the posts page to get the content.

## The icing on the cake: it's all on GitHub!

The coolest part about this setup is that there's no database to setup, maintain and backup, it's all versioned and available on GitHub. Yeah, my blog posts are on my repo, how cool is that? 

To top it up, [GitHub pages](https://pages.github.com/) are actually powered by Jekyll, so I'm actually hosting my entire website on GitHub for free. To do that, I created a user page on GitHub and pointed my domain to GitHub's IP addresses. The process is explained in detail [here](http://jekyllrb.com/docs/github-pages/) and [here](https://help.github.com/articles/setting-up-a-custom-domain-with-github-pages/).
It's like having a fancy continuous development setup without the need to configure anything: whatever you push to master goes live.

## The verdict

Jekyll allowed me to have the perfect data structure for this project, the end result is blazing fast since it generates pure and static HTML files and it offers a nice and simple development environment with its built-in web server (which I forgot to mention before, but you also have to do your own research, don't you?). I also love the fact that I don't have to handle the hassle of hosting and maintaining a relational database and just have my content as plain text files hosted on my GitHub repo.

It's certainly not the right tool for any job and you'll probably have a hard time convincing someone that you want to get rid of their database to use text files instead. But if it's [good enough for Mr. Obama](http://kylerush.net/blog/meet-the-obama-campaigns-250-million-fundraising-platform/), it's good enough for me. <!--tomb-->