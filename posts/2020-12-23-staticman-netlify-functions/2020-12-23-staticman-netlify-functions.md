---
layout: post
title:  "Running Staticman on Netlify Functions"
categories: blog
tags:
- blog
- staticman
- open-source
- netlify
---
In 2016, I started working on a tool to fill the gap in user-generated content on (what is now called) the Jamstack: [Staticman](https://staticman.net). Since then, the entire ecosystem has grown by leaps and bounds, offering developers a set of tools and primitives that were mostly unreachable just four years ago.<!--more-->

In this post, we'll use one of those primitives – serverless functions – to deploy Staticman without having to get anywhere near infrastructure configuration. In particular, I'll show you how to deploy an [Eleventy](https://www.11ty.dev/) blog with Staticman-powered comments with just a few clicks.

## TL;DR

Head to the [Eleventy blog template](https://github.com/eduardoboucas/eleventy-blog-staticman) and click [Deploy to Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/eduardoboucas/eleventy-blog-staticman).

## A brief history

When Staticman was first released, it consisted of a Node application with an included web server. There was a free public instance available for anyone to use, but that wasn't a sustainable proposition for an open-source project (because money), so eventually people had to venture into deploying the application themselves.

As much as services like [Heroku](https://www.heroku.com/) absorb much of the complexity involved in this, it's still by no means a straightforward process, especially for less technical folks.

With serverless computing power getting more accessible and more intrinsically connected to the Jamstack paradigm, it makes perfect sense to rethink the way Staticman is deployed. Rather than relying on a centralised, multi-tenant service, we can wrap Staticman as a serverless function that lives alongside – and gets deployed with – our site.

### Prior art

Before anything else, I want to point out that I was not the first one to explore this approach. Folks like [Prabashwara Seneviratne](https://github.com/bashlk/staticman-netlify-function) and [Jordan Patterson](https://www.jpatters.com/2020/12/static-comments-with-serverless-staticman-1/) have done a tremendous job at creating content and tooling around the idea of a serverless Staticman.

I've simply restructured the application to make this use case more convenient and performant.

## Going serverless

While it's still possible to run Staticman as a regular Node server, the core application has been isolated and is now published as [a separate module](https://www.npmjs.com/package/@staticman/core), which can be easily included as part of a serverless function without the unnecessary weight of the unnecessary server-related logic.

Staticman was initially built as a multi-tenant service, where one instance could serve an unknown set of repositories. The ability to run one Staticman instance for each site allows for some interesting optimisations.

For one, we can store site-specific configurations within the application, for in-memory access – this saves us a round-trip to the Git provider to retrieve the configuration data.

Secondly, we avoid all the complexity around asymmetric key encryption, which was the only way to guarantee a secure communication between the server and any number of guest sites. Now, any sensitive information can be stored in environment variables that will be exposed to the serverless function.

## See it in action

I've forked the [Base Blog](https://github.com/11ty/eleventy-base-blog) starter for the [Eleventy](https://11ty.dev) static site generator and added a commenting system powered by Staticman.

{% include helpers/image.html name:"blog.png" caption:"Eleventy blog with comments" frame:false %}

You can deploy it to a free [Netlify](https://netlify.com) site with just a few clicks, with all the Staticman configuration being taken care of automatically for you. Here's how:

1. Go to [https://github.com/eduardoboucas/eleventy-blog-staticman](https://github.com/eduardoboucas/eleventy-blog-staticman) and click on [Deploy to Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/eduardoboucas/eleventy-blog-staticman) 

1. You'll be redirected to Netlify, where you can connect your GitHub account if you haven't done so before

1. Fill in the following details:

    - **GitHub access token**: A GitHub Personal Access Token used by Staticman to push new comments to your repository on your behalf. See [this guide](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token) on how to create one.

    - **Repository name**: The name of your GitHub repository, including your username or organization (e.g. `eduardoboucas/eleventy-blog-staticman`).

    - **reCAPTCHA site key** and **reCAPTCHA site secret**: If you want to use [reCAPTCHA](https://www.google.com/recaptcha/about/) to protect your form against spam attacks, you should insert your site key and secret, which you can obtain [here](https://www.google.com/recaptcha/admin). If you don't want to use reCAPTCHA, you can leave these blank.

1. Done! 🎉

{% include helpers/image.html name:"netlify-setup.png" caption:"Netlify setup screen" frame:false %}

Every time you submit a comment, a new file will be pushed to the repository, which will trigger a Netlify build with the updated content.

## Configuration

You can tweak the Staticman instance by changing the [configuration object](https://github.com/eduardoboucas/eleventy-blog-staticman/blob/master/functions/staticman.js#L19-L33).

For example, if you'd like new entries to generate a pull request for your approval, as opposed to a direct commit to your main branch, you can set `moderation: true`. This is also where you'd configure which fields are allowed and whether some of them are required.

To see all possible configuration options, check the [Staticman documentation](https://github.com/eduardoboucas/eleventy-blog-staticman/blob/master/functions/staticman.js#L19-L33).

## Parting words

I sincerely hope that this simplified setup flow lowers the barrier of entry for Staticman, allowing many more developers to build amazing projects with pure Git-based user-generated content (like Dave's [Splashed](https://daviddarnes.github.io/splashed/liked/)).

The features described in this post still have fresh paint – if you run into any issues, or if you have any feedback whatsoever, [let me know](https://twitter.com/eduardoboucas). <!--tomb-->