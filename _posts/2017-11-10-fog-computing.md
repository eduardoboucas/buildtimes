---
layout: post
title:  "Explain it like I'm five: fog computing"
categories: blog
tags: fog cloud dadi eli5
---
Have you ever thought about what happens when you type an address in your web browser? Like, what actually happens behind the scenes so that a page with the content you’re looking for lands on your screen? Where is that content coming from?

As you might know, the Internet is just a massive group of interconnected computers, each of which is identified by a unique address (much like your home address). When you type the address to a website in your browser, you’re sending a message to the computer that lives on that address, asking it to send you the files with the content you’re after.<!--more--> Once the files are transferred to your computer, your browser can render them on the screen.

I wanted to mention this because I want to bust any perception that there’s something magical about the place where websites are stored – there’s not. It’s just computers, not too dissimilar from the one you’re using to read this. In fact, you can easily host a website on your computer in a matter of minutes, which then anyone that knows the address will be able to access. Hold onto this thought, we’ll come back to it later.

Having looked at the basics, let’s think a bit bigger: how do large corporations host their websites and web applications? We’re talking about sites with massive volumes of traffic and of critical availability, so surely they can’t be running from a bedroom, on the same laptops you and me use to read the news.

## Owned infrastructure (the past)

Companies solved that problem in perhaps the most obvious way possible: they got bigger and faster computers (commonly known as servers) to deliver their websites to large numbers of users, as well as super-fast Internet connections to do it in a timely manner and with high availability. So if you wanted to run a large website, your company would invest in powerful and expensive hardware, like processors, hard drives and network cards, that would physically live within your premises.

This comes with its own set of challenges. For one, you need an in-house team of people to run the day-to-day maintenance routines: replacing a hard drive, installing new equipment, updating software, etc. This is expensive.

Secondly, if you recall the process of how a web page is transferred from one computer to another, you’ll see that we have a geographical problem at hand. If the server hosting the content you want to access is located on the other side of the world, the transfer will take significantly longer than if it were just a few blocks away from your house. This means that the quality of service that someone will experience will be dependent on their geographical location, which is far from ideal. 

Finally, there’s a problem of scalability. Sure, if your site gets more traffic, you can just buy more hardware and increase connectivity – but is that sustainable in the long term? And how long does it take you to scale? Can you do it quickly enough to give your organisation the agility to adapt to traffic spikes? And what happens when traffic goes down again? You can’t easily sell the hardware to buy it back again the next time you need more capacity.

## The cloud (the present)

Cloud computing is a radically different paradigm that sets to tackle the challenges created by owned infrastructure. It abstracts the physical aspect of servers by keeping the hardware off-premises, in large datacenters owned and operated by third parties. Right away, this eliminates the need for costly in-house maintenance personnel.

With the rise of on-demand cloud computing services like Amazon Web Services, Microsoft Azure and Google Cloud, it became quick, simple and inexpensive to spin up servers in multiple locations around the world, ensuring that all users can communicate with a server that is reasonably close to them geographically, optimising load times and network latency.

The fact that these cloud computing services are effectively a virtually infinite pool of computing resources means that website owners can scale their infrastructure up and down as needed, paying just for what they use. If you get a traffic spike, you rent more computational power to ensure the demand is met, which you can then discard when no longer necessary. This paradigm is much more scalable than the owned infrastructure.

## The fog (the future?)

In less than a decade, cloud computing went from being a novelty concept to becoming the norm, as nowadays companies that still choose to own their infrastructure are certainly an exception. The flexibility, resilience and especially the reduced running costs are very attractive to many organisations, but it does raise some fundamental questions about the founding principles of the Internet itself.

By design, the Internet is naturally decentralised – global mesh of interconnected computers where any individual can make content available to anyone, and equally consume content from anyone, in a democratic way. But with the dominance of cloud computing services, that balance was somewhat compromised, as we have a handful of large organisations holding the vast majority of the content in the network.

Remember how we established in the opening paragraphs that you can easily host your website on your own computer? What if you also hosted your friend’s site, and the site for a company that’s halfway across the world? And what if that same company managed to have people in every capital city in the world doing the same, so that anyone trying to access the content could get it from an optimal location?

This is the core principle behind fog computing, whereby the consumers of the network can also be the providers, lending their spare bandwidth and computational resources to the delivery of someone else’s content. This reestablishes the balance of a decentralised system and democratically redistributes the power by the members of the network.

{% include helpers/image.html name="fog-computing.png" caption="Illustration of fog computing" %}

As a result of the shorter distance between the resources and their consumers, data takes less time to be passed around, making room for real-time applications in the true sense of the term – as opposed to the questionable use of the terminology to describe applications which, depending on the conditions of the long network hops involved, may take a considerable amount to respond. 

The reduced bandwidth requirements also mean a dramatic reduction of costs when compared to traditional cloud services. And because the members of the network are also providing the content, it’s viable to establish a model whereby people like you and me can get paid for their spare computational resources. In plain words, this means you could sit at home browsing a site, whilst at the same time getting paid to deliver some other site to the rest of the network. 

## Are we there yet?

I’m working on a fog computing platform at [DADI](https://dadi.cloud), expected to launch in Q3 2018. It allows anyone to rent their computational resources, becoming what we call *miners*. It’s based on concepts like blockchain and cryptocurrencies, which I’ll cover in a future article. 

For now, head to [https://dadi.cloud](https://dadi.cloud) to learn more and take part. <!--tomb-->