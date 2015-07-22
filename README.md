[![Glitched image of Eduardo in a chair](https://raw.githubusercontent.com/eduardoboucas/eduardoboucas.github.io/master/assets/images/glitch.png)](https://eduardoboucas.com)

# [eduardoboucas.com](https://eduardoboucas.com)

> Because building a video-based website with Jekyll and Backbone.js seemed like a good idea.

## Video sequence and Backbone.js

The landing page consists of a sequence of three HTML5 videos. Because of the way they were recorded and the way they play on the page, it creates the effect of me entering the frame and waiting for user interaction; when a menu item is clicked, I leave the frame to reveal the content, then come back into the frame when the user goes back to the initial screen.

I've used [Backbone.js](http://backbonejs.org/) to deliver the single-page application. When a user clicks on a section, Backbone will grab the appropriate HTML file using Ajax and add its contents to the page.
 
More information about how this was done can be found [here](https://eduardoboucas.com/blog/2014/10/09/the-story-behind-my-website.html).

## Jekyll

In 2014, I've decided to move away from using plain static HTML files to using Jekyll to manage the content. Because Backbone was already grabbing static HTML files to display the various sections, it was quite simple to connect both systems together, since all Jekyll does is create HTML files.

At this point I've added the [blog section](https://eduardoboucas.com/blog/), which is a standalone part of the site. It's still powered by Jekyll, but it's disconnected from Backbone.
