---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/battling-with-ie8-html5-shiv-and-svg.html"
layout: post
title:  "Battling with IE8: HTML5 shiv and SVG"
tags:
- blog
- ie8
- html5
- shiv
- svg
---
Today I sent out a test link for a website my team is building and someone dropped me a message saying that it looks terribly broken in Internet Explorer, attaching a screenshot. And my, did it look broken. The majority of the elements didn't seem to have any styling applied to them at all!<!--more-->

I quickly realised that the person was running IE8 and the elements were not being styled because we were using HTML5 tags such as `<header>`, `<footer>` or `<article>` which are not supported in IE8. So I knew right away that this would be a quick fix: *«we just need the shiv»*, I said, referring to [The HTML5 Shiv](https://github.com/aFarkas/html5shiv), a small file that enables support for modern elements on ancient browsers.

To install the shiv you wrap the call to the JS file in a conditional comment so that only the browsers that actually need the file will actually load it.

```html
<!--[if lt IE 9]>
    <script src="path/to/your/html5shiv.js"></script>
<![endif]-->
```

And that's it! Well, usually. My site was still broken and I didn't understand why — the shiv was being correctly loaded but the elements were still not being styled in IE8.

After digging around for about an hour, I realised that the problem were my SVGs. I've knowingly used inline SVGs on this site, even though they're not supported in IE8, but I always thought that non-supporting browsers would just fail to display them. Turns out that IE8 actually freaks out and breaks when it finds the SVG elements. 

To overcome that, I simply wrapped all the SVG declarations with conditional comments that prevent the code from being read in versions of IE prior to 9.

```html
<!--[if gte IE 9]><!-->
<svg version="1.0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display:none">
	<defs>
		<g id="icn-video">
			<path d="M35,47.3V32.7L47.9,40L35,47.3z M37,36.1v7.7l6.9-3.9L37,36.1z M40,59c-10.5,0-19-8.5-19-19s8.5-19,19-19s19,8.5,19,19
				S50.5,59,40,59z M40,25c-8.3,0-15,6.7-15,15s6.7,15,15,15s15-6.7,15-15S48.3,25,40,25z"/>
		</g>

		<!-- ... more declarations here ... -->
	</defs>
</svg>
<!--<![endif]-->
```

It works, but I'm not too convinced about this solution. It doesn't cause any harm because modern browsers will treat the conditions as plain comments and ignore them, but I don't like the idea of having to wrap every SVG declaration with that piece of legacy code. What are your thoughts?<!--tomb-->
