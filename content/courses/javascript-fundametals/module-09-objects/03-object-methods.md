# Object.keys, values, and entries

Objects are great for storing named data.

But sometimes you need to loop through that data.

For arrays, looping is straightforward because arrays are ordered lists.

For objects, you need a way to get their keys, values, or key-value pairs.

JavaScript gives you three very useful methods:

- `Object.keys()`
- `Object.values()`
- `Object.entries()`

These methods turn object data into arrays so you can loop, map, filter, or reduce it.

## Example Object

We will use this object:

```js
const user = {
  name: "Alice",
  age: 25,
  role: "admin",
};
```

It has three properties:

```text
name: Alice
age: 25
role: admin
```

## `Object.keys()`

`Object.keys()` returns an array of the object's property names.

```js
const user = {
  name: "Alice",
  age: 25,
  role: "admin",
};

const keys = Object.keys(user);

console.log(keys); // ["name", "age", "role"]
```

The returned value is an array.

That means you can use array methods on it.

```js
keys.forEach((key) => {
  console.log(key);
});
```

Output:

```text
name
age
role
```

## Using Keys to Read Values

Keys are useful because you can use bracket notation to access values.

```js
const user = {
  name: "Alice",
  age: 25,
  role: "admin",
};

Object.keys(user).forEach((key) => {
  console.log(`${key}: ${user[key]}`);
});
```

Output:

```text
name: Alice
age: 25
role: admin
```

This works because `key` is a variable.

So you use:

```js
user[key]
```

not:

```js
user.key
```

## `Object.values()`

`Object.values()` returns an array of the object's values.

```js
const user = {
  name: "Alice",
  age: 25,
  role: "admin",
};

const values = Object.values(user);

console.log(values); // ["Alice", 25, "admin"]
```

Use `Object.values()` when you only care about the values and do not need the property names.

Example:

```js
const scores = {
  math: 90,
  science: 85,
  english: 88,
};

const total = Object.values(scores).reduce((sum, score) => {
  return sum + score;
}, 0);

console.log(total); // 263
```

The object values become an array:

```js
[90, 85, 88]
```

Then `reduce` sums them.

## `Object.entries()`

`Object.entries()` returns an array of key-value pairs.

```js
const user = {
  name: "Alice",
  age: 25,
  role: "admin",
};

const entries = Object.entries(user);

console.log(entries);
```

Output:

```js
[
  ["name", "Alice"],
  ["age", 25],
  ["role", "admin"]
]
```

Each entry is a two-item array:

```js
[key, value]
```

## Looping Through Entries

`Object.entries()` is very useful with destructuring.

```js
const user = {
  name: "Alice",
  age: 25,
  role: "admin",
};

for (const [key, value] of Object.entries(user)) {
  console.log(`${key}: ${value}`);
}
```

Output:

```text
name: Alice
age: 25
role: admin
```

This is often the cleanest way to loop through both property names and values.

## Comparing the Three Methods

```js
const user = {
  name: "Alice",
  age: 25,
  role: "admin",
};
```

| Method | Returns |
| --- | --- |
| `Object.keys(user)` | `["name", "age", "role"]` |
| `Object.values(user)` | `["Alice", 25, "admin"]` |
| `Object.entries(user)` | `[["name", "Alice"], ["age", 25], ["role", "admin"]]` |

Use the method that gives you the data you need.

## Checking Object Size

Objects do not have a `.length` property like arrays.

```js
const user = {
  name: "Alice",
  age: 25,
};

console.log(user.length); // undefined
```

To count properties, use `Object.keys()`.

```js
const propertyCount = Object.keys(user).length;

console.log(propertyCount); // 2
```

This is a common pattern.

## Checking if an Object Is Empty

```js
const settings = {};

const isEmpty = Object.keys(settings).length === 0;

console.log(isEmpty); // true
```

If an object has no own enumerable properties, `Object.keys()` returns an empty array.

## Transforming an Object Into an Array

Sometimes object data is easier to display as an array.

```js
const scores = {
  math: 90,
  science: 85,
  english: 88,
};

const scoreList = Object.entries(scores).map(([subject, score]) => {
  return `${subject}: ${score}`;
});

console.log(scoreList);
```

Output:

```js
["math: 90", "science: 85", "english: 88"]
```

This pattern combines object methods with array methods.

## Building an Object From Entries

There is also a reverse method: `Object.fromEntries()`.

It turns key-value pairs back into an object.

```js
const entries = [
  ["name", "Alice"],
  ["role", "admin"],
];

const user = Object.fromEntries(entries);

console.log(user); // { name: "Alice", role: "admin" }
```

This is useful when you transform entries and want to rebuild an object.

## Transforming Object Values

Example: increase all scores by 5.

```js
const scores = {
  math: 90,
  science: 85,
  english: 88,
};

const updatedEntries = Object.entries(scores).map(([subject, score]) => {
  return [subject, score + 5];
});

const updatedScores = Object.fromEntries(updatedEntries);

console.log(updatedScores);
```

Output:

```js
{
  math: 95,
  science: 90,
  english: 93
}
```

The steps are:

1. Convert object to entries.
2. Map over the entries.
3. Convert entries back into an object.

## Filtering Object Properties

You can also filter object entries.

```js
const user = {
  name: "Alice",
  password: "secret",
  role: "admin",
};

const publicEntries = Object.entries(user).filter(([key]) => {
  return key !== "password";
});

const publicUser = Object.fromEntries(publicEntries);

console.log(publicUser); // { name: "Alice", role: "admin" }
```

This creates a new object without the `password` property.

## Own Enumerable Properties

`Object.keys`, `Object.values`, and `Object.entries` return an object's own enumerable properties.

For beginner work, this usually means:

```text
The normal properties you added directly to the object.
```

```js
const user = {
  name: "Alice",
  role: "admin",
};

console.log(Object.keys(user)); // ["name", "role"]
```

Later, when you learn prototypes, you will see why the words "own" and "enumerable" matter.

For now, these methods are the standard way to inspect and loop through normal object data.

## Property Order

Objects are not arrays, but modern JavaScript does preserve a predictable order for most normal object keys.

```js
const user = {
  name: "Alice",
  age: 25,
  role: "admin",
};

console.log(Object.keys(user)); // ["name", "age", "role"]
```

Do not use objects when strict numeric ordering is the main purpose.

Use arrays for ordered lists.

Use objects for named properties.

## Best Practices

Use `Object.keys()` when you need property names:

```js
const keys = Object.keys(user);
```

Use `Object.values()` when you need only values:

```js
const scores = Object.values(scoreBySubject);
```

Use `Object.entries()` when you need both:

```js
for (const [key, value] of Object.entries(user)) {
  console.log(key, value);
}
```

Use `Object.fromEntries()` to rebuild objects after transforming entries:

```js
const object = Object.fromEntries(entries);
```

Use arrays when order is the main concern.

Use objects when names are the main concern.

## Common Mistakes

### Mistake 1: Expecting Objects to Have `.length`

```js
const user = {
  name: "Alice",
};

console.log(user.length); // undefined
```

Use:

```js
Object.keys(user).length;
```

### Mistake 2: Using Dot Notation With a Dynamic Key

```js
const user = {
  name: "Alice",
};

const key = "name";

console.log(user.key); // undefined
```

Use bracket notation:

```js
console.log(user[key]); // Alice
```

### Mistake 3: Forgetting Entries Are Arrays

```js
const user = {
  name: "Alice",
};

for (const entry of Object.entries(user)) {
  console.log(entry.key); // undefined
}
```

Each entry is an array:

```js
["name", "Alice"]
```

Use destructuring:

```js
for (const [key, value] of Object.entries(user)) {
  console.log(key, value);
}
```

## Quick Check

What does this return?

```js
const user = {
  name: "Alice",
  role: "admin",
};

Object.keys(user);
```

It returns:

```js
["name", "role"]
```

What does this return?

```js
Object.values(user);
```

It returns:

```js
["Alice", "admin"]
```

What does this return?

```js
Object.entries(user);
```

It returns:

```js
[
  ["name", "Alice"],
  ["role", "admin"]
]
```

## Summary

Object methods help you inspect and loop through object data.

- `Object.keys()` returns property names.
- `Object.values()` returns property values.
- `Object.entries()` returns key-value pairs.
- Objects do not have `.length`; use `Object.keys(object).length`.
- Use `Object.entries()` with destructuring to loop through keys and values.
- Use `Object.fromEntries()` to turn key-value pairs back into an object.
- These methods work well with array methods like `map`, `filter`, and `reduce`.
