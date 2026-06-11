# null and undefined

JavaScript has two primitive values that represent absence:

- `undefined`
- `null`

At first, they can seem like the same thing because both mean "no value" in some way. But they have different meanings and different use cases.

The short version is:

- `undefined` usually means JavaScript has not been given a value yet.
- `null` usually means the developer intentionally set the value to empty.

## `undefined`: The Default Absence

`undefined` means a value has not been assigned.

It is JavaScript's way of saying, "This exists, but it does not have a value yet."

## Declared but Not Assigned

If you declare a variable without assigning a value, JavaScript gives it `undefined`.

```js
let message;

console.log(message); // undefined
```

The variable exists, but it does not contain a meaningful value yet.

## Missing Function Arguments

If a function expects an argument but you do not pass one, the parameter becomes `undefined`.

```js
function greet(name) {
  console.log(name);
}

greet(); // undefined
```

The parameter `name` exists inside the function, but no value was passed into it.

## Functions Without `return`

If a function does not return a value, JavaScript returns `undefined` automatically.

```js
function logMessage() {
  console.log("Hello");
}

const result = logMessage();

console.log(result); // undefined
```

The function prints `"Hello"`, but it does not return a value.

## Missing Object Properties

If you try to access a property that does not exist, JavaScript returns `undefined`.

```js
const user = {
  name: "Asha"
};

console.log(user.age); // undefined
```

The object exists. The `age` property does not.

## `null`: Intentional Absence

`null` means an intentional empty value.

It is a value you assign when you want to clearly say, "There is no value here on purpose."

```js
let currentUser = "Asha";

console.log(currentUser); // Asha

currentUser = null;

console.log(currentUser); // null
```

In this example, `null` is useful because the user was once present, but now there is intentionally no current user.

Common situations where `null` makes sense:

- No selected user
- No active modal
- No search result
- No current DOM element reference
- A value that will be filled later

Example:

```js
let selectedProduct = null;

// Later, after the user clicks a product
selectedProduct = "Laptop";
```

## `typeof null`

`typeof` behaves as expected with `undefined`:

```js
console.log(typeof undefined); // undefined
```

But `typeof null` has a famous result:

```js
console.log(typeof null); // object
```

This is a historical bug in JavaScript.

`null` is not actually an object. It is a primitive value. The bug was kept for backward compatibility because changing it would break old websites.

So remember:

```js
typeof null; // "object", but null is still a primitive
```

## Comparing `null` and `undefined`

`null` and `undefined` are loosely equal:

```js
console.log(null == undefined); // true
```

But they are not strictly equal:

```js
console.log(null === undefined); // false
```

Why?

- Loose equality `==` allows type conversion.
- Strict equality `===` checks both value and type.

In modern JavaScript, prefer strict equality most of the time:

```js
value === null;
value === undefined;
```

However, there is one common exception.

## Checking for Either `null` or `undefined`

Sometimes you want to check whether a value is either `null` or `undefined`.

In that specific case, this pattern is common:

```js
if (value == null) {
  console.log("Value is null or undefined");
}
```

This works because:

```js
null == undefined; // true
```

But it does not match other falsy values:

```js
console.log(0 == null); // false
console.log("" == null); // false
console.log(false == null); // false
```

So `value == null` is a concise way to check for only `null` or `undefined`.

Use it intentionally and make sure your team understands the pattern.

## Falsy Behavior

Both `null` and `undefined` are falsy.

```js
console.log(Boolean(null)); // false
console.log(Boolean(undefined)); // false
```

That means they behave like `false` in conditions.

```js
let currentUser = null;

if (currentUser) {
  console.log("User exists");
} else {
  console.log("No current user");
}
```

This can be useful, but be careful. Falsy checks also match values like `0`, `""`, `false`, and `NaN`.

If you specifically need to check for absence, use a direct check:

```js
if (currentUser === null) {
  console.log("No current user");
}
```

Or:

```js
if (currentUser == null) {
  console.log("No current user or value was not loaded");
}
```

## Best Practices

## Let JavaScript Use `undefined`

Avoid manually assigning `undefined` in most cases.

Less useful:

```js
let data = undefined;
```

Prefer:

```js
let data;
```

`undefined` usually means a value has not been initialized yet.

## Use `null` for Intentional Empty Values

Use `null` when you want to clearly reset or empty something.

```js
let activeElement = document.querySelector("button");

// Later
activeElement = null;
```

This communicates that the variable intentionally no longer points to an element.

## Use Strict Checks When Meaning Matters

If the difference matters, check directly:

```js
if (value === undefined) {
  console.log("Value was not assigned");
}

if (value === null) {
  console.log("Value was intentionally cleared");
}
```

## Comparison Table

| Feature | `undefined` | `null` |
| --- | --- | --- |
| Meaning | Value has not been assigned | Value is intentionally empty |
| Usually created by | JavaScript | Developer |
| Type from `typeof` | `"undefined"` | `"object"` |
| Primitive? | Yes | Yes |
| Falsy? | Yes | Yes |
| Strictly equal to each other? | No | No |
| Loosely equal to each other? | Yes | Yes |

## Practical Example

Imagine a search feature.

```js
let searchResult;

console.log(searchResult); // undefined
```

At this point, the search has not happened yet.

After the search runs, maybe no result is found:

```js
searchResult = null;

console.log(searchResult); // null
```

Now the meaning is different:

- `undefined`: Search has not produced a value yet.
- `null`: Search ran, but there is intentionally no result.

That distinction makes your code easier to reason about.

## Summary

`undefined` and `null` both represent absence, but they are not the same.

Remember:

1. `undefined` usually means a value has not been assigned.
2. `null` means the developer intentionally set an empty value.
3. `typeof null` returns `"object"` because of a historical JavaScript bug.
4. `null == undefined` is `true`, but `null === undefined` is `false`.
5. Use `null` when you want to clearly represent intentional emptiness.
6. Avoid manually assigning `undefined` unless you have a specific reason.

Next, you will learn about symbols and bigints, two less common but important primitive types.
