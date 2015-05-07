---
layout: post
title:  "Rethinking the commenting system for my Jekyll site"
date:   2015-05-10 16:57:00
categories: blog
tags: jekyll comments github
---
Last December, I wrote a post about building a bespoke commenting for Jekyll. I had been using Jekyll for a couple of months at the time, and not having an easy solution for a commenting system was the first big limitation of a static site I had to deal with. I didn’t want to use a third-party service, like Disqus, so I decided to build a bespoke solution because I knew what I wanted — or I thought I did.<!--more-->

To sum it up, I used [Poole](http://pooleapp.com) to handle and store my comments data and then built a server-side middleman in PHP that would get the feed from Poole, convert the Markdown to HTML and return the comments in pure HTML, ready to be appended to the page. A bit of JavaScript would then make the call to this middleman on every post and append all the comments to the page.

The beauty of our industry is that to keep afloat you need to be constantly learning and rethinking your processes and principles, and sometimes that means realising that the way you’ve done something in the past is not the best and that there are better and more elegant ways of going about things. I thought I knew what I wanted when I wrote that post, but I actually didn’t.

The main reason I didn’t want to go with something like Disqus was because it’s completely off-brand. My site is my property and the way it looks and feels throughout is part of my identity, so I didn’t want to introduce a third-party service that would interfere with that. Also, Disqus comes with a bunch of features I was simply not interested in, since I was after a very simple commenting system.

But it wasn’t until I watched a talk by Tom Preston-Werner at [JekyllConf](http://jekyllconf.com) that I realised the bigger problem with platforms like Disqus and even with my own solution: who owns the data? The beauty of building a site with Jekyll is that content is treated as part of the site and therefore hosted and versioned alongside the codebase, taking away the hassle of backing up and migrating databases and eliminating the possibility of content being lost.

With my Poole solution, where are my comments stored? What happens if the service suddenly disappears? The comments are important feedback to the subjects I write about and are as valuable (or sometimes even more valuable) than the posts themselves, so shouldn’t I be storing them in my repository, along with every other component of the site?
Also, using JavaScript to inject the comments on the page after it’s served doesn’t really feel right. 

This leaves us with an inevitable challenge: how can we take user input and add it to the static pages we serve? Isn’t that where we draw the line of when a dynamic site is required?

## The idea

One thing that I got wrong in my original post was saying that having to regenerate the site based on user input defeats the purpose of a static site. My reasoning behind it was that generating a site is expensive, both in terms of time and the amount of operations that need to take place (e.g. push files to GitHub or run a deploy script). But actually, does that really matter? That operation will run on the background and will have no impact on the user. When the site finishes regenerating, the HTML pages are replaced by a new set of static files, ready to be served to the next visitor.

With that said, the plan was to store each comment as a separate file in my `_data` directory, within a sub-directory for each post. To add a new comment, a server-side middleman would handle a POST request with the form data, create a YML file with the comment’s data and push it to GitHub, triggering a regeneration of my site. 

On the front-end, JavaScript would hijack the form submit to avoid a page reload. It would then send the POST request asynchronously via Ajax and, upon confirmation of success, take the comments template and append the new comment to the page, giving the feeling that the content was added instantly, even though a lot of stuff still has to happen behind the curtain.

{% include image name="jekyll-discuss-diagram.png" caption="Flow of data in the commenting system" %}

The form itself would have four fields: name (mandatory), email (mandatory, but not public), url (optional) and message (mandatory). My plan was to use the email address as a unique identifier for the user and to attempt to pull an avatar from Gravatar, so I just needed it to create a md5 hash. I was not going to make it public for privacy and spammy reasons.

Finally, my middleman is a combination of a PHP/Slim script to handle the requests and a Bash script to create the files and push them to Git. A t1.micro free instance on AWS is hosting the middleman, while GitHub pages is hosting the Jekyll installation. Before anything else, please note that everything described in this post is a proof of concept and should not be used on production as it is.

## Part 1: The bash script

Let’s start from the end of the process and create the bash script that will take the comment data, create a YAML file and push it to Git. My idea was to create an independent file, completely decoupled from the PHP script, so it can potentially be used in the future by other entities or components. 

The script will take 5 arguments: the post slug (e.g. 2015-05-10-rethinking-the-commenting-system-for-my-jekyll-site), the commenter’s name, email address MD5 hash and url, and finally the message, as `--post`, `--name`, `--url`, `--hash` and `--message` respectively.

We’ll use a config file to store settings like the GitHub user and repository details (local folder and remote location) and the folder structure to be used for the comment files. In this example, each comment will be in a YAML file named `{date-and-time}-{email-hash}.yml` (e.g. `20150510170537-b7284abf8c22bf9ba22069899511404c.yml`), inside a directory with the post slug, inside `_data/`. Here’s how my config file looks like:

{% highlight text linenos %}
GIT_USERNAME="eduardoboucas"
GIT_REPO="site-test"
GIT_REMO_REMOTE="eduardoboucas/test-repo.git"
GIT_USER="Eduardo Boucas"
GIT_EMAIL="mail@eduardoboucas.com"

COMMENTS_DIR_FORMAT="_data/comments/@post-slug"
COMMENTS_FILE_FORMAT="@timestamp-@hash.yml"
{% endhighlight %}

We also need some sort of authentication to be able to push things to GitHub. Instead of using my password, which I want to keep safe from prying eyes, I generated a [personal access token](https://github.com/settings/tokens) on GitHub and wrote it to a hidden file inside the repository called `.gittoken` (make sure to add that file to the .gitignore, because we don’t want to accidentally commit that file!).

So when the script fires, we extract the arguments into variables, create a folder for the post if it doesn’t exist yet and form the YAML file with the content of the comment.

{% highlight bash linenos %}
#!/bin/bash
while [[ $# > 1 ]]
do
key="$1"

# I’ve omitted the rest of the arguments here
case $key in
    -p|--post)
    POST_SLUG="$2"
    shift
    ;;
    esac
shift
done

# Read Git token
TOKEN=`cat .gittoken`

# Read config file
source config

FILE="name: ${NAME}\nhash: ${EMAIL_HASH}\n"

if [ ! -z "$URL" ]; then
    FILE=${FILE}"url: ${URL}\n"
fi

FILE=${FILE}"message: \"${MESSAGE}\"\n"

# Change directory to repo
cd ${GIT_REPO}

# Form comment file directory
COMMENTS_DIR=${COMMENTS_DIR_FORMAT//@post-slug/$POST_SLUG}

# Create directory if does not exist
if [ ! -d "$COMMENTS_DIR" ]; then
  mkdir ${COMMENTS_DIR}
fi

COMMENT_TIMESTAMP=`date +%Y%m%d%H%M%S`
COMMENT_FILE=${COMMENTS_FILE_FORMAT//@timestamp/$COMMENT_TIMESTAMP}
COMMENT_FILE=${COMMENTS_DIR}/${COMMENT_FILE//@hash/$EMAIL_HASH}

# Abort if file already exists
if [ -f $COMMENT_FILE ]; then
    exit 0
fi

# Create file
printf "$FILE" > $COMMENT_FILE
{% endhighlight %}

Finally, we push to GitHub.

{% highlight bash linenos %}
git config user.name ${GIT_USER}
git config user.email ${GIT_EMAIL}
git remote rm origin
git remote add origin https://${GIT_USERNAME}:${TOKEN}@github.com/${GIT_REPO_REMOTE}
git pull origin master
git add ${COMMENT_FILE}
git commit -m "Automatic upload of comment"
git push --quiet origin master > /dev/null 2>&1
{% endhighlight %}

## Part 2: The PHP handler

On the PHP side, 