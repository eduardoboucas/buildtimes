---
layout: post
title:  "What is an API?"
tags:
- blog
- api
- rpc
- rest
- graphql
---
Google Calendar API, Google Maps API, Twitter API, GitHub API, jQuery API, React API, the DOM API. Is everything an API? What _is_ an API and how can it be such an ubiquitous concept, present in such a diverse range of platforms and technologies?<!--more-->

Most applications and devices we use every day have some form of interface that is conceived for the interaction with humans. That may be in the form of graphical elements on a website or mobile app, conversational text on a chat bot or even the sound of a synthesised voice on a digital personal assistant. The common link between these is that they were all built and optimised for the human sensory system.

## Human vs. machine

But there is a different type of interface, one that is built for interaction with other programs or machines. That is an API – an Application Programming Interface (with _Programming_ being the key word).

Some applications have an API as their only interface, when their sole purpose is to be used as building blocks by other programs – like the jQuery API, the React API or the DOM API. Others have an API in addition to a user interface, which is like a restaurant having a seating area for customers on foot and a drive-through window for people in cars – it’s the same application, generally handling the same content, but made available to different types of consumers in the way that is most convenient to them.

That’s why you open Google Calendar in your browser when you want to check what your diary looks like for tomorrow, but instead you use the Google Calendar API if you want to write a program that retrieves that information programmatically.

But isn't it be possible to create a program that is smart enough to interact with a standard user interface (one designed for humans) and avoid the hassle of building and maintaining a separate interface? Yes, it is, just like it’s technically possible for a pedestrian to order food from the drive-through window, and for a skillful motorist to drive right to their reserved table at the restaurant – it’s just not the best tool for the job.

It’s extremely difficult for a computer program to match a person’s ability to interact with an interface that was built for humans, and even more difficult is for it to adapt to change in the same way that a human does. This brings us to what I consider to be the two most important aspects of an API, and what sets them apart from a user interface: the format and the contract.

## The format

The format is the set of technologies and languages used by the application to interact with the consumer. Since the consumer is a machine, requests and responses must be formatted in a way that is optimised for machines – sign language, songs or poetry are interesting ways for humans to communicate with each other, but not so efficient when it comes to machines.

## The contract

The contract is what assures developers that an API will continue to respond to their application’s requests in a consistent way. You see, if on a graphical user interface a light green button on the top-left corner changes to a dark green button on the bottom-right corner, most people will instinctively adapt and continue using the application without any instructions or assistance.

Programs are a bit more strict. If an API changes the word `tomato` to `tomAto` without giving consumers the opportunity to update their code, entire applications can potentially break.

Contracts are a way for APIs to announce what exactly they produce and what they receive; as long as developers are following the rules that were established upfront, things will continue to work the same way.

## API paradigms

So how do you build an API? Is there a specific set of technologies and tools that you must use? Not really.

As long as you use an appropriate format and put a contract in place, you can use whatever programming paradigm, language and technology stack you want – even a static JSON file on a server can work as an API, if documented and published properly.

There are, however, some guidelines and specifications that apply to Web APIs, which are APIs that connect a server and a client over the web using the HTTP protocol. These are merely recommendations on things like naming conventions, what endpoints (URLs) to expose and how to convey success and error states. 

### RPC

The earliest paradigm was RPC (Remote Procedure Call) which basically works as a function that is executed on a remote server. If you wanted to create an RPC API for adding, editing and removing articles, you’d have an endpoint at `/getArticles` for retrieving items, `/addArticle` for creating, etc. Like an in-memory function, each RPC endpoint can accept any number of arguments. 

### REST

A more popular and flexible alternative is REST (REpresentational State Transfer) and it works by representing entities as resources. In our example from above, an article would be a resource, represented at `/articles`. To interact with this resource, the client is expected to use one of the available HTTP verbs to indicate the type of operation – `GET` for reading, `POST` for creating, `PATCH` for updating and `DELETE` for deleting.

REST is characterised by utilising HTTP features whenever possible, like verbs, headers and status codes.

### GraphQL

A more recent paradigm that has been gaining a lot of traction is GraphQL. Unlike RPC or REST, GraphQL exposes a single endpoint for all interactions, relying on a custom query language (akin to SQL) to tell the server exactly what data to get and in what structure. It’s possible for a single query to retrieve data from multiple collections of documents and automatically resolve the relationships between them.

GraphQL has a strong focus on performance, allowing consumers to receive only the fields they require (although this behaviour is sometimes falsely portrayed as exclusive to GraphQL, but [REST supports it too](https://jsonapi.org/format/#fetching-sparse-fieldsets)).

## Wrapping up

We've established that an API is just another type of interface, but one with a specific _format_ and a very strict structure (the _contract_). If you're thinking about building one, [this article](https://swagger.io/blog/api-development/how-to-build-an-api/) by Nicole Sievers.<!--tomb-->
