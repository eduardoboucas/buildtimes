---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/microservices-3.html"
layout: post
title:  "Microservices vs. Service-Oriented Architecture"
tags:
- blog
- microservices
- nodejs
series: "Microservices and Node.js"
---
At this point, you might rightfully argue that a lot of the principles we used to characterise microservices resemble the Service-Oriented Architecture (SOA), a software design pattern that gained immense popularity in the early 2000s. Wikipedia defines SOA as:

>> A service-oriented architecture (SOA) is a style of software design where services are provided to the other components by application components, through a communication protocol over a network.<!--more--> The basic principles of service oriented architecture are independent of vendors, products and technologies. A service is a discrete unit of functionality that can be accessed remotely and acted upon and updated independently, such as retrieving a credit card statement online.

Indeed, this sounds a lot like microservices. So how do these two concepts relate to each other? Are they the same thing? Is one the evolution of the other, or are they conceived to achieve different things?

## Different motivations

SOA allows the reuse of functionality in large enterprise systems by exposing business functions as service interfaces. Other applications, typically within the same organisation, can access those functions simply by consuming these services, saving time (and money!) that otherwise would've been spent in re-implementing those functions and reinventing the wheel every time.

In fact, the original motivation behind SOA was precisely cost saving. At the time, integration was difficult and expensive, so the money saved by using service interfaces as building blocks for new products made a huge difference in the budget of an IT project.

The motivations behind microservices are substantially different. It's not guaranteed that you'll save costs by transitioning from a monolith to a microservices system; when not considered properly, this architecture could even cost you more due to the overhead in operations and automation infrastructures required. Microservices are focused on creating self-contained, deployable components that better serve and represent an organisation's business domain, aligning with it the design of the application and the structure of its engineering teams. This enables the system to move faster when it comes to integrating with new channels.

## Different goals

As Kim Clark explains in his article entitled *[Microservices, SOA, and APIs: Friends or enemies?](https://www.ibm.com/developerworks/websphere/library/techarticles/1601_clark-trs/1601_clark.html)*, there are two fundamentally different mental models one can have when looking at SOA.

The first one focuses on integration aspects, using this architecture to bridge the gap between existing systems with complex data formats and protocols by exposing them as standardised interfaces (using, for example, JSON and HTTP over a myriad of proprietary formats). From this perspective, the goal of SOA is simply to create universal adapters for different plugs to fit together. This has nothing to do with application design and therefore very little to do with microservices.

The other model sees SOA as a way to create service components, which are self-contained units of functionality that represent a specific area of the business domain, exposing business functions as meaningful interfaces for new applications to build upon. In this sense, SOA and microservices are more in line with each other and this type of implementation can even be looked at as a precursor to the microservices architecture.

## An evolution

Microservices are often seen as an evolution of the Service-Oriented Architecture. Perhaps the most important difference between them is that microservices are independently deployable units, as opposed to the services in SOA which are typically deployed as part of a larger, monolithic application.

This emerged from a natural evolution in the continuous integration and delivery tooling, as well as the rise of cloud-based and containerised environments.

SOA is also characterised by more formal and prescriptive contracts (like WSDL), which means that a simple change in the interface (like adding a new field) requires every single consumer to update its version of the contract, even if they're not interested in the change at all. Microservices take a more lightweight approach that makes it easier for services to change their interfaces without that affecting consumers.

If you're interested in dissecting the differences between the two architectures in more detail, I vividly recommend the *[Microservices vs. Service-Oriented Architecture report](http://www.oreilly.com/programming/free/microservices-vs-service-oriented-architecture.csp)* by Mark Richards.

## Next in the series

Talking about microservices by exposing the benefits and blatantly omitting the problems and potential pitfalls is unfair and irresponsible. In the next article in the series, I’ll cover some of the challenges you might face when adopting this paradigm, and some strategies you can use to get around them.<!--tomb-->
