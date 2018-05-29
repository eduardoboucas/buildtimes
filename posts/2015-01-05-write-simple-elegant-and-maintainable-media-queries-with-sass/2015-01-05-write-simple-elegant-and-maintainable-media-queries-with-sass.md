---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/write-simple-elegant-and-maintainable-media-queries-with-sass.html"
layout: post
title:  "Write simple, elegant and maintainable media queries with Sass"
tags:
- blog
- include-media
- sass
- media
- query
external-url: http://davidwalsh.name/sass-media-query
external-name: David Walsh blog
external-date: 2015-01-05
---
I spent a few months experimenting with [different approaches](http://css-tricks.com/approaches-media-queries-sass/) for writing simple, elegant and maintainable media queries with Sass. Each solution had something that I really liked, but I couldn't find one that covered everything I needed to do, so I ventured into creating my own: meet [include-media](https://github.com/eduardoboucas/include-media).<!--more-->

I started off with this basic list of requirements:

- **Dynamic declaration of breakpoints**: I didn't want to have any hardcoded breakpoints in my mixin. Even though I might use phone, tablet and desktop in most of my sites, I might need to add phablet, small-tablet or huge-desktop to my list, depending on the project. Alternatively, I might want to adopt a different approach and have content driving the breakpoints, so I might have bp-small, bp-medium, bp-wide, and so on. To address all this properly, I wanted a simple way to declare the breakpoints I need somewhere in the code (preferably outside the mixin file) and then reference their names to construct the media queries.

- **Simple and natural syntax**: My syntax was inspired by Dmitry Sheiko's technique, which uses a mixin that receives as arguments the names of the breakpoints preceded by a greater-than or a less-than signs (e.g. `@include media(">minWidth")`) to indicate whether it's a `min-width` or `max-width`.

- **Combine breakpoints with custom values**: I often needed to apply additional rules to an element on intermediate breakpoints. Instead of polluting my global list of breakpoints with case-specific values, I wanted to able to throw custom values at the mixin and combine them with my breakpoints (e.g. `@include media(">tablet", "<1280px")`).

- **Inclusive and exclusive breakpoints**: In most of the solutions I've tried, when you make the same breakpoint the upper limit of one media query and the lower limit of another, both media queries will fire when the viewport width is exactly that breakpoint, because all the intervals are inclusive. This can sometimes lead to unexpected behavior, so I wanted to have a finer control over these situations with two additional operators: greater-than-or-equal-to and less-than-or-equal-to.

- **An elegant way to include media types and complex expressions**: I wanted to be able to specify media types, such as screen or handheld, but as an optional argument because most of the times I'll just omit it. Additionally, I wanted proper support for conditions that contain an `or` operator (represented by a comma in CSS), such as [Chris' retina declaration](http://css-tricks.com/snippets/css/retina-display-media-query/). Pretty much all of the mixins I've tried fail to properly handle that, because when you combine the expressions `a` with `b or c` they generate `(a b) or c` instead of `(a b) or (a c)`.

So, basically, I wanted something like this:

```scss
// We'll define the breakpoints somehow. 
// For now, let's say tablet' is 768px and 'desktop' 1024px.

@include media(">=tablet", "<1280px") {

}

@include media("screen", ">tablet") {

}

@include media(">tablet", "retina2x") {

}

// Compiling to:

@media (min-width: 768px) and (max-width: 1279px) {

}

@media screen and (min-width: 769px) {

}

@media (min-width: 769px) and (-webkit-min-device-pixel-ratio: 2),
       (min-width: 769px) and (min-resolution: 192dpi) {

}
```

Let's get to it then.

## Parsing expressions

The first step is to come up with a structure where we can define our breakpoints and our media types and expressions. Sass 3.3 added [support for Maps](https://github.com/sass/sass/blob/master/doc-src/SASS_CHANGELOG.md#sassscript-maps), which are basically multidimensional lists where values can be associated similarly to JSON. This is the perfect structure to accommodate our breakpoints.

```scss
$media-expressions: (screen: "screen", 
                    print: "print", 
                    handheld: "handheld",
                    retina2x: ("(-webkit-min-device-pixel-ratio: 2)", "(min-resolution: 192dpi)"), 
                    retina3x: ("(-webkit-min-device-pixel-ratio: 3)", "(min-resolution: 350dpi)")
                    ) !default;
```

Note that I've declared expressions containing logical disjunctions as nested lists, because we'll have to deal with their conditions individually. We could still declare them as strings separated by a comma, as they are naturally written in CSS, and then break them apart, but we might as well split them at the beginning.

The next step is to parse the strings we receive as arguments and translate them into the correct expressions. Instead of trying to write a mixin that does all that at once, let's go for a smaller function that handles a single argument (e.g. *>=tablet into min-width: 768px*).

```scss
@function parse-expression($expression) {
  $operator: "";
  $value: "";
  $element: "";
  $result: "";
  $is-width: true;

  // Separating the operator from the rest of the expression
  @if (str-slice($expression, 2, 2) == "=") {
    $operator: str-slice($expression, 1, 2);
    $value: str-slice($expression, 3);
  } @else {
    $operator: str-slice($expression, 1, 1);
    $value: str-slice($expression, 2);
  }

  // Checking what type of expression we're dealing with
  @if map-has-key($breakpoints, $value) {
    $result: map-get($breakpoints, $value);
  } @else if map-has-key($media-expressions, $expression) {
    $result: map-get($media-expressions, $expression);
    $is-width: false;
  } @else {
    $result: to-number($value);
  }

  // If we're dealing with a width (breakpoint or custom value), 
  // we form the expression taking into account the operator.
  @if ($is-width) {
    @if ($operator == ">") {
      $element: "(min-width: #{$result + 1})";
    } @else if ($operator == "&lt;") {
      $element: "(max-width: #{$result - 1})";
    } @else if ($operator == ">=") {
      $element: "(min-width: #{$result})";
    } @else if ($operator == "&lt;=") {
      $element: "(max-width: #{$result})";
    }
  } @else {
    $element: $result;
  }

  @return $element;
}
```

We start by detecting which operator has been used and then match the rest of the string against the breakpoints map. If it matches one of the keys, we'll use its value. If not, we repeat the process for the media expressions map. Finally, if no match is found, we assume it's a custom value in which case we have to cast the string into a number we can use to add or subtract as needed, depending on the operator. I've used `to-number` from [SassyCast](https://github.com/HugoGiraudel/SassyCast) to do that.

## Handling logical disjunction

Because of the way the `or` works in CSS, combining conditions containing that operator with others can be quite tricky. For example, the expression `a (b or c) d e (f or g)` will generate 4 branches of disjoint conditions. Here's a process we can use to generate all those possible combinations:

1. Take a "snapshot" of the expression, leaving singletons untouched and taking only the first element of each or group (a "snapshot" of an expression with no groups is the original expression).
1. Find the next disjunction (group). Take the expressions already calculated (result) and make `(N-1)` copies, where `N` is the number of elements in the group.
1. Replace all the instances of the first element of the group with every other element of the group and update the result.
1. Repeat step 2 until there are no more groups.

The following table illustrates the process for the expression shown above.

| Iteration | Group  | Result                                                                     |
|-----------|--------|----------------------------------------------------------------------------|
| 1         | -      | a **b** d e **f** (snapshot)                                               |
| 2         | (b, c) | a **b** d e **f**, a **c** d e **f**                                       |
| 3         | (f, g) | a **b** d e **f**, a **c** d e **f**, a **b** d e **g**, a **c** d e **g** |

Here's how we can write that in Sass:

```scss
@function get-query-branches($expressions) {
  $result: "";
  $has-groups: false;

  // Getting initial snapshot and looking for groups
  @each $expression in $expressions {
    @if (str-length($result) != 0) {
      $result: $result + " and ";
    }

    @if (type-of($expression) == "string") {
      $result: $result + $expression;
    } @else if (type-of($expression) == "list") {
      $result: $result + nth($expression, 1);
      $has-groups: true;
    }
  }

  // If we have groups, we have to create all possible combinations
  @if $has-groups {
    @each $expression in $expressions {
      @if (type-of($expression) == "list") {
        $first: nth($expression, 1);

        @each $member in $expression {
          @if ($member != $first) {
            @each $partial in $result {
              $result: join($result, str-replace-first($first, $member, $partial));
            }
          }
        }
      }
    }
  }

  @return $result;
}
```

Sass doesn't have any *string replace* function, so I created a simple version that replaces only the first occurrence of the string to be replaced which is what we need:

```scss
@function str-replace-first($search, $replace, $subject) {
  $search-start: str-index($subject, $search);

  @if $search-start == null {
    @return $subject;
  }

  $result: str-slice($subject, 0, $search-start - 1);
  $result: $result + $replace;
  $result: $result + str-slice($subject, $search-start + str-length($search));

  @return $result;
}
```

## Gluing everything together

Now that we built our little helpers, we can finally write the mixin itself. It'll have to take a variable number of strings, parse them, detect media expressions and handle possible disjunctions and glue everything together to form the media query expression.

```scss
@mixin media($conditions...) {
  @for $i from 1 through length($conditions) {
    $conditions: set-nth($conditions, $i, parse-expression(nth($conditions, $i)));
  }

  $branches: get-query-branches($conditions);
  $query: "";

  @each $branch in $branches {
    @if (str-length($query) != 0) {
      $query: $query + ", ";
    }

    $query: $query + $branch;
  }

  @media #{$query} {
    @content;
  }
}
```

## Wrapping it up

This is implementation is a bit complex and some people might argue it's just too much code for writing media queries. Personally, I think this is an easy and comfortable way to write powerful and maintainable media queries with a simple and comfortable syntax, just by downloading and importing a single SCSS file. The GitHub repo is there so people can submit issues and pull requests and that'll hopefully keep the mixin up-to-date with new features and improvements. What are you thoughts?<!--tomb-->