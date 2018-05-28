---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/microservices-4.html"
layout: post
title:  "Microservices: not a free lunch"
tags:
- blog
- microservices
- nodejs
series: "Microservices and Node.js"
---
By now you should have a fairly good understanding of what microservices are and the problems they solve. Many organisations, big and small, have done incredibly positive transformations off the back of this architecture. But there is also the other side of the coin and it would be irresponsible to write about the wonders of microservices without also covering the complications they can bring. When implemented poorly, or when done for the wrong reasons, this architecture can create more problems than the ones it solves and quickly result in disaster.<!--more-->

Let's look into some of the common pitfalls of microservices.

## A new pattern

More than a technology change, building a system with microservices is a big shift in architecture, development and operations. It requires people, some of whom have probably been building monolithic systems for many years, to drastically rethink how to compose functionality, the methods they use to communicate and the way they approach testing and deployment. That's a lot to ask!

Microservices have been around for a while (even if with different names), but there's still not a widely recognised formal definition and some of the best practices associated with the architecture are far from being known to everyone. As such, you're likely to find members of the same team with radically different views on how services should be implemented, as well as people that are completely against the idea of using microservices in the first place! Dealing with this friction while at the same time empowering teams with more autonomy in order for them to take full ownership of their services can be a difficult challenge.

People with experience in monolithic applications tend to do [Big Design Up Front](http://agilemodeling.com/essays/bmuf.htm), meaning that most (if not all) of the design is completed before the development starts. Adopting a microservices mindset, where different teams can work concurrently on independent services, is quite a big shift.

It's also easier to make big mistakes in a microservices system, since the criteria to define the boundaries and responsibilities of services are often not obvious and require research and experience. It's important that teams are well informed about the core principles of the architecture and well equipped to steer away from the common pitfalls, not just in an initial design phase but throughout the entire service lifecycle.

## Distributed systems are hard

Microservices imply a distributed system and consequently inherit a variety of difficult challenges associated with that model. L Peter Deutsch and James Gosling drafted a list of 8 false assumptions that software architects and engineers new to distributed systems are likely to make, famously known as [the fallacies of distributed computing](https://blog.fogcreek.com/eight-fallacies-of-distributed-computing-tech-talk/). The first of those fallacies is that the network is reliable.

It's only safe to assume that the pipes connecting our services – the network – are unreliable and will eventually break, leaving us with network partitions (i.e. one or more services getting detached and unable to communicate with the rest of the system). When this happens, services could be broadcasting and processing stale data to unaware consumers. This is a consistency problem very common in distributed systems.

When an operation needs data to be processed by more than one service, you're looking at a scenario where one of the services can fail and the other succeed, which might persist a partially-complete operation and also leave the system in an inconsistent state. A typical example of this is the transfer of funds from one bank to another, which involves debiting one account and crediting another. If only one of these operations succeed, it's easy to see how the inconsistent state the system is left in can pose a big problem. This is a very common and studied problem in distributed systems.

The second fallacy of distributed computing is that latency is zero. Imagine an update request to service A that modifies an entry and a subsequent get request to service B that reads it. Even though the update process was completed successfully, the change takes some time to propagate to service B (as it's done over the network), which causes the service to deliver an outdated version of the data for a short period of time. This problem is known as eventual consistency.

Products like a [message broker](https://github.com/dadi/queue) are a good way to execute important and atomic operations in a more robust way.

## Brittle walkways

By physically separating functionality into services and replacing in-process calls with network requests, we aim for resiliency. We weaken the walkways between services so that if one crumbles down, the others can still stand. This comes with an obvious problem, though: we're now depending on fragile connections for all the communication between services.

As established above, computer networks are brittle and will fail – a question of when rather than if – so it's imperative that systems built with microservices are designed for failure. This new and omnipresent point of failure is something that architects have to bear in mind from day one and engineers need to consider throughout all phases of the product lifecycle. This is hard and requires learning, guidance and adaptation, as it represents a paradigmatic change for a lot of people.

There are some techniques to help mitigate this:

- Healthy timeout policies ensure that the system will not be waiting for too long when a dependent service is taking too long to respond, potentially accumulating a large number of requests and causing delays to the entire system. In these situations, it’s best that the service reports a failure after a reasonable amount of time, so that consumer services can adjust accordingly in a timely manner.
- When building dependencies between microservices, always plan for failure. This includes things like error handling and fallbacks, ensuring that service A won’t fail miserably if service B becomes unavailable. These are usually called *bulkheads*.
- To prevent a network failure from spreading to other services, a [circuit breaker](https://martinfowler.com/bliki/CircuitBreaker.html) can be used. Similarly to electric circuit breakers, they will trip when the service fails for a certain number of times, and will respond immediately with an error status to any subsequent requests for a certain period of time.

## Operations overhead

Deploying a monolithic application is usually relatively simple, regardless of its size. In a lot of organisations, developers don't need to get anywhere near the operations area, as they simply throw their monolith application over the wall to an ops team who takes care of provisioning the infrastructure and pushing to production. It's a single application running on a programming language and environment that has probably been used in the company for a while, so the operations team can probably take ownership of deploying and monitoring the application.

This landscape immediately changes with microservices, though. We might be looking at dozens (or even hundreds) of services to deploy, possibly in many different languages and environments. The added complexity of ensuring all these processes stay up and performant, don't deadlock or run out of disk space demands a whole lot more from the operations infrastructure.

## DevOps challenge

With such complexity, vertically scaling the ops team to meet the new requirements won't cut it. Instead of throwing their applications over the wall to another team, developers should start taking ownership of the entire lifecycle of their applications, including provisioning, deployment, monitoring and even some degree of support.

Engineering teams at Amazon are famous for their notion of *«you built it, you run it»*, bringing developers into contact with the day-to-day operation of their applications. Martin Fowler uses the phrase *«products, not projects»* to describe this pattern, meaning that the relationship between developers and the software they write should be ongoing and not stop at the moment it's considered ready for release.

This shift in responsibilities requires engineering teams to be operationally focused and production aware, which puts pressure in the hiring process. Developers with a strong DevOps profile are harder to find and usually more expensive, so these are challenges that should not be dismissed when considering the adoption of microservices.

## Boundaries turn into moats

We now know that in a system built with microservices, large teams that are horizontally formed based on areas of technical expertise (for example front-end team, back-end team, database team) tend to give way to smaller, cross-functional teams that are specialised in the area of the business domain associated with the service or services they own. Whilst this is essential to guarantee lean and autonomous teams, it's important to ensure that teams don't take the ownership of their services to an extreme.

I've seen cases of teams losing sight of the bigger picture and focusing exclusively on the quality of their own services, neglecting the overarching goal that is the success of the system as a whole. This is often caused by teams losing interest in helping other teams with their services when needed. 

With time, they can become so detached that it's very difficult to re-establish collaboration between people. When that happens, teams can start holding other services responsible for blockers in their workflow, even though in theory they are completely independent. At this point, we're back to developers throwing their software over the wall — except this time, rather than a large team throwing a monolith to the operations team, we've got dozens of small teams throwing services to each other.

The solution to these issues varies a lot with the size of the organisation and the nature of the teams, but ensuring good communication between teams always goes a long way. When it's not practical for everyone in a team to interact daily with the wider organisation, designating a liaison on each team to communicate with others might be a good solution.

In general, we're looking for a good balance between a horizontal structure that empowers teams with autonomy and a hierarchy with a group of people tasked with ensuring all moving parts are fine-tuned to work together without friction.

## Contracts

When you break a system into multiple collaborating services, you expect them to communicate and understand each other, which means that they all need to agree on the syntax and semantics of the messages being exchanged. These agreements are called interfaces (which an Application Programming Interface, or API, is an example of) and effectively act as contracts between services.

And it's not like interfaces are specific to microservices. Monolithic applications usually have, if nothing else, some form of (graphical) user interface, which is a contract of expectations with the end user. But in a microservices architecture, they exist in a much larger number and in places where the monolithic equivalent would be an internal, hidden entity.

For example, let's imagine a customer page holding information like the billing and shipping addresses. Instead of manually filling in each line of an address, users have the option to insert their postcode and have the application do a lookup and suggest the corresponding full address.

In a monolithic application, this postcode lookup functionality is a purely internal entity, completely opaque to the end user and surrounding systems, even if it's built as a shared module used in multiple parts of the application. Because it doesn't exist to the outside world, you could change its implementation as much as needed and you'd still only need to update and deploy the one monolithic application.

With microservices, you might want to break the postcode lookup functionality into its own service, at which point you have a public interface. Any changes to it will need to be made aware to all consumers, which may need to make changes on their side. When done poorly, this can force multiple services to be deployed together, violating the principles of independent deployment and loose coupling and effectively defeating the benefits of a microservices approach.

Formal documentation, possibly through consumer-driven contracts, help solidify the APIs used by the various parts of the system. It’s also important to make sure that any breaking changes are introduced carefully; endpoint versioning is usually a good way of allowing new functionality to be introduced whilst keeping previous interfaces available for consumers to use throughout an agreed transition period.

## Duplication of effort

One of the biggest challenges with a microservices architecture is deciding which parts of the system become their own service. Blindly taking any piece of shared functionality and turning it into a service is totally the wrong approach. First of all, you should model the services after the business domain, not based on technical factors that will lead to low, logical cohesion. Also, you might end up with services that are too granular and risk getting drowned in the overhead they create.

So how do you deal with a piece of logic that needs to be used by multiple services? Sometimes building a new service is inadequate, and other decompositional techniques do have their place. You could build a shared library that each service can use, but you risk introducing tight coupling between them.

Depending on the situation, it might be wiser to simply duplicate the logic in the various services that need it, as the benefits of keeping services truly decoupled and with a healthy size can outweigh the downside of repeating code.

There's no one-size-fits-all solution for this problem as a series of factors will determine the best solution for each specific scenario. In any case, this is a question introduced by the microservices architecture that needs to be answered when designing the system.

## Next in the series

In the next article, we’ll look at actual tools to bring microservices to life. In particular, we’ll look at why you should consider Node.js when looking for a programming language and environment to build your next microservice.<!--tomb-->
