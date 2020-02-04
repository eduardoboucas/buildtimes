---
layout: post
title:  "Custom JSON (de)serialisation in JavaScript"
tags:
- blog
- json
- javascript
---
If you write JavaScript applications, you probably find yourself having to read and write data structures to local files or remote APIs, which means you're probably good friends with `JSON.stringify` and `JSON.parse`. We should really get to know our friends, so let's talk about something these methods do that you may not be familiar with.<!--more-->

Writing an object to disk or sending it over the network involves converting it to a sequence of characters such that it can be converted back to its original format and restore all its properties when needed. This is called **serialisation** and **deserialisation**.

You can choose any format you like for serialising and deserialising JavaScript objects, but JSON (JavaScript Object Notation) is a likely candidate since support for it is baked into the language – `JSON.stringify()` for serialisation and `JSON.parse()` for deserialisation.

So, let's look at a simple JavaScript object and run a simple test: we'll serialise it into a variable, deserialise that variable and then check that the resulting value contains the same structure and properties as the original object.

```js
var original = {
  name: 'John Doe',
  yearOfBirth: 1988
}
var serialized = JSON.stringify(original)
var deserialized = JSON.parse(serialized)

console.log(
  original.name === deserialized.name &&
  original.yearOfBirth === deserialized.yearOfBirth
)
// > true
```

Sure enough, it works. But what if we add more exotic values to the mix?

JSON has support for 6 data types: strings, numbers, booleans, `null`, objects and arrays. What happens if we try to serialise a value of a different type, say a regular expression?

```js
var original = {
  email: /^j(ohn){0,1}(\.){0,1}doe@example.com$/,
  name: 'John Doe',
  yearOfBirth: 1988
}

console.log(original.email.test('john.doe@example.com'))
// > true

console.log(original.email.test('jdoe@example.com'))
// > true

console.log(original.email.test('jdoe@example.org'))
// > false

var serialized = JSON.stringify(original)
var deserialized = JSON.parse(serialized)

console.log(deserialized.email.test('john.doe@example.com'))
// > "TypeError: deserialized.email.test is not a function

console.log(deserialized.email)
// > {}
```

What happened here?

You see, `JSON.stringify` doesn't know how to serialise a regular expression, so it writes it as an empty object. When we run the serialised value through `JSON.parse`, the `email` property will contain an empty object without any reference to the regular expression that existed in the original object. That's why calling the `.test()` method on it will throw an error.

## Custom (de)serialisation method

`JSON.stringify` allows us to supply a custom serialisation method, which specifies the format and shape with which a value is serialised. We can write a method that checks for regular expressions and encodes them in our own custom representation, as long as that representation is made up of built-in JSON types only.

For example, let's represent the regular expression `/foo/i` as `["<<REGEX", "/foo/i", "REGEX>>"]` – this is an array of strings, so we're now only using types that can be natively serialised to JSON.

This only works if we make the deserialisation method aware of this notation. It needs to be on the lookout for arrays with 3 elements that begin and end with those special strings we came up with. When it finds one, it knows it represents a regular expression so it can extract the expression from it.

Here's the final code:

```js
function deserialize(key, value) {
  if (
    Array.isArray(value) &&
    value.length === 3 &&
    value[0] === '<<REGEXP' &&
    value[2] === 'REGEXP>>'
  ) {
    let [, exp, flags] = value[1].match(/\/(.*)\/(.*)?/)

    return new RegExp(exp, flags || '')
  }

  return value
}

function serializer(key, value) {
  if (value instanceof RegExp) {
    return ['<<REGEXP', value.toString(), 'REGEXP>>']
  }

  return value
}

var original = {
  email: /^j(ohn){0,1}(\.){0,1}doe@example.com$/,
  name: 'John Doe',
  yearOfBirth: 1988
}

console.log(original.email.test('john.doe@example.com'))
// > true

console.log(original.email.test('jdoe@example.com'))
// > true

console.log(original.email.test('jdoe@example.org'))
// > false

var serialized = JSON.stringify(original, serializer)
var deserialized = JSON.parse(serialized, deserialize)

console.log(deserialized.email.test('john.doe@example.com'))
// > true

console.log(deserialized.email.test('jdoe@example.com'))
// > true

console.log(deserialized.email.test('jdoe@example.org'))
// > false
```

You can use this method to serialise and deserialise any type you want, like functions or custom classes.<!--tomb--> 

_Code is available on [JSbin](https://jsbin.com/nucenan/edit?js,console)_