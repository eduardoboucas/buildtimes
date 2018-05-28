---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/test-feature-requests.html"
layout: post
title: "Tests for feature requests"
tags:
- blog
- testing
- tdd
---
One of the biggest challenges associated with maintaing an open-source project is to deal with bug reports and feature requests. GitHub issues provide a great space for discussion between the community and the project maintainers, but even when they contain finely detailed and crystal clear information (which is rare), there's still room for miscommunication that often cause frustration on both parties.<!--more-->

When someone requests a new feature, they have in mind a concrete use case that the existing product doesn't fully cover, so they usually have a pretty good idea of what they want. For that reason, they're in the best position to define what the new behaviour of the system should be, including edge cases and implementation details like data types, formats and error codes.

This information is vital to the project maintainers or to whoever picks up the task of implementing the new functionality. If there's not enough information, someone will get stuck or — even worse — start assuming things. This often leads to an unpleasant and avoidable round of frustration.

[GitHub's issue templates](https://github.com/blog/2111-issue-and-pull-request-templates) can be used to provide requesters with a checklist of information that maintainers are expecting, but that's just a static text placeholder that can't be customised for different situations. Could we use something a bit more strict and scientific?

## A bit of TDD, perhaps?

Hopefully, the project in question has some form of automated test suite (if it doesn't, it probably should). So why not take the concept of [test-driven development](https://en.wikipedia.org/wiki/Test-driven_development), where requirements are defined as tests that are written *before* the functionality is built?

People that wish to request a new feature can be encouraged to do so by creating a pull request containing a set of test cases for the behaviour they want to see (or, at least, the skeleton of a test in pseudo-code, in cases where the test suite is not very friendly to first-time contributors or the given test case is too complex).

These tests work as *contracts* that unequivocally specify the requirements and its implementation details, including edge cases. Based on the tests, maintainers can adjust the spec before work begins, and the developers can use them as a constant evaluator of whether the work they're producing meets the requirements.

Because requesters author the test cases for the behaviour they proposed, in a way they "own" the respective functionality that their own projects depend on. This should improve everyone's level of confidence in the project, guaranteeing a good test coverage.

Are you doing something like this with your project? If so, I would love to hear about it.<!--tomb-->