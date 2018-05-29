---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/including-and-managing-images-in-jekyll.html"
layout: post
title:  "Including and managing images in Jekyll"
tags:
- blog
- jekyll
- assets
- images
- html5
- figure
- figcaption
---
One thing that I instantly loved about Jekyll is that it encourages you to keep a strict and tidy folder structure in your project: you have your posts, layouts, styles, includes, collections and pages, and each one of these will go in a different folder to keep concerns separate. But what about the assets, namely images, that you want to include with your posts? Will you keep piling them in your assets folder? I have a better idea.<!--more-->

This post attemps to solve two problems. Firstly, I wanted to display a caption for every image I included on a post. While displaying an image is very straightforward with Markdown, I would have to do some fiddling to throw a caption in the mix, especially because I wanted to use HTML5's `<figure>` and `<figcaption>`, so I didn't have much choice but to include plain HTML code every time I wanted to show an image. That would mean a combination of two things I hate: 

1. writing ugly code, since I would be polluting my Markdown posts with HTML code which kind of defeats the point of using Markdown in the first place, and 
2. I would be repeating A LOT of code, A LOT of times, and let me tell you that I like my code how I like my feet: DRY - boy, I should be quoted on this!

The second problem we attempt to solve is file organisation. Where to store the images? It looks ugly to use a folder for all post images, or even worse, have them in the same folder where you have your layout images. File names will get messy at some point, and you'll eventually try to save a picture of a nice calendar (*date.jpg*) on the same folder you have that photo you took on your first day with Josephine (*date.jpg*). You see my point.

I would prefer a `posts` folder with a sub-folder for every post. Something like this:

```text
.
├── assets
|   ├── images (my layout images)
|   └── posts (my post images)
|       └── 2014-10-09-the-story-behind-my-website
|           ├── editing.jpg
|           └── studio.jpg
|       └── 2014-11-20-thoughts-on-serving-and-monitoring-a-feed
|           ├── feedburner-custom-domain.png
|           ├── feedburner-dashboard.png
|           └── feedly-search.png
|       └── 2014-11-04-is-linkedin-ignoring-your-open-graph-meta-tags
|           ├── butler.png
|           ├── linkedin-after.png
|           └── linkedin-before.png
```

So how to keep the files organised in a structure like this while maintaining the code clean, short and maintainable? I created a file called `image` (I didn't use the .html extension, but maybe I should) inside my `_includes` folder that looks like this:

```html
{% raw %}
{% capture imagePath %}{{ page.date | date: "%Y-%m-%d" }}-{{ page.title | slugify }}/{{ include.name }}{% endcapture %}
{% if include.caption %}
    <figure>
        <img src="/assets/posts/{{ imagePath }}" {% if include.alt %} alt="{{ include.alt }}" {% endif %} {% if include.width %} width="{{ include.width }}" {% endif %}/>
        <figcaption>{{ include.caption }}</figcaption>
    </figure>
{% else %}
    <img src="/assets/posts/{{ imagePath }}" {% if include.alt %} alt="{{ include.alt }}" {% endif %} {% if include.width %} width="{{ include.width }}" {% endif %}/>
{% endif %}
{% endraw %}
```

This file expects the image name, the caption and the alt text (the last two are optional), figures out the image path name (line 1) by slugifying the concatenation of the post date, the title and the image name, and based on the arguments passed write either a `<figure>`/`<figcaption>` or a plain old `<img>`.

So now when I want to include an image in a post I just add:

```text
{{ "{%" }} include image name="linkedin-before.png" caption="Sharing my blog on LinkedIn" %}
```

And then the magic happens. This could be extended for other types of media, like videos.<!--tomb-->
