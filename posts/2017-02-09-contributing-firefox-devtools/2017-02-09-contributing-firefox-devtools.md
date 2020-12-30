---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/contributing-firefox-devtools.html"
layout: post
title: "Contributing to Mozilla Firefox DevTools"
tags:
- blog
- mozilla
- firefox
- devtools
- mdn
audio: /assets/audio/2017-02-09-contributing-firefox-devtools.mp3
---
In 2007, Firebug 1.0 was released as a Mozilla Firefox add-on. This was the first set of browser development tools to feature a DOM inspector, a console and a JavaScript debugger in one place, which revolutionised front-end development tooling and shaped the way other browsers approached it too. A decade later, [Firefox DevTools takes its place](https://hacks.mozilla.org/2016/12/firebug-lives-on-in-firefox-devtools/) and I thought it'd be a great time to contribute to it. This article describes my experience in doing it, hoping to convince you to do the same.<!--more-->

## Languages of the web

Under the hood, Firefox DevTools is essentially a web application built with HTML, CSS and JavaScript. It consists of a front-end piece, which contains all the UI controls to do things like inspect a DOM node or dissect a network request, and a back-end holding the logic that does the actual polling and manipulation of the page being inspected. Interfaces are built as a set of modular [React components](http://mozilla.github.io/devtools-docs/react.html) and [Redux](http://mozilla.github.io/devtools-docs/redux.html) is used to manage the application state.

DevTools is built using the languages of the web, so any web developer can just dive in and start contributing.

## Pick a task

There is [a long list](http://firefox-dev.tools/) of bug reports and feature requests to choose from. The ones labelled with *Good First Bug* are probably a good starting point for someone that is new to the codebase.

One of the things I like the most about Mozilla is the community of people, both staff and volunteers, who work tirelessly to make the web a better place. I'm particularly fond of [MDN](https://developer.mozilla.org/en-US/), a community-driven repository of documentation for developers, which I proudly [contributed to myself](/blog/2016/08/17/mdn.html).

In fact, I think Mozilla should leverage this huge knowledge base as much as possible, by syndicating its content to various channels and integrating it with tools used daily by developers — Firefox itself, and DevTools in particular, is a perfect vehicle for that. An example of this is the error messages in the console that, since version 49 of the browser, are accompanied by a link to a relevant MDN page, offering developers extended information about the nature of the error, along with likely causes and possible solutions.

{% include helpers/image.html, frame:false name:"console-error.png", caption:"Firefox Web Console showing an error" %}

To help with the effort of integrating MDN with DevTools, I started looking into [Bug 1320233](https://bugzilla.mozilla.org/show_bug.cgi?id=1320233). The idea was to add a *Learn More* button, similar to the one in the console, next to each HTTP header in the Network panel, with a link to the relevant documentation page in MDN.

## Build Firefox

The first step to make that happen is to download the Firefox source code and build it on your machine. I recommend checking the [Firefox Build Instructions](https://developer.mozilla.org/en-US/docs/Mozilla/Developer_guide/Build_Instructions) page on MDN for information specific to your operating system, but it'll start with downloading and running a [bootstrap script](https://hg.mozilla.org/mozilla-central/raw-file/default/python/mozboot/bin/bootstrap.py) that will download some dependencies and configure a few things in your system. After that, it's time to download the actual source code and start building.

```bash
# Download the source code
hg clone http://hg.mozilla.org/mozilla-central/

# Enter the newly-created directory
cd mozilla-central

# Build
./mach build

# Run
./mach run
```

You'll notice that we used `hg clone` instead of `git clone`. This is because Mozilla uses [Mercurial](https://www.mercurial-scm.org/) as a source control management tool, not Git (*hg* is the chemical symbol for mercury, by the way). It's a bit of a pain, but more on this later.

The build process should take a while, so grab yourself a cup of coffee. When it's finished building, your local version of Firefox Nightly is ready to run.

## Develop for DevTools

DevTools is typically used to inspect and debug websites, of course, but because the tools themselves are a web application, we can use DevTools to debug itself! To do this, go to `Tools` > `Web Developer` > `Toggle Tools` in Firefox and click on the gear icon to access the settings panel. Make sure you enable `Enable browser chrome and add-on debugging toolboxes` and `Enable remote debugging`.

You can then click on the hamburger menu on the top-right corner and go to `Developer` > `Browser Toolbox`. You can now inspect the various DevTools panels like you would do with any website. How cool is that?

{% include helpers/image.html, name:"devtools1.png", caption:"Using DevTools to inspect DevTools" %}

The code for DevTools lives in the `devtools` directory on the root of the repository, under which there are a `client` and `server`sub-directories for the front-end and the back-end, respectively. Every time you change something in the code, you need to rebuild the application. To avoid the painstakingly long command we ran initially, you can simply use:

```bash
./mach build faster && ./mach run
```

## Write tests

When adding a new feature or fixing a bug, it's important to include automated tests along with the code. DevTools includes a suite of unit and integration tests based on [xpcshell](https://developer.mozilla.org/en/XPConnect/xpcshell) and [Mochitest](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/Mochitest), a testing suite built on top of [MochiKit](http://mochi.github.io/mochikit/).

Getting the tests right can be quite challenging, as the testing frameworks used in the project are quite bespoke to Mozilla. I recommend having a look around the existing tests and follow conventions as much as possible. There are some shared test utilities (called *heads*) that you can just import and use in your tests, which might save you some time.

Tests will run as part of a continuous integration system, which we'll cover later, but it's important to make sure they are passing on your local environment before submitting any code.

```bash
# Run all DevTools tests (takes ages)
./mach test devtools/*

# Run a specific xpcshell test
./mach xpcshell-test devtools/your-xpcshell-test.js

# Run a specific Mochitest
./mach mochitest devtools/your-mochitest.js
```

There's [a page](https://wiki.mozilla.org/DevTools/Hacking#DevTools_Automated_Tests) on the DevTools Wiki with plenty of information about the testing suite and some best practices for writing new tests.

## Push to try

The [Try server](https://wiki.mozilla.org/ReleaseEngineering/TryServer) is a continuous integration platform used by Mozilla that allows you to have your code evaluated by the same testing infrastructure used in the live release cycle, which includes running tests on various devices and operating systems, without actually pushing the code to the main repository. Your patch is expected to pass the tests on the Try server before being accepted.

To use the Try server, you need commit access to the Mozilla repositories. There are three types of commit access (levels 1 to 3), and you need at least level 1 to use Try. To request access, you should [file a bug](https://bugzilla.mozilla.org/enter_bug.cgi?product=mozilla.org&component=Repository%20Account%20Requests) in Bugzilla, stating the level of access you require and your email address, and you must attach a file with your public SSH key (see [this article](https://help.github.com/articles/generating-ssh-keys/) if you need help with generating one).

At this point, a Mozillian with sufficient commit access level will need to vouch for you. The mentor or reporter of the bug you're working on should be able to help you with this, otherwise ask for assistance in the `#devtools` IRC channel. With that taken care of, someone from IT will process the request and email you your credentials.

You'll need to add the Try server to a hosts config file, typically located at `~/.ssh/config`:

```text
Host hg.mozilla.org
User your-email@address.com
```

To push to Try, you need to choose the platforms and test suites to run, which are defined as a set of parameters to be passed to the CLI tool. The [TryChooser Syntax Builder](https://mozilla-releng.net/trychooser/) provides a UI that computes the command you need to use based on the parameters you select. When you run the generated command, you'll receive a link (like [this one](https://treeherder.mozilla.org/#/jobs?repo=try&revision=247af98478ae0f65a87cf1ddf1e0669f51436507)) where you can follow the progress of the tests as they come in.

## Submit a patch

Once you're happy with your changes, it's time to submit the code for review. DevTools is being gradually moved to a [GitHub repository](https://github.com/devtools-html), so if the part of the project you're contributing to is already there, you can simply submit a pull request with your changes, like you would in any other open-source project. If not, you have to generate a patch with Mercurial and attach it to Bugzilla.

To do that, you need to stage and commit all the files you want to submit, similarly to Git. The commit message should follow [a specific format](https://developer.mozilla.org/en-US/docs/Mozilla/Developer_guide/Committing_Rules_and_Responsibilities), including the ID of the bug you're working on and the person responsible for reviewing the code. Finally, you generate a patch file from the commit.

```bash
# Stage the files
hg add your-file1.js your-file2.js

# Commit with JohnDoe as the reviewer
hg commit -m "Bug 123456 - Add foo to the bar section. r=JohnDoe"

# Generate a patch file
hg export . > bug123456.patch
```

You can then attach this patch to the bug and request a review by adding the flag `?` to the `review` field. Reviewers will either give their thumbs up or attach additional feedback to the bug, so you might need to repeat the process of staging, committing, pushing to Try and attaching a patch multiple times.

## Celebrate

Once everyone is happy with your patch, they will check it in and flag it as ready to be included in a future release cycle. As for [my patch](https://hg.mozilla.org/mozilla-central/rev/031087a1f3c6), it will help you learn everything about HTTP headers as soon as Firefox 54 lands. Happy days!<!--tomb-->

*Thanks to [Soledad Penadés](https://soledadpenades.com/) for reviewing the post.*