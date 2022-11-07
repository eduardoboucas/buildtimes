---
layout: post
title: "Publishing Deno modules on Netlify"
categories: blog
tags:
- blog
- deno
- javascript
- netlify
---
Runtimes like Node.js rely on a package manager and a registry to install and distribute modules, but Deno has a different spin. It allows developers to import modules directly from a URL, which can be hosted on a CDN, your own server, or really anywhere on the web.

This level of flexibility brings infinite options, so I started looking for the best workflow to release modules in this new paradigm. This article describes the solution I landed on — one that works for solo open-source developers or large development teams in the enterprise world.<!--more-->

Here's the gist of it:

- The source code lives in a [GitHub](https://github.com/) repository
- Releases are automated using a combination of [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) and [Release Please](https://github.com/googleapis/release-please)
- The repository is connected to a [Netlify](https://www.netlify.com/) site, which is responsible for serving the modules in version-locked URLs, protecting private modules, serving documentation pages, and a few other niceties

Let's get started.

## Setting up

The first step is to create a GitHub repository with a few things:

- A JavaScript or TypeScript [entry point](https://github.com/eduardoboucas/deno-module-template/blob/044583aadf14e2842e098669fdc230fd139710dc/src/mod.ts) for the module. This is the file that people will import into their applications.
- A [workflow file](https://github.com/eduardoboucas/deno-module-template/blob/044583aadf14e2842e098669fdc230fd139710dc/.github/workflows/release-please.yml) for Release Please, which will automate the release process using GitHub Actions.
- A [Netlify Build Plugin](https://github.com/eduardoboucas/netlify-changelog-redirects) for generating redirects to version-locked URLs.
- A Netlify [configuration file](https://github.com/eduardoboucas/deno-module-template/blob/044583aadf14e2842e098669fdc230fd139710dc/netlify.toml), setting the right directories, build command, and response headers.

Next, we [connect the repository to Netlify](https://docs.netlify.com/welcome/add-new-site/).

Alternatively, you can use the button below to create everything with one click.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/eduardoboucas/deno-module-template)

Finally, we can change the site name to something a bit more memorable. You can do this by going to _Site settings_ > _General_ > _Change site_name_. I picked `deno-greeter`.

We're now ready to use the module in a Deno program.

```shell
$ deno repl --eval "import { greet } from 'https://deno-greeter.netlify.app/mod.ts'"
Download https://deno-greeter.netlify.app/mod.ts
Download https://deno-greeter.netlify.app/greetings.ts
Deno 1.24.3
exit using ctrl+d or close()
> greet("Jane")
"Good morning, Jane!"
>
```

## Versioning

We could start using our module as is, but we're missing an important part: versioning.

If we want to release a new version that introduces breaking changes, consumers should be able to decide whether and when to update their code.

Unlike Node.js, Deno does not use a `package.json` file to pin dependencies to specific versions. Instead, the import URLs themselves are expected to point to an immutable version of the module. When the code changes, the URL must also change.

We can achieve this pretty easily with Netlify, as you can configure your site to create a new deploy when a new Git tag is published. If we then configure Release Please to create a new tag for every release, we'll get distinct URLs for each new version of the module.

To do this, open the Netlify dashboard and navigate to _Site settings_ > _Build & deploy_ > _Branches_ and select _All_.

{% include helpers/image.html name:"deploy-configuration.png" caption:"Configuration of branch deploys in Netlify" %}

To test the release flow, make some changes to the module code, push a commit using the `feat:` prefix, and open a pull request. Once you merge it, Release Please will create [a release pull request](https://github.com/eduardoboucas/deno-greeter/pull/1) automatically. Merging it will complete the release.

If you go to the _Deploys_ page of the Netlify dashboard, you'll see a new deploy in progress. Once it finishes, you'll see that `deno-greeter` is available at [https://deno-greeter.netlify.app/1.0.0/mod.ts](https://deno-greeter.netlify.app/1.0.0/mod.ts) — this is an immutable URL that points to version 1.0.0 of the module, and will be unaffected by future versions.

This process will happen automatically for every new pull request that you merge. New versions of the module will respect [Semantic Versioning](https://semver.org/) and will be inferred automatically from the Conventional Commits convention prefixes used in your commits: 

- `fix:` will generate a patch version
- `feat:` will trigger a minor version
- `feat!:` signals a major version with breaking changes

## Private modules

The current setup works great for public modules, but you might want to restrict access to our module to people with the right credentials. This is a very common scenario in an enterprise setting, where teams of developers want to share common pieces of proprietary code without making it accessible to the outside world.

To do this, we can leverage Netlify's [password protection feature](https://docs.netlify.com/visitor-access/password-protection). We start by creating a `_headers` file in the `src` directory with the following contents.

```text
/*
  Basic-Auth: janedoe:supersecret123
```

This protects your site with a username and password combination, leveraing [basic HTTP authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#basic_authentication_scheme).

To use the module in their applications, consumers must set a `DENO_AUTH_TOKENS` environment variable with the right credentials when running Deno CLI commands.

```text
DENO_AUTH_TOKENS=janedoe:supersecret123@deno-greeter.netlify.app
```

You can read more about [private modules in Deno](https://deno.land/manual@v1.27.1/linking_to_external_code/private) and explore [more advanced authentication mechanisms](https://docs.netlify.com/visitor-access/role-based-access-control/) offered by Netlify.

## Documentation site

Using a full-fledged website deployment platform to host your modules comes with a few extra perks. For example, if you want to create a documentation site for your project, you don't need any additional configuration or tooling. You can place the HTML files in the `src` directory and Netlify will serve them on the same URL.

If you want to something like [Docusaurus](https://docusaurus.io/) to build your docs, or even a full-fledged web framework like Gatsby or Next.js, you totally can.

And because the site is deployed alongside the module's code, they will be versioned together. So if someone is using version 1.0.0 of your module, they can find the documentation for that specific version at [https://deno-greeter.netlify.app/1.0.0](https://deno-greeter.netlify.app/1.0.0).

## Hosted version

Because we're using a Netlify site, we have a series of primitives at our disposal, including [Edge Functions](https://docs.netlify.com/edge-functions/overview/).

Edge functions are themselves based on Deno, so we can easily write one that imports our module and uses it to produce a response to an HTTP call. This lets us create a hosted version of our module, which applications can interact with by issuing an HTTP request rather than an in-memory import.

This can work as an alternative interface for applications that are using another JavaScript runtime or a different programming language entirely.

```typescript
import { greet } from "../../src/mod.ts";

export default async (req: Request) => {
  const url = new URL(req.url);
  const name = url.searchParams.get("name");
  const greeting = greet(name);

  return new Response(greeting);
}
```

By deploying this edge function, `deno-greeter` can be accessed at [https://deno-greeter.netlify.app/api?name=Jane](https://deno-greeter.netlify.app/api?name=Jane).

## Parting thoughts

This is admittedly not be the most impartial technical piece ever, since [I work at Netlify](/about). I did start from the premise of finding the best workflow _for me_, and I tend to favour the tools that I enjoy using. So while there are many options out there, I struggled to find one that packs this much functionality with such simplicity.

With the "this is not a Netlify marketing piece" caveat out of the way, I would love to hear about the workflow that works for you. If you end up using the same as mine, definitely [hit me up](https://twitter.com/eduardoboucas!<!--tomb-->