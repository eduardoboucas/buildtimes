---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/static-api-generator.html"
layout: post
title: "Static API generator"
tags:
  - blog
  - static
  - api
  - jam
external-url: https://css-tricks.com/creating-static-api-repository/
external-name: CSS-Tricks
external-date: 2017-09-21
---

When I first started building websites, the proposition was quite basic: take content, which may or may not be stored in some form of database, and deliver it to people's browsers as HTML pages. Over the years, countless products used that simple model to offer all-in-one solutions for content management and delivery on the web.

Fast-forward a decade or so and developers are presented with a very different reality. With such a vast landscape of devices consuming digital content, it's now imperative to consider how content can be delivered not only to web browsers, but also to native mobile applications, _IoT_ devices, and other mediums yet to come.<!--more-->

Even within the realms of the web browser, things have also changed: client-side applications are becoming more and more ubiquitous, with challenges to content delivery that didn't exist in traditional server-rendered pages.

The answer to these challenges almost invariably involves creating an API — a way of exposing data in such a way that it can be requested and manipulated by virtually any type of system, regardless of its underlying technology stack. Content represented in a universal format like JSON is fairly easy to pass around, from a mobile app to a server, from the server to a client-side application and pretty much anything else.

Embracing this API paradigm comes with its own set of challenges. Designing, building and deploying an API is not exactly straightforward, and can actually be a daunting task to less experienced developers or to front-enders that simply want to learn how to consume an API from their React/Angular/Vue/Etc applications without getting their hands dirty with database engines, authentication or data backups.

## Back to basics

I love the simplicity of static sites and I particularly like this new era of [static site generators](/blog/2015/05/21/an-introduction-to-static-site-generators.html). The idea of a website using a group of flat files as a data store is also very appealing to me, which using something like GitHub means the possibility of having a data set available as a public repository on a platform that allows anyone to easily contribute, with pull requests and issues being excellent tools for moderation and discussion.

Imagine having a site where people find a typo in an article and submit a pull request with the correction, or accepting submissions for new content with an open forum for discussion, where the community itself can filter and validate what ultimately gets published. To me, this is quite powerful.

I started toying with the idea of applying these principles to the process of building an API instead of a website — if programs like Jekyll or Hugo take a bunch of flat files and create HTML pages from them, could we build something to turn them into an API instead?

## Static data stores

Let me show you two examples that I came across recently of GitHub repositories used as data stores, along with some thoughts on how they're structured.

The first example is the [ESLint website](https://github.com/eslint/eslint.github.io/tree/master/docs/rules), where every single ESLint rule is listed along with its options and associated examples of correct and incorrect code. Information for each rule is stored in a Markdown file annotated with a YAML front matter section. Storing the content in this human-friendly format makes it easy for people to author and maintain, but not very simple for other applications to consume programmatically.

The second example of a static data store is MDN's [browser-compat-data](https://github.com/mdn/browser-compat-data), a compendium of browser compatibility information for CSS, JavaScript and other technologies. Data is stored as JSON files, which conversely to the ESLint case, are a breeze to consume programmatically but a pain for people to edit, as JSON is very strict and human errors can easily lead to malformed files.

There are also some limitations stemming from the way data is grouped together. ESLint has a file per rule, so there's no way to, say, get a list of all the rules specific to ES6, unless they chuck them all into the same file, which would be highly impractical. The same applies to the structure used by MDN.

A static site generator solves these two problems for normal websites — they take human-friendly files, like Markdown, and transform them into something tailored for other systems to consume, typically HTML. They also provide ways, through their template engines, to take the original files and group their rendered output in any way imaginable.

Similarly, the same concept applied to APIs — a static API generator? — would need to do the same, allowing developers to keep data in smaller files, using a format they're comfortable with for an easy editing process, and then process them in such a way that multiple endpoints with various levels of granularity can be created, transformed into a format like JSON.

## Building a static API generator

Imagine an API with information about movies. Each title should have information about the runtime, budget, revenue, and popularity, and entries should be grouped by language, genre, and release year.

To represent this dataset as flat files, we could store each movie and its attributes as a text, using YAML or any other data serialization language.

```yaml
budget: 170000000
website: http://marvel.com/guardians
tmdbID: 118340
imdbID: tt2015381
popularity: 50.578093
revenue: 773328629
runtime: 121
tagline: All heroes start somewhere.
title: Guardians of the Galaxy
```

To group movies, we can store the files within language, genre and release year sub-directories, as shown below.

```text
input/
├── english
│   ├── action
│   │   ├── 2014
│   │   │   └── guardians-of-the-galaxy.yaml
│   │   ├── 2015
│   │   │   ├── jurassic-world.yaml
│   │   │   └── mad-max-fury-road.yaml
│   │   ├── 2016
│   │   │   ├── deadpool.yaml
│   │   │   └── the-great-wall.yaml
│   │   └── 2017
│   │       ├── ghost-in-the-shell.yaml
│   │       ├── guardians-of-the-galaxy-vol-2.yaml
│   │       ├── king-arthur-legend-of-the-sword.yaml
│   │       ├── logan.yaml
│   │       └── the-fate-of-the-furious.yaml
│   └── horror
│       ├── 2016
│       │   └── split.yaml
│       └── 2017
│           ├── alien-covenant.yaml
│           └── get-out.yaml
└── portuguese
    └── action
        └── 2016
            └── tropa-de-elite.yaml
```

Without writing a line of code, we can get something that is kind of an API (although not a very useful one) by simply serving the `input/` directory above using a web server. To get information about a movie, say, Guardians of the Galaxy, consumers would hit `/english/action/2014/guardians-of-the-galaxy.yaml` to get the contents of the YAML file.

Using this very crude concept as a starting point, we can build a tool — a static API generator — to process the data files in such a way that their output resembles the behavior and functionality of a typical API layer.

### Format translation

The first issue with the solution above is that the format chosen to author the data files might not necessarily be the best format for the output. A human-friendly serialization format like YAML or TOML should make the authoring process easier and less error-prone, but the API consumers will probably expect something like XML or JSON.

Our static API generator can easily solve this by visiting each data file and transforming its contents to JSON, saving the result to a new file with the exact same path as the source, except for the parent directory (e.g. `output/` instead of `input/`), leaving the original untouched.

This results on a 1-to-1 mapping between source and output files. If we now served the `output/` directory, consumers could get data for Guardians of the Galaxy in JSON by hitting `/english/action/2014/guardians-of-the-galaxy.json`, whilst still allowing editors to author files using YAML or other.

```yaml
{
  "budget": 170000000,
  "website": "http://marvel.com/guardians",
  "tmdbID": 118340,
  "imdbID": "tt2015381",
  "popularity": 50.578093,
  "revenue": 773328629,
  "runtime": 121,
  "tagline": "All heroes start somewhere.",
  "title": "Guardians of the Galaxy",
}
```

### Aggregating data

With consumers now able to consume entries in the best-suited format, let's look at creating endpoints where data from multiple entries are grouped together. For example, imagine an endpoint that lists all movies in a particular language and of a given genre.

The static API generator can generate this by visiting all subdirectories on the level being used to aggregate entries, and recursively saving their sub-trees to files placed at the root of said subdirectories. This would generate endpoints like `/english/action.json`, which would allow consumers to list all action movies in English, or `/english.json` to get all English movies.

```javascript
{
   "results": [
      {
         "budget": 150000000,
         "website": "http://www.thegreatwallmovie.com/",
         "tmdbID": 311324,
         "imdbID": "tt2034800",
         "popularity": 21.429666,
         "revenue": 330642775,
         "runtime": 103,
         "tagline": "1700 years to build. 5500 miles long. What were they trying to keep out?",
         "title": "The Great Wall"
      },
      {
         "budget": 58000000,
         "website": "http://www.foxmovies.com/movies/deadpool",
         "tmdbID": 293660,
         "imdbID": "tt1431045",
         "popularity": 23.993667,
         "revenue": 783112979,
         "runtime": 108,
         "tagline": "Witness the beginning of a happy ending",
         "title": "Deadpool"
      }
   ]
}
```

To make things more interesting, we can also make it capable of generating an endpoint that aggregates entries from multiple diverging paths, like all movies released in a particular year. At first, it may seem like just another variation of the examples shown above, but it's not. The files corresponding to the movies released in any given year may be located at an indeterminate number of directories — for example, the movies from 2016 are located at `input/english/action/2016`, `input/english/horror/2016` and `input/portuguese/action/2016`.

We can make this possible by creating a snapshot of the data tree and manipulating it as necessary, changing the root of the tree depending on the aggregator level chosen, allowing us to have endpoints like `http://localhost/2016.json`.

### Pagination

Just like with traditional APIs, it's important to have some control over the number of entries added to an endpoint — as our movie data grows, an endpoint listing all English movies would probably have thousands of entries, making the payload extremely large and consequently slow and expensive to transmit.

To fix that, we can define the maximum number of entries an endpoint can have, and every time the static API generator is about to write entries to a file, it divides them into batches and saves them to multiple files. If there are too many action movies in English to fit in `/english/action.json` we'd have `/english/action-2.json` and so on.

For easier navigation, we can add a metadata block informing consumers of the total number of entries and pages, as well as the URL of the previous and next pages when applicable.

```javascript
{
   "results": [
      {
         "budget": 150000000,
         "website": "http://www.thegreatwallmovie.com/",
         "tmdbID": 311324,
         "imdbID": "tt2034800",
         "popularity": 21.429666,
         "revenue": 330642775,
         "runtime": 103,
         "tagline": "1700 years to build. 5500 miles long. What were they trying to keep out?",
         "title": "The Great Wall"
      },
      {
         "budget": 58000000,
         "website": "http://www.foxmovies.com/movies/deadpool",
         "tmdbID": 293660,
         "imdbID": "tt1431045",
         "popularity": 23.993667,
         "revenue": 783112979,
         "runtime": 108,
         "tagline": "Witness the beginning of a happy ending",
         "title": "Deadpool"
      }
   ],
   "metadata": {
      "itemsPerPage": 2,
      "pages": 3,
      "totalItems": 6,
      "nextPage": "/english/action-3.json",
      "previousPage": "/english/action.json"
   }
}
```

### Sorting

It's useful to be able to sort entries by any of their properties, like sorting movies by popularity in descending order. This is a trivial operation that takes place at the point of aggregating entries.

## Putting it all together

Having done all the specification, it was time to build the actual static API generator app. I decided to use Node.js and to publish it as an npm module so that anyone can take their data and get an API off the ground effortlessly. I called the module `static-api-generator` (original, right?).

To get started, create a new folder and place your data structure in a sub-directory (e.g. `input/` from earlier). Then initialize a blank project and install the dependencies.

```text
npm init -y
npm install static-api-generator --save
```

The next step is to load the generator module and create an API. Start a blank file called `server.js` and add the following.

```javascript
const API = require("static-api-generator");
const moviesApi = new API({
  blueprint: "source/:language/:genre/:year/:movie",
  outputPath: "output"
});
```

In the example above we start by defining the API blueprint, which is essentially naming the various levels so that the generator knows whether a directory represents a language or a genre just by looking at its depth. We also specify the directory where the generated files will be written to.

Next, we can start creating endpoints. For something basic, we can generate an endpoint for each movie. The following will give us endpoints like <code>/english/action/2016/deadpool.json</code>.

```javascript
moviesApi.generate({
  endpoints: ["movie"]
});
```

We can aggregate data at any level. For example, we can generate additional endpoints for genres, like <code>/english/action.json</code>.

```javascript
moviesApi.generate({
  endpoints: ["genre", "movie"]
});
```

To aggregate entries from multiple diverging paths of the same parent, like all action movies regardless of their language, we can specify a new root for the data tree. This will give us endpoints like <code>/action.json</code>.

```javascript
moviesApi.generate({
  endpoints: ["genre", "movie"],
  root: "genre"
});
```

By default, an endpoint for a given level will include information about all its sub-levels — for example, an endpoint for a genre will include information about languages, years and movies. But we can change that behavior and specify which levels to include and which ones to bypass.

The following will generate endpoints for genres with information about languages and movies, bypassing years altogether.

```javascript
moviesApi.generate({
  endpoints: ["genre"],
  levels: ["language", "movie"],
  root: "genre"
});
```

Finally, type `npm start` to generate the API and watch the files being written to the output directory. Your new API is ready to serve - enjoy!

## Deployment

At this point, this API consists of a bunch of flat files on a local disk. How do we get it live? And how do we make the generation process described above part of the content management flow? Surely we can't ask editors to manually run this tool every time they want to make a change to the dataset.

### GitHub Pages + Travis CI

If you're using a GitHub repository to host the data files, then [GitHub Pages](https://pages.github.com/) is a perfect contender to serve them. It works by taking all the files committed to a certain branch and making them accessible on a public URL, so if you take the API generated above and push the files to a `gh-pages` branch, you can access your API on `http://YOUR-USERNAME.github.io/english/action/2016/deadpool.json`.

We can automate the process with a CI tool, like Travis. It can listen for changes on the branch where the source files will be kept (e.g. `master`), run the generator script and push the new set of files to `gh-pages`. This means that the API will automatically pick up any change to the dataset within a matter of seconds – not bad for a static API!

After signing up to Travis and connecting the repository, go to the Settings panel and scroll down to <em>Environment Variables</em>. Create a new variable called `GITHUB_TOKEN` and insert a [GitHub Personal Access Token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) with write access to the repository – don't worry, the token will be safe.

Finally, create a file named `.travis.yml` on the root of the repository with the following.

```yaml
language: node_js

node_js:
  - "7"

script: npm start

deploy:
  provider: pages
  skip_cleanup: true
  github_token: $GITHUB_TOKEN
  on:
    branch: master
  local_dir: "output"
```

And that's it. To see if it works, commit a new file to the `master` branch and watch Travis build and publish your API. Ah, GitHub Pages has full support for CORS, so consuming the API from a front-end application using Ajax requests will work like a breeze.

You can check out [the demo repository](https://github.com/eduardoboucas/movies-api) for my Movies API and see some of the endpoints in action:

- [Movie endpoint (Deadpool)](https://eduardoboucas.github.io/movies-api/english/action/2016/deadpool.json)
- [List of genres with languages and years](https://eduardoboucas.github.io/movies-api/genres.json)
- [List of languages and years by genre (Action)](https://eduardoboucas.github.io/movies-api/action.json)
- [Full list of languages with genres, years and movies](https://eduardoboucas.github.io/movies-api/languages.json)

## Going full circle with Staticman

Perhaps the most blatant consequence of using a static API is that it's inherently read-only – we can't simply set up a POST endpoint to accept data for new movies if there's no logic on the server to process it. If this is a strong requirement for your API, that's a sign that a static approach probably isn't the best choice for your project, much in the same way that choosing Jekyll or Hugo for a site with high levels of user-generated content is probably not ideal.

But if you just need some basic form of accepting user data, or you're feeling wild and want to go full throttle on this static API adventure, there's something for you. Last year, I created a project called [Staticman](https://staticman.net/), which tries to solve the exact problem of adding user-generated content to static sites.

It consists of a server that receives POST requests, submitted from a plain form or sent as a JSON payload via Ajax, and pushes data as flat files to a GitHub repository. For every submission, a pull request will be created for your approval (or the files will be committed directly if you disable moderation).

You can configure the fields it accepts, add validation, spam protection and also choose the format of the generated files, like JSON or YAML.

This is perfect for our static API setup, as it allows us to create a user-facing form or a basic CMS interface where new genres or movies can be added. When a form is submitted with a new entry, we'll have:

- Staticman receives the data, writes it to a file and creates a pull request
- As the pull request is merged, the branch with the source files (`master`) will be updated
- Travis detects the update and triggers a new build of the API
- The updated files will be pushed to the public branch (`gh-pages`)
- The live API now reflects the submitted entry.

## Parting thoughts

To be clear, this article does not attempt to revolutionize the way production APIs are built. More than anything, it takes the existing and ever-popular concept of statically-generated sites and translates them to the context of APIs, hopefully keeping the simplicity and robustness associated with the paradigm.

In times where APIs are such fundamental pieces of any modern digital product, I'm hoping this tool can democratize the process of designing, building and deploying them, and eliminate the entry barrier for less experienced developers.

The concept could be extended even further, introducing concepts like custom generated fields, which are automatically populated by the generator based on user-defined logic that takes into account not only the entry being created, but also the dataset as a whole – for example, imagine a `rank` field for movies where a numeric value is computed by comparing the `popularity` value of an entry against the global average.

If you decide to use this approach and have any feedback/issues to report, or even better, if you actually build something with it, I'd love to hear from you!<!--tomb-->

## References

- [static-api-generator on GitHub](https://github.com/eduardoboucas/static-api-generator)
- [movies-api on GitHub](https://github.com/eduardoboucas/movies-api)
- [Staticman on GitHub](https://github.com/eduardoboucas/staticman)
