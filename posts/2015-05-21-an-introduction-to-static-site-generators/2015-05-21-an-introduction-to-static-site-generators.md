---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/an-introduction-to-static-site-generators.html"
layout: post
title:  "An introduction to static site generators"
tags:
- blog
- jekyll
- static-site-generator
external-url: http://davidwalsh.name/introduction-static-site-generators
external-name: David Walsh blog
external-date: 2015-05-21
---
Static site generators seem to have been becoming more and more popular recently, but they're not one of those ephemeral novelty things that grow in popularity as quickly as they fall into oblivion shortly after. For over a decade, many different projects - [394 of them, to be more precise](https://staticsitegenerators.net/) - have been maintained by lots of varied people in the community and built with a diverse range of programming languages and technologies.<!--more-->

I often read on articles about this subject that "static sites are not for everyone", partially due to the lack of a UI to manage content and to the sometimes unfriendly installation process. But actually I think they can be for everyone, just not for everything.

The aim of this article is to help people of all skill levels understand exactly what static site generators are, acknowledge their advantages, and understand if their limitations are a deal-breaker or if, on the contrary, they can be overcome. With that, you'll hopefully be able to make an informed decision on whether or not a static site can be the solution for your next project.

The concepts described throughout the article are valid for all static site generators, since they all share the same philosophy, although I'll have [Jekyll](http://jekyllrb.com/) in mind when I write purely because that's the one I use and have most experience with. It's quite a mature product, has a huge community and the big bonus of being natively supported by GitHub pages. However, alternatives such as [Docpad](http://docpad.org/), [Hugo](http://gohugo.io/) and [Wintersmith](http://wintersmith.io/) are also widely used and definitely worth investigating.

## How dynamic sites work

Try to imagine for a second that the only way for people to know what's happening in the world is to go to the nearby news kiosk and ask to read the latest news. Yes, I know it's silly but it will all make sense in a bit, please bear with me.

The attendant has no way to know what the latest news are, so he passes the request on to a back room full of telephone operators — picture a big telephone switchboard room in the 1950s. When an operator becomes available, they will take the request and phone a long list of news agencies, ask for the latest news and then write the results as bullet points on a piece of paper.

The operator will then pass his rough notes on to a scribbler who will write the final copy to a nice sheet of paper, arrange them in a certain layout and add a few bits and pieces such as the kiosk branding and contact information. Finally, the attendant takes the finished paper and serves it to the happy customer. The entire process will then be repeated for every person that arrives at the kiosk.

That is essentially how a dynamic website works. When a visitor gets to a website (the kiosk) expecting the latest content (the news), a server-side script (the operators) will query one or multiple databases (news agencies) to get the content, pass the results to a templating engine (the scribble) who will format and arrange everything properly and generate an HTML file (the finished newspaper) for the user to consume.

## How static sites work

The proposition of a static site is to shift the heavy load from the moment visitors request the content to the moment content actually changes. Going back to our news kiosk metaphor, think of a scenario where it's the news agencies who call the kiosk whenever something newsworthy happens.

The kiosk operators and scribbles will then compile, format and style the stories and produce a finished newspaper right away, even though nobody ordered one yet. They will print out a huge number of copies (infinite, actually) and pile them up by the store front.

When customers arrive, there's no need to wait for an operator to become available, place the phone call, pass the results to the scribble and wait for the final product. The newspaper is already there, waiting in a pile, so the customer can be served instantly.

And that is how static site generators work. They take the content, typically stored in flat files rather than databases, apply it against layouts or templates and generate a structure of purely static HTML files that are ready to be delivered to the users.

## Advantages of static

### 1. Speed

Perhaps the most immediately noticeable characteristic of a static site is how fast it is. As mentioned above, there are no database queries to run, no templating and no processing whatsoever on every request.

Web servers are really good at delivering static pages quickly, and the entire site consists of static HTML files that are sitting on the server, waiting to be served, so a request is served back to the user pretty much instantly.

### 2. Version control for content

You can't even imagine working on a project without version control anymore, can you? Having a repository where people can collaboratively work on files, control exactly who does what and rollback changes when something goes wrong is essential in any software project, no matter how small.

But what about the content? That's the keystone of any site and yet it usually sits in a database somewhere else, completely separated from the codebase and its version control system. In a static site, the content is typically stored in flat files and treated as any other component of the codebase. In a blog, for example, that means being able to have the actual posts stored in a GitHub repository and allowing your readers to file an issue when something is wrong or to add a correction with a pull request — how cool is that?

### 3. Security

Platforms like WordPress are used by millions of people around the world, meaning they're common targets for hackers and malicious attacks — no way around it. Wherever there's user input/authentication or multiple processes running code on every request, there's a potential security hole to exploit. To be on top of the situation, site administrators need to keep patching their systems with security updates, constantly playing cat and mouse with attackers, a routine that may be overlooked by less experienced users.

Static sites keep it simple, since there's not much to mess up when there's only a web server serving plain HTML pages.

### 4. Less hassle with the server

Installing and maintaining the infrastructure required to run a dynamic site can be quite challenging, especially when multiple servers are involved or when something needs to be migrated. There's packages, libraries, modules and frameworks with different versions and dependencies, there's different web servers and database engines in different operating systems.

Sure, a static site generator is a software package with its dependencies as well, but that's only relevant at build time, when the site is generated. Ultimately, the end result is a collection of HTML files that can be served anywhere, scaled and migrated as needed regardless of the server-side technologies. As for the site generation process, that can be done from an environment that you control locally and not necessarily on the web server that will run the site — heck, you can build an entire site on your laptop and push the result to the web when it's done.

### 5. Traffic surges

Unexpected traffic peaks on a website can be a problem, especially when it relies intensively on database calls or heavy processing. Introducing caching layers such as Varnish or Memcached surely helps, but that ends up introducing more possible points of failure in the system.

A static site is generally better prepared for those situations, as serving static HTML pages consumes a very small amount of server resources.

## Disadvantages of static (and potential solutions)

### 1. No real-time content

With a static site you lose the ability to have real-time data, such as indication about which stories have been trending for the past hour, or content that dynamically changes for each visitor, like a "recommended articles for you" kind of thing. Static is static and will be the same for everyone.

There's not really a solution for this, I'm afraid. It's the ultimate price to pay for using a static site, so it's important that you ask yourself the question "how real-time does my site need to be?" — if its concept is based around delivering real-time information then perhaps a static site isn't the right choice.

A *dangerous solution*: There's an easy exit for whenever you're faced with the challenge of dynamically updating content on a static site: "I can do it with JavaScript". Doing processing on the client-side and appending the results to the page after it's been served can be the right approach for some cases, but must not be seen as the magic solution that turns your static site into a full dynamic one. It can prevent some users from seeing the injected content, hurt your SEO and introduce other problems, potentially taking away the ease of mind and sense of control that comes with using a static site.

### 2. No user input

Adding user generated content to a static site is a bit of a challenge. Take a commenting system for a blog, for example — how do you process user comments and append them to a post using just plain HTML pages? You don't.

### Solution

You can't get around this limitation per se and start processing data in your static pages, but you can find alternative solutions for individual cases. If you need to create a contact form, there are a lot of third-party services that will handle POST requests and email you the data, or export it to a format of your choice.

A commenting system is a slightly different animal though, since it involves not only processing user data but also appending it to a certain page. Platforms like [Disqus](https://disqus.com/) are often used as a workaround for this and they do the job, but I'm personally not a big fan.

First of all, there's what we discussed in point 1 — Disqus will append the comments to the page with JavaScript after it's been served, so technically the comments don't exist on your site until the JavaScript kicks in. Secondly, with this approach you contradict the premise of keeping the content together and versioned within a repository.

I've written about taking [a different approach at a commenting system for Jekyll](https://eduardoboucas.com/blog/2015/05/11/rethinking-the-commenting-system-for-my-jekyll-site.html), which basically uses a server-side handler to process comments, add them to the repository and push to GitHub, keeping comments together with the rest of the site.

### 3. No admin UI

It's incredibly easy to publish a blog post to WordPress or Medium. It can be done from anywhere, even from a phone, without having to install any additional software. That's not really the case with a static site.

Typically, posts are composed in a text editor and formatted with a language like Markdown or Textile. To publish them, you'd need to regenerate the site (most engines have a watch functionality to detect file changes and regenerate the site automatically) and deploy the files to a server. It's a bit hard to do all that on a phone sitting on the beach, isn't it?

### Solution

There are platforms that provide a web interface for creating, editing and deleting files directly on a GitHub repository, offering a WYSIWYG editor for Markdown to create a friendly composition interface. Examples are [prose](http://prose.io/), a free and open source solution, or the more advanced [CloudCannon](http://cloudcannon.com/), a commercial product that allows users to edit entire sections of a static site and see a live preview of the changes.

There are also mobile apps, available for both [iOS](https://itunes.apple.com/us/app/octopage-blogging-jekyll-markdown/id649843345?mt=8) and [Android](https://play.google.com/store/apps/details?id=org.faudroids.mrhyde), that are a viable option for people interested in writing and publishing content on the move. The apps connect with GitHub and the changes are instantly pushed to the repository.

Another option is to set up a service that allows users to [post to a static blog by email](https://github.com/masukomi/JekyllMail), which can be a viable solution for those that need to constantly write on the move. It works by listening for emails on a certain address and picking up the post meta data from the subject line, the images from the attachments and the post body from the message itself.

## Conclusions

Switching to a static site can potentially save you time and money, as it requires less maintenance and less server resources. They're reliable, scalable and can handle high volumes of traffic quite well.

In 2012, Obama's presidential campaign [raised $250M through a Jekyll website](http://kylerush.net/blog/meet-the-obama-campaigns-250-million-fundraising-platform/). In 2013, Healthcare.gov [switched to a CMS-free approach](https://developmentseed.org/blog/new-healthcare-gov-is-open-and-cms-free/) using Jekyll as well. Static sites are powering huge projects and are definitely not limited to blogging. There's also a strong open source community maintaining and pushing forward a wide range of engines with different flavours and features.

However, a static site is not some magical solution that will solve all the problems — they're perfect for some cases, but terrible for others. It's vital to understand how they work and what they can do in order to assess, on a per-project basis, whether or not they're the right tool for the job.<!--tomb-->