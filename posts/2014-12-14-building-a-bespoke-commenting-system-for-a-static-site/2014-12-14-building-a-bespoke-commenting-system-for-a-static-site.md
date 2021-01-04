---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/building-a-bespoke-commenting-system-for-a-static-site.html"
layout: post
title: "Building a bespoke commenting system for a static site"
tags:
  - blog
  - javascript
  - php
  - jekyll
  - poole
  - disqus
  - honeypot
  - markdown
---

I've been using [Jekyll to run my professional website and my blog](/blog/2014/10/25/how-i-used-jekyll-on-my-backbonejs-website.html) for about 2 months and I never look back. It can do pretty much everything a dynamic website does, but better and faster. The one thing that my blog was missing was a way to get feedback from the readers and to allow me to interact with them and learn from their experiences. It's not very smart (and a bit arrogant, actually) to publish an article with a solution to a certain problem and not allow readers to comment on it, pointing possible weaknesses or even posting other solutions that (most likely) turn out to be better than mine.<!--more-->

A commenting system is something very common and easy to implement on classic blog platforms like Blogger or Wordpress, but we have to cater for the special characteristics of our beloved static sites and adapt things a bit. So how can we take a static HTML page and add a section with content that is constantly updated based on user input?

## At first, I thought Disqus

My first thought was [Disqus](https://disqus.com/), a comment hosting service used by platforms like Tumblr or Wordpress. In a nutshell, here's how it works: you create an account with them, add your website to the platform, tweak a few things on the layout and finally add a piece of JavaScript to your website, which will then get replaced with all the markup, style and logic needed for the comments to work. This sounded perfect, because I didn't need to actually run any logic on my server, a few lines of JavaScript would do the job, so I gave it a go.

{% include helpers/image.html name:"disqus.png" caption:"Screenshot of a Disqus installation" %}

It was that simple and it did work great, but I didn't like it. It offered too much stuff that I didn't want, like post ratings, favourites, social media integration and even a whole community! All I wanted was a simple form with 3 fields (name, email address or website and the message) so I didn't want to load a heavier plugin full of controls that I wouldn't use, and worse, with an interface that I couldn't properly customise and make _on-brand_.

## Then I found Poole

After doing some research, I came across [Poole](http://pooleapp.com/), a very simple and minimalistic form hosting service. After signing in with GitHub (off to a good start), it lets you create a form. And no, it doesn't ask you for any form fields or options at this point, you just choose a form name and it comes back with two URLs: the one you use to post your data to using a regular HTML form, and another one you use to get all your data as a JSON object.

The first one is public and is bound to the form by a unique hash code, whilst the second one contains an API key that you should, in theory, keep private. I say _in theory_ because the API is read-only, which means that even if someone else gets ahold of that key, they won't be able to do any damage with your data, although it might not be ideal to expose your data in bulk to the public without any filtering. If you want to delete any records, you have to be signed in with your GitHub account on Poole's website.

Poole is basically just an API to handle form submissions, so unlike Disqus you won't get anything near a commenting system out of the box — which is exactly what I wanted, because it means that I can build exactly what I want and make it look exactly how I want. Even though it can be used for many different things, the creators of Poole clearly acknowledge that using it as a commenting system on a static site is a perfect use case, so they include an example of how to implement one on their [examples page](http://pooleapp.com/examples/). In that example, they use Gulp to retrieve the JSON file with the comments, write them to the post layout page and trigger a site build automatically.

I like the idea of making the comments actually part of my pages instead of adding them to the DOM afterwards with JavaScript, as it makes the content indexable by search engines. However, I'm using GitHub pages to host and build my site and I'm really happy with that setup, and this Gulp approach meant that I would have to start building the site locally and then push it to GitHub. Even worse, I would have to come up with either a way to trigger a build every time someone added a comment or a way to schedule a build to happen a certain number of times per day, losing the ability to immediately add new comments to the site as they're posted. I hated both options and I honestly think that if I had to go with any of them, I would've been completely missing the point of a static site.

## So I wasn't quite there yet

At this point, I was back to the JavaScript approach. I could simply include the comment submission form on the page and then load the existing comments via Ajax, parse the JSON and append the content to the DOM. But what about form validation, will I rely solely on JavaScript for that? And what about spam detection? Also, by using JavaScript to call the JSON file that Poole provides, I'd be exposing my API secret to the public and therefore granting access to my data in bulk to anyone - like I said before, it's not critical, but it's not ideal either.

In fact, getting the comments for a given post was a bit more complicated than just send an Ajax request and append the result to the page, because the result would contain every single comment on the whole site and not just the ones associated with that specific post, so I would have to start by going through all the comments and filter the ones I wanted.

Because Poole doesn't offer any type of back-end validation, we can't guarantee that we won't have any records with empty fields, so we would have to do some more filtering to make sure we don't add to the page any comments with missing information.

There was another problem I had to deal with: cross-domain Ajax requests. The JSON file containing my data is hosted at Poole's servers, so my Ajax requests were being rejected due to cross-domain security restrictions. I didn't have control over the origin, so using [CORS](http://www.w3.org/TR/cors/) was out of the equation. My only option was [JSONP](http://www.tonido.com/blog/index.php/2014/05/02/using-jsonp-for-cross-domain-requests/#.VIxHiJOsUmw), but Poole didn't support it (they did implement it after [our conversation on Twitter](https://twitter.com/pooleapp/status/542647611413762048) though).

## Turns out I needed a middleman

I realised that I could build a server-side middleman that would get the JSON file from Poole, process the data and echo it back in the format of my choice. That approach would get around all the abovementioned problems quite easily by allowing me to:

1. **Use JSONP:** I could write the middleman in a way that it would wrap the data in a function call and I could even specify its name with a GET variable. This would solve my problems with cross-domain requests.

1. **Hide my API key:** The middleman would be sending the request to Poole instead of my JavaScript, so the API key could be safe from prying eyes.

1. **Lower the load on the client-side**: Instead of sending raw JSON to my JavaScript file and having it parsing, filtering and adding the data to an HTML template, I could do most of the work on the server-side instead. My middleman could expect a post URL as an argument and return only the comments associated with it. It could also check for comments with missing fields and discard them. Do you know what? I could even use it to build my template and just send back to the JavaScript the HTML code ready to be appended to the DOM.

1. **Do some basic spam detection:** I could plant a [honeypot form field](http://solutionfactor.net/blog/2014/02/01/honeypot-technique-fast-easy-spam-prevention/) and look for it in when filtering the comments. This is not a bulletproof solution, but should stop some of the spam bots (at least the dumb ones).

1. **Use Markdown:** I could allow users to use Markdown in their comments by installing a Markdown parser and hooking it up with my middleman. This is particularly important on my blog, since I wanted to give my readers a nice way of sharing their own code in response to my articles (and this way I could make it compatible with my [technique for displaying code snippets](/blog/2014/11/30/collapsing-code-snippets-on-mobile-devices.html)).

## Gosh, will you show some code already?

Right away. I started by building my middleman, with PHP as my language of choice. I used [composer](https://packagist.org/packages/erusev/parsedown) to install [Parsedown](http://parsedown.org/), a fast Markdown parser for PHP. This script will look for two GET variables: `page` is the path for the post I want to get the comments for and `callback` is the name of the function to pad the JSON data with.

<!--phpsyntax-->

```php
<?php

require 'vendor/erusev/parsedown/Parsedown.php';

$pooleFeed = 'http://pooleapp.com/data/<MY-API-KEY>.json';

if (!isset($_GET['page']) || !isset($_GET['callback'])) {
	die();
}

$data = json_decode(file_get_contents($pooleFeed));
$comments = array();

foreach ($data->sessions as $session) {
	if (($session->page == $_GET['page']) && (empty($session->honey)) && (!empty($session->message)) && (!empty($session->name))) {
		$comments[] = createComment($session->_id, $session->name, $session->contact, $session->message, $session->created);
	}
}

echo($_GET['callback'] . '(' . json_encode($comments) . ')');

/**
*
* Generating comments
*
**/

function createComment($id, $name, $contact, $message, $date) {
	// Format date
	$date = date('M d, Y \@ H:i', strtotime($date));

	// Prepare markdown parser
	$markdown = new Parsedown();

	// Decide if the user left an email address or a website in the 'contact' field
	$contactLink = (strpos($contact, '@') === false) ? $contact : ("mailto:" . $contact);

	$comment =
		"<div class='comment'>" .
			"<p class='header'>" .
				"<a href='" . $contactLink . "' name='comment-" . $id . "'>" .
					"<strong>" . $name . "</strong> - " . $date .
				"</a>" .
			"</p>" .
			"<div class='message'>";

	// Parse markdown
	$comment .= $markdown->text(html_entity_decode($message));

	$comment .=
			"</div>" .
		"</div>";

	return $comment;
}

?>
```

After including it in my script, I set the URL for my Poole JSON file and grab its contents. I then loop through all the comments and, for each one, check if it a) matches the page I passed in the URL, b) passes the honeypot test and c) contains my required fields, name and message (lines 14 to 22).

I wanted to allow comments on all posts by default, but at the same time have the ability to disable them on specific cases. To do that, I modified the default front-matter settings for my posts.

```text
# _config.yml
defaults:
  -
    scope:
      path: ""
      type: "posts"
    values:
      author: "Eduardo Bouças"
      enable_comments: true
```

Now I just need to add `enable_comments: false` to any post I don't want comments on. Time to add the comments section to my post layout:

```html
<hr />
<section class="comments">
  <h2>Comments</h2>
  <div id="comments">
    <p>Loading comments...</p>
  </div>
  <h3>Have something to say?</h3>
  <form
    action="http://pooleapp.com/stash/10de6ec7-27c4-469f-824a-8c0eee3ec105/"
    method="post"
  >
    <input type="hidden" name="redirect_to" value="{{ "{{" }} page.url
    }}#comments" /> <input type="hidden" name="page" value="{{ "{{" }} page.url
    }}" />
    <input type="text" name="name" placeholder="Name" required />
    <input type="text" name="contact" placeholder="Email address or website" />
    <input type="text" name="honey" />
    <textarea
      rows="10"
      name="message"
      placeholder="Comment"
      required
    ></textarea>
    <span
      >You can use
      <a href="http://daringfireball.net/projects/markdown/syntax">Markdown</a>
      in your comment.</span
    >
    <input type="submit" value="Send" />
  </form>
</section>
```

The `div` with the id _comments_ is where JavaScript will place all the comments, but until then we'll display "Loading comments..." as a placeholder. The form is set to post data to my Poole URL and contains two hidden fields: `redirect_to` is a field specific to Poole (not stored in the dataset) and represents the relative path to the page users will be redirected to after submitting the form, and `page` is the path to our current page, so we can associate the comment with the post.

I then called the middleman script on my post layout page:

```html
<script async src="http://sys.eduardoboucas.com/blog/comments/?callback=blog.initComments&page={{ "{{" }} page.url }}"></script>
```

I used `async` because I don't want to wait for the middleman to give me the comments to load the post. I'm passing the two arguments we discussed before to the middleman: `blog.initComments` is a function in my JavaScript module that will handle the comments and `page` is the current URL.

Finally, the bit of JavaScript that handles the data from the JSONP call:

```javascript
var blog = {
	initComments: function (data) {
		if (data.length > 0) {
			$("#comments").html(data);
		} else {
			$("#comments").html('<p>This post doesn\'t have any comments yet.</p>');
		}
	},

	// (...)
```

And that's pretty much it. You can see the result on the form below. Feel free to use it to leave any questions or suggestions you might have - sweet, I can finally say this!<!--tomb-->
