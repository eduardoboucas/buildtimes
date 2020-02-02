---
layout: post
title:  "What is a headless CMS?"
tags:
- blog
- headless
- cms
- monolith
---
I vividly remember the first time I’ve used a CMS. It was the early 2000s and I came across a tool called PHP-Nuke, a content management system that offered an administration interface from where content could be easily created and modified, requiring no technical knowledge whatsoever from the user.<!--more-->

This was a huge departure from the reality I knew back then, which involved manually editing HTML files on a text editor and pushing them to a server using FTP each and every time I wanted to make the slightest update to a piece of content. Going from that to instant updates with a few clicks on a graphical interface was a game changer.

{% include helpers/image.html name:"phpnuke.png" caption:"Fig 1. Screenshot of the PHP-Nuke admin panel" %}

Almost two decades – or several Internet-centuries – later, the landscape of content management systems has changed dramatically, as you can easily guess by looking at the screenshot above. But what about the underlying principles and architecture behind these systems? Are products like WordPress or Drupal so radically different from the likes of PHP-Nuke?

## The monolith

In my opinion, calling WordPress a content management system is a big understatement. Yes, it offers users an interface from where they can manage and publish content, but it also manages users, images, fonts, colors, client-side JavaScript, etc.

You can look at WordPress (and similar products) as large and opaque assembly lines – content goes in via user input on a graphical administration panel, and out comes fully-formatted and styled HTML pages, ready to be consumed by a web browser. What happens in between, and especially what’s running under the hood, is not entirely under your control. This is typically called the monolith CMS.

{% include helpers/image.html name:"monolith.png" caption:"Fig 2. Architecture of a monolith CMS" frame:false %}

The monolith architecture consists of a single system being in charge of storing and managing data, as well as presentation, by tightly coupling the templating layer responsible for printing data as web pages. This raises some questions around the principle of [separation of concerns](https://en.wikipedia.org/wiki/Separation_of_concerns) and poses a few particularly relevant problems.

### Commitment to a tech stack

Ideally, developers should be able to pick the best tools for each project they start, as each of them will have unique characteristics that may deem certain programming languages, frameworks or environments more appropriate than others. Unfortunately, a monolith CMS severely limits your options on that front, as picking a particular product means a forced marriage with the entire stack it runs on – for example, a PHP-based monolith CMS won’t just plug into a Node.js templating engine or a static site generator. 

Remember, a CMS should be working quietly behind the scenes to help you manage your content, not dictate what technologies you can and cannot use right out of the gate.

### Not everything is the web

We said earlier how a monolith CMS is a big black box that receives content and creates web pages, which begs an important question – what if you’re not building (just) for the web? How can these systems communicate with platforms that don’t use HTML, like a native mobile or a smart TV application?

The assumption that all content produced on a CMS is to be delivered on a web page is flawed, given the plethora of devices and mediums we all use on a daily basis.

### The web has changed

Even if you’re working solely with the web, you’re building for a challenging platform that is not what it used to be. The paradigm in which a server prints data to an HTML page, massaging it down to a point where it’s completely ready for consumption by end users, made perfect sense a decade ago, when most of the existing monolith CMS solutions were created.

Today, however, the reality is fundamentally different. Modern web applications are running increasingly powerful and complex scripts on people’s devices, often involving a complex orchestration between server-side and client-side logic.

Having a server-side CMS that spits out fully-formatted HTML pages is not the easiest and most efficient way of feeding data into platforms like React, Vue or Angular, which make the data flow of modern web applications easier to build and reason about. 

## Headless CMS

A headless CMS tackles the problems above by separating logic from presentation, data from UI, admin panels from client-facing templates. It does so by introducing an API layer that makes content available in its raw form, with no presentational elements, in a format that is agnostic of programming language or runtime environment.

{% include helpers/image.html name:"headless.png" caption:"Fig 3. Architecture of a headless CMS" frame:false %}

The diagrams above outline how a headless CMS differs from a traditional monolith architecture. In figure 2, the communication between the core application and the templating engine happens via an in-memory call, meaning both entities must operate on the same machine. In contrast, the headless approach in figure 3 shows an API layer that exposes raw data that any consumer can read using HTTP calls, which are ubiquitous. For example, the diagram in figure 3 shows a scenario where a native app and a web server with its own templating engine both consume content from the CMS over HTTP calls.

Decoupling data from presentation means freeing it from technological constraints, allowing the same piece of content to be used and reused by multiple consumers, regardless of the type of device or tech stack involved. This is the philosophy behind the principle of [Create Once, Publish Everywhere (COPE)](https://www.programmableweb.com/news/cope-create-once-publish-everywhere/2009/10/13).

### How it works

The API layer we saw earlier is where all the magic happens. In a monolith CMS, pulling a list of 10 articles into a template would involve calling a function that was exposed by another part of the application, like `getArticles(10)`. If that template was using a headless CMS, the data would be living somewhere else, so instead of an in-memory function call you’d use an HTTP request – e.g. `GET https://my-api.com/articles?limit=10`. 

The response to this HTTP request would be in a language-agnostic format like JSON or XML, so the same exact response could be handled by virtually any type of system.

### Key benefits

- **Flexibility**: Decoupling data from presentation and exposing content in a raw and universal format allows for easy integrations with different platforms and devices.
- **Robustness**: Because a monolith CMS consists of a single entity managing all components of a system, a fatal error may bring everything to a halt. Building the presentation layer around remote HTTP calls makes it fault-tolerant by design, allowing applications to gracefully handle errors that may have occurred in the back-end.
- **Security**: Having the administration panel and the client-facing pages under two separate entities makes it easier to restrict access to certain parts of your system, like making the administration panel inaccessible outside a private VPN.


## Wrapping up

Headless is a more elegant, scalable and maintainable approach to content management systems. Whether you’re building just for the web or for every platform out there, and regardless of what technology you run under the hood, a headless CMS can help you build for the future.

To get started, you can find a list of existing headless CMS projects at [https://headlesscms.org/](https://headlesscms.org/) and find out which one is most suited to your needs.<!--tomb-->
