---
layout: external-post
title:  "Shipping Node.js projects at Netlify"
tags:
- blog
- netlify
- nodejs
- automation
external-url: https://www.netlify.com/blog/2021/03/03/shipping-node.js-at-netlify/
external-name: Netlify Blog
---
At Netlify, we use a diverse set of technologies, languages and paradigms to build our product. Along with Ruby, Go, Rust and others, we write quite a bit of JavaScript. All flavors of it.

My team is responsible for several mission-critical Node.js services: the [Netlify CLI](https://github.com/netlify/cli), the [build system](https://github.com/netlify/build) and the [serverless function bundler](https://github.com/netlify/zip-it-and-ship-it) are just a few examples. Despite the sheer number of repositories we maintain, and especially considering that some of them are open-source projects with daily contributions from the community, you might be surprised to learn that our team is relatively small.

I lifted the curtain on the tools and processes that we rely on to make this happen.<!--more-->