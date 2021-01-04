---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/jekyll-staging-environment.html"
layout: post
title: "Creating a staging environment for Jekyll"
tags:
  - blog
  - jekyll
  - preview
  - staging
  - environment
  - netlify
audio: /assets/audio/2017-02-22-jekyll-staging-environment.mp3
---

A staging or pre-production environment is a testing infrastructure that replicates as best as possible the setup of a live site. In the context of a Jekyll site, it can be used to share a new post or feature with a selected group of people before a roll out to the general public. In this post, I'll show you how I created one and how I make use of it.<!--more-->

## Git workflow

My site is hosted on GitHub and served through [GitHub Pages](https://pages.github.com/), which means that anything that I push to the `master` branch triggers a regeneration of the site and is published almost immediately. If I visit my live URL after a few seconds, I'll be able to see the updated content.

For a staging environment, we basically want to duplicate this infrastructure so we pass our content through a separate site, on a separate URL. The flow would be something like:

1. Push changes to GitHub
1. Staging site is regenerated, staging URL can be used to preview the new state
1. Create a pull request from staging to live to propagate the changes
1. Live site is regenerated, live URL reflects the new state

To make this work with GitHub Pages alone, we'd need two repositories, since you can't have two sites being served from a single repository. But unless one repository is a fork from the other, which means having two GitHub accounts or using an _organisation_, you can't create a pull request between them.

Instead, I used [Netlify](https://netlify.com) to serve my staging site from the `dev` branch of my existing repository — I've got GitHub Pages serving `eduardoboucas.com` from the `master` branch and Netlify serving `dev.eduardoboucas.com` from the `dev` branch.

To create that branch, you can use the following:

```bash
# Take a snapshot of an existing branch and create a new one
git checkout -b dev

# Push the new branch to the remote repository
git push origin dev
```

## Using Netlify

To start using Netlify, go to [their website](https://netlify.com) and sign up with your GitHub account (it's [free for open-source projects](https://www.netlify.com/pricing/)). Click on `Add a new project`, choose GitHub and select the repository that contains your site.

{% include helpers/image.html frame:false name:"netlify1.png" caption:"Netlify: Configuring the repository" %}

In the `Basic Settings` tab, select the staging branch you chose previously (e.g. `dev`). For a Jekyll installation, the default publish directory should be `_site` and the build command `jekyll build`. In the `Advanced Settings` tab, add an environment variable called `JEKYLL_ENV` with the value `stage` — this will be used to inform Jekyll of the environment the site is running on.

Next, click on `Build your site` and give it a few seconds. When the build process finishes, click on `View your site` to see the result.

You'll be attributed a random name, like `cartoonist-foreground-47121`, which you can change in the `Settings` panel. You can also define a custom domain on this page, which you'll need to configure the DNS for. If you set the name of your site to `dev-example-com`, you need a CNAME pointing to `dev-example-com.netlify.com`.

{% include helpers/image.html frame:false name:"netlify2.png" caption:"Netlify: The Settings panel" %}

## Configuring Jekyll

The environment variable we created above can be accessed in Jekyll, by using the property `jekyll.environment` in any Liquid template. With that, we can make a few adjustments to the site based on the environment it's running on.

For example, we don't want the staging site to be indexed by search engines.

```html
{% raw %}{% if jekyll.environment == 'stage'
<meta name="robots" content="noindex" />
{% endif %}{% endraw %}
```

You can even add a banner to the top of every page, warning visitors that they're accessing a development version of your site.

```html
{% raw %}{% if jekyll.environment == 'stage'
<p class="banner">
  <a href="https://eduardoboucas.com">
    This is a development version of the site. Click here to see the live
    content.
  </a>
</p>
{% endif %}{% endraw %}
```

And that's [my staging site](http://dev.eduardoboucas.com) configured. Whenever I want to ask someone to review a post before it's published, I push it to the `dev` branch and get it on the staging site; to push it live, I just need to merge it to `master`.

You could even get rid of GitHub Pages completely and rely on Netlify to serve both your live and staging environments (which I might do soon, for reasons I'll cover in a future post).

So there you have it, a simple staging environment with continuous integration for a Jekyll site, all for free. Not bad, right?<!--tomb-->
