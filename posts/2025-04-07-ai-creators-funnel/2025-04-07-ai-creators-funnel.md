---
layout: post
title: "AI and the creator's funnel"
categories: blog
tags:
- blog
- ai
---
Software generated entirely by AI is not an hypothetical future — it's [a reality today](https://arstechnica.com/ai/2024/10/google-ceo-says-over-25-of-new-google-code-is-generated-by-ai/). I don't think it's an overstatement to say that this is the largest shift in the history of this industry, unravelling before our eyes at an astonishing pace.

As a professional software engineer, I've been closely watching this change and taking my time to gather my thoughts on what this means for my profession and for the world. This is my first shot at putting those into words.<!--more-->

## A question of identity

Over 20 years ago, before my personality and view of the world were even fully formed, I came across something that would change my life forever: I started writing code. For the 13-year old me, programming had absolutely nothing to do with career aspirations or entrepreneurship — it was the raw joy of solving a puzzle, of pushing myself to learn something new, of bending a machine to my will and make it materialise an idea that didn't exist anywhere in the universe other than in my own imagination.

Since that day, I've been on an incessant journey to master this _thing_ that feels equal parts science, art and witchcraft. I went to school and university for it; I made it my profession; I travelled the world and moved countries because of it; it gave me countless friends and memories that I cherish.

More than something I do, writing code is a big part of who I am.

## Preemptive nostalgia

I take joy from different aspects of writing code on a daily basis: writing some tests and seeing them pass for the first time, dissecting the root cause of a gnarly bug, or coming up with an elegant solution for a seemingly impossible problem (and always patting myself on the back for it).

The realisation that computers can now perform these tasks in a fraction of the time it takes me is unsettling. It's impossible not to ask: will AI replace me?

Unlike the 13-year-old me, I no longer view programming as just a puzzle. As I honed the craft of being a software engineer, I developed other skills. I learned how to connect with people from different disciplines and translate their needs into technical requirements; how to solve problems in alignment with the vision and strategy of an organisation; how to balance competing priorities and adapt plans accordingly; and how to coach team members while promoting a culture of growth and knowledge sharing.

> The emotional part of me feels a deep sense of preemptive nostalgia about something dear that is about to change forever

My work reflects the sum of every problem I've solved as a human throughout my life, and I don't think AI will replace that just yet.

But there are aspects of my job that will likely change forever. As computers start writing more of the code, I expect the moments of joy I mentioned earlier to become few and far between.

The emotional part of me feels a deep sense of preemptive nostalgia about something dear that is about to change forever, whereas my rational side sees this shift as a normal cycle of evolution and adaptation — and trusts that I'll be able to find that joy in new places.

## Looking at the bigger picture

As I let those feelings simmer, I wanted to take a step back and look at software as more than just something that I enjoy creating; it can also be a force for good with a profound impact on people’s lives. 

Case in point: software that helps patients with chronic diseases. Healthy bodies have an incredibly powerful device — the pancreas — that takes care of continuously producing the right amount of a hormone called insulin, which converts sugars from food into the energy that powers the body. It’s a vital process.

People with type 1 diabetes saw their pancreas failing abruptly and unexpectedly at some point in their lives. To stay alive, they must take on the role that their pancreas once had and administer that insulin themselves. It's hard to overstate how difficult it is to figure out the right amount of insulin to take and when to take it, multiple times a day, every single day.

Technology can't solve this, but it sure can help. [Nightscout](https://github.com/nightscout/cgm-remote-monitor) is a web-based Continuous Glucose Monitor (CGM). It's open-source software that allows patients and their caregivers to view glucose data in real time, and to receive alarms for abnormally high or low blood sugar values. These alarms save lives.

The [Open Artificial Pancreas System](https://openaps.org/) (OpenAPS) is an open-source project that connects a small computer to a CGM and an insulin pump, automating the delivery of insulin to patients, mimicking to some degree what the pancreas would normally do. One third of people using OpenAPS are children, for whom managing blood sugar levels is especially challenging.

These are just a couple of examples of how community-built software can make a real, positive impact in people's lives. There are many other examples like this that apply to different conditions and situations — this is the story that hits closest to home for me, because as a type 1 diabetes patient I've experienced this impact firsthand.

As I zoomed out from my own experience and focused on programming as a means to achieve a larger goal, I began to ask myself how AI might push that even further.

## The creator's funnel

I kept thinking about these amazing projects and started wondering how they came to life; how the seed of an idea actually materialised into something positive for the world. Every project is different, but I think the process can be broadly broken down into the following phases:

1. **Identify**: Identify a problem worth solving or an opportunity worth chasing
1. **Conceptualise**: Plan and shape a viable solution to address the problem
1. **Build**: Execute the plan and turn the idea into something real and functional
1. **Distribute**: Get it into people's hands

For example, you might *identify* the pain of managing type 1 diabetes, *conceptualise* an interface that lets patients access glucose data with ease, *build* an application that shows that data in real time and provides alerts on abnormal values and, finally, *distribute* it as a web application.

But these phases don't form a linear path that every creator follows in the same way; they're more like a funnel, where fewer and fewer ideas reach the next stage of the journey. Not everyone who can identify a problem is able to conceptualise a solution; not everyone who can conceptualise a solution has the skills or the means to build it; and not everyone who manages to build a product knows how to distribute it.

{% include helpers/image.html name:"creators-funnel.png" caption:"Fig 1. Illustration of the creator's funnel" frame:false %}

This means that the amazing projects we see today don't represent all the creators, the ideas, or the potential out there — they're just the ones that made it through the creator's funnel. A classic case of [survivorship bias](https://en.wikipedia.org/wiki/Survivorship_bias).

> By reducing the distance from idea to reality, we have a unique opportunity to harness more human ingenuity than ever before.

What if AI can completely disrupt this? It's now possible to generate a fully working application simply by describing what it should look like and what it should do. No technical background, no budget, no need to assemble a cross-disciplinary team just to prove an idea. Within minutes — not days, weeks, or months — anyone can prompt their idea into existence.

AI has the power to transform this funnel into a portal that everyone can walk through, democratising access to resources that were once completely unattainable for millions of creators with life-changing ideas waiting to be uncovered. By reducing the distance from idea to reality, we have a unique opportunity to harness more human ingenuity than ever before.

## Parting thoughts

We're collectively embarking on a journey with no clear idea of where it leads. Yes, my job will change in ways I still do not fully understand and some parts of it that I've grown to love may not be around for long.

But I realised that by focusing on the small pleasures of writing code, I was missing the forest for the trees.

I've been working in the developer tooling space for over a decade. I fell in love with the idea of building for developers, of lowering the barrier of entry for tools and technologies that empower them to do their best work.

What better example of that than enabling millions of creators to add their voices to the conversation?

Computer scientists, hackers, tinkerers, and vibe coders: it doesn't matter where you come from, I'm just excited to see what you build.<!--tomb-->
