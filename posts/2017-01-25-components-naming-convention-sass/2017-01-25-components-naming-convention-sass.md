---
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/components-naming-convention-sass.html"
layout: post
title: "Sass components with variable naming conventions"
tags:
- blog
- sass
---
To build a library of UI components that is flexible enough to be dropped into any project, there are some things to be considered. To avoid naming collisions, you might want to prefix CSS classes with a certain sequence of characters, but what should you use? What if the prefix you choose is already being used by something else? Unlikely, I know, but possible nonetheless. And what about the naming convention for the class names? Is the project using *camelCase*, *PascalCase* or hyphen-separated names? It'd be great if your library could match whatever is being used in the host project.<!--more-->

I put together a small Sass snippet that allows you to define the name of a component and dynamically choose whether or not it should be prefixed (and what prefix to use) and what naming convention is used to render the CSS selector.

For example, you could define a component as `my-cool-component` and have it render as `.foo-MyCoolComponent`. Here's how:

```scss
///
/// Sets a prefix for all selectors
///
/// @example
///  $sel-prefix: 'foo-';
///
///  .foo-MyComponent
///
$sel-prefix: false !default;

///
/// Defines the case convention for selectors
///
/// @example
///  $sel-case: 'camel';
///
///  .foo-myComponent
///
/// @example
///  $sel-case: 'pascal';
///
///  .foo-MyComponent
///
$sel-case: 'pascal' !default;

///
/// Transforms a hyphen-separated string into PascalCase or camelCase
///
/// @author Eduardo Boucas (@eduardoboucas)
///
/// @param {String}   $input       - The string to transform
/// @param {Boolean}  $pascalCase  - Whether to capitalise the first character
///
/// @return {String} The transformed string
///
@function capitalise($input, $pascalCase: false) {
  $str: '';
  $capital: $pascalCase;
  $hyphen: false;
  
  @for $i from 1 through str-length($input) {
    $char: str-slice($input, $i, $i);
    
    @if $char != '-' {
      $str: $str + if($capital, to-upper-case($char), $char);
      
      $capital: false;
      $hyphen: false;
    } @else {
      // Allowing double hyphen for BEM syntax
      @if $hyphen {
        $str: $str + '--';
        $hyphen: false;
      } @else {
        $hyphen: true;
      }
      
      $capital: true;
    }
  }
  
  @return $str;
}

///
/// Builds a selector using a pre-defined prefix and
/// case convention
///
/// @author Eduardo Boucas (@eduardoboucas)
///
/// @param {String}   $selector  - The original selector
///
/// @return {String} The transformed selector
///
@function sel($selector) {
  @if $sel-case == 'pascal' {
    $selector: capitalise($selector, true);
  } @else if $sel-case == 'camel' {
    $selector: capitalise($selector);
  }
  
  @if $sel-prefix {
    $selector: $sel-prefix + $selector;
  }
  
  @return $selector;
}
```

And here's how it can be used:

```scss
// Defining the prefix
$sel-prefix: 'foo-';

// Using PascalCase
$sel-case: 'pascal';

.#{sel('my-cool-component')} {
  color: darksalmon;
}

// Results in:
.foo-MyCoolComponent {
  color: darksalmon;
}
```

Here's the [Sassmeister gist](http://www.sassmeister.com/gist/5583407c0d950e140737554eeb0718ca).

Okay, who am I kidding? This isn't exactly useful, but I missed writing some Sass.<!--tomb-->
