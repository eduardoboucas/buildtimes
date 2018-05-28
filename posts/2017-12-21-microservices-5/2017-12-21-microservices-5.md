---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/microservices-5.html"
layout: post
title:  "Microservices + Node.js"
tags:
- blog
- microservices
- nodejs
series: "Microservices and Node.js"
---
We covered the basic principles of a microservices architecture, but we'll also look into the practicalities of implementing it from a technical standpoint. As we've seen, microservices are agnostic of technology, so you could use any programming language or environment to build them. In this article we'll see why JavaScript — and the Node.js environment in particular — is a good candidate.<!--more-->

## A primer in Node.js

In plain words, Node.js is JavaScript on the server. It's an open-source, cross-platform JavaScript runtime environment that interprets JavaScript using Google Chrome's V8 engine. Characterised by an event-driven, non-blocking I/O model designed to build scalable network applications, it provides first-class support for low-latency HTTP agents and real-time communication on the web.

Through its built-in package management system — the Node Package Manager (NPM) — developers can choose from thousands of publicly available modules to use as building blocks for their applications, similarly to how gems work in the Ruby world. Discoverable on the [NPM website](https://npmjs.com), modules and their tree of dependencies can be installed and updated using the bundled command-line interface (CLI) tool.

## Why Node.js?

We established that microservices are agnostic of technology, so you could use any programming language or environment to build them. So why Node.js? Is there anything about it that makes it a particularly good tool for building microservices?

[The Node Way](http://thenodeway.io/) provides some great insights into the key philosophies and characteristics of Node.js, so let's have a look into some of them and see how well they align with the principles of microservices.

### Building modules to serve a single purpose

>> Building small, single-purpose modules is at the heart of the Node.js philosophy. Borrowing from Unix, Node.js encourages composing the complex and powerful out of smaller, simpler pieces. This idea trickles down from entire applications (using the best tool for the job vs. a full suite) to how the tools themselves are built.

In his book Building Microservices (O'Reilly), Sam Newman observes that microservices should be small and focused on doing one thing well. In the same way that small, single-purpose services can be composed to form a complex system, a Node.js application can be built by piecing together small, single-purpose modules (whether they're built in-house or created by the open-source community).

This symbiosis between the language and the architecture allows for some interesting development workflows. For example, you might start by creating a component as a shared Node module and later transform it into a service, with minimal refactoring required on its consumers.

### Complexity via composition

>> Separating development across the ecosystem requires some careful design considerations. Successful use of inheritance, for example, requires a full understanding of a parent class implementation. This poses a problem for NPM modules, since implementation details can change across modules at any time. This reality has shifted design to favor Composition. By interacting with the interface and avoiding the implementation details, you can compose complex tools without worrying about the lower-level details of each piece.

Let's revive the example of an application where one microservice manages customer accounts and another that does postcode lookups. The former can use the latter by issuing a network call with the postcode it wants to see resolved, obtaining a response with the address in return. If we make an analogy with object-oriented programming (OOP), it's fair to say that this pattern resembles [composition and not inheritance](https://www.thoughtworks.com/insights/blog/composition-vs-inheritance-how-choose), since the Customers service makes use of an instance of the PostcodeLookup service to obtain a result, rather than inheriting from it methods to do the postcode look up itself.

Similarly, composition is favoured over inheritance in Node.js, which allows modules to change their internal implementation details without that affecting the public interface (API) that is exposed to consumers.

This is a strong requirement of loose coupling, one of the key principles of the microservices architecture.

### Asynchronous

>> Instead of waiting around and doing nothing every time an API call or file read/write occurs, Node is able to keep busy handling other requests while it waits for a response.

If the communication between services is synchronous, the calling service is blocked and unable to do anything else until a response comes back from the called service — if a response never comes back, the service might be left hanging indefinitely. This introduces tight coupling, as one service now fully relies on the behaviour of the other to function properly, and breaks the principle of resilience since a failure in one service can affect others.

Also, because both the calling and called services will be busy and unable to process any other jobs until the full request-response cycle is complete, the system has scalability problems. 

For these reasons, asynchronous communication is preferred in a microservices architecture. With this pattern, the calling service sends a request and continues with other (potentially unrelated) tasks. The called service listens for requests and processes them as it sees fit — it can serve them on a first-come, first-served basis, implement custom prioritisation rules or even put them in a queue to be processed at a specific point in time. When the request is processed and the response is ready, the called serve can either send a callback or wait for the calling service to poll for an update.

This pattern is also the most important and notorious principle of Node.js. Rather than running a function synchronously and waiting for it to return before proceeding to the next instruction, tasks are run asynchronously using callback functions, Promises or async/await patterns to resume the flow of the program when they complete (or abort).

### Use the best tool for the job

>> Smaller tools benefit from the singular focus and independent release cycles, and can be easily swapped out without a complete application re-write.

The fact that microservices are agnostic of technology means that developers can always build new products using the best tools, regardless of whether the programming language or tech stack they're built with are the same as the ones used in an existing system. And because they're small, focused components, they're relatively easy to replace (or even rewrite) with minimal impact on dependants.

Node modules share the very same principle. Small and focused modules are easy to swap with minimal effort and refactoring required. Updating individual modules is as simple as running npm update and with support for semantic versioning baked in, it's easy to update modules in bulk whilst ensuring no breaking changes are introduced in the process.

### Services vs. modules

As we saw, the philosophies and best practices of a Node.js application are tangled with the principles of a microservices architecture. In particular, Node modules — just like microservices — should be small, independent components focused on doing one thing well. So how do these two concepts differ? How do you decide when to build something as a module or as a service?

By implementing functionality as a module, you lose the technology agnosticism. With communication happening at the process level, you can't have a Python application using a Node module (at least not without some sort of proxy), so right away you're imposing a particular technology on any component that wishes to use that functionality. This problem is mitigated if the functionality is built as a service, since all communication takes place via decoupled network calls.

Modules can also compromise the principle of resilience observed in microservices. If a module that is used by different parts of a system fails, the absence of any bulkheads can cause a cascading failure, difficult to contain.

On the other hand, modules are easier to implement. Whereas services need to be deployed independently and therefore require their own testing and deployment infrastructure, using a module is as simple as running a npm install and summon the module by its name with a require() call in the code.

As a general rule of thumb, if the functionality is specific to the business domain, it's probably a good idea to build it as a service. I've seen cases where shared modules were being used to communicate between services, which violates encapsulation and leads to tight coupling between services. And in some cases, as we described before, it might be wiser to not share functionality at all, even if it means repeating (a reasonable amount of) code.

Both approaches have their own merits and pain points, and the decision to opt for one or the other needs to be made on a per-case basis. It's also something that can evolve as the system grows in size and complexity, as you could start by building a component as a shared module and turn it into a service at a later stage.

## Summary

In this series, we started by looking at traditional software design patterns, in particular layered monolithic applications, and listed some of the associated challenges and limitations. We then introduced microservices as an architecture that promotes the development and deployment of applications as a suite of autonomous services characterised by the following principles:

- Technology agnostic
- Modelled after business domain
- Smart endpoints, dumb pipes
- Loosely coupled, highly cohesive
- Independently deployable
- Resilient
- Scalable
- Highly automated

We looked at how microservices can address some of the issues observed in a monolithic application and how empowering small, autonomous and highly specialised teams can allow an organisation to move faster and in a sustainable way.

We also compared microservices with the older Service-Oriented Architecture (SOA) and saw how the former can be seen as an evolution of the latter, fuelled by new tooling around continuous delivery, containerisation and cloud-based environments.

As well as outlining the benefits of microservices, we looked at the downsides and some of the common pitfalls of this architecture, namely around the complexity of distributed systems, overhead in operations and added complexity in testing, deployment and security.

Finally, we saw an overview of the characteristics and best practices of Node.js and looked at how the symbiosis between this environment and the microservices architecture makes them a great technology match.<!--tomb-->
