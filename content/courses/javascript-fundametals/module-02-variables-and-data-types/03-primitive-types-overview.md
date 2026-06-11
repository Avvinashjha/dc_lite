# Primitive Types Overview

In JavaScript, every value has a **type**.

The type tells JavaScript what kind of data a value is and what operations make sense for that value.

For example:

```js
const name = "Asha";
const age = 25;
const isStudent = true;
```

These values are different kinds of data:

- `"Asha"` is text.
- `25` is a number.
- `true` is a boolean.

JavaScript data types are usually grouped into two categories:

- **Primitive types**
- **Non-primitive types**, also called reference types

This lesson focuses on primitive types.

## What Is a Primitive Type?

A **primitive value** is a simple value that is not an object.

Primitive values represent one basic piece of data, such as a string, number, or boolean.

They have three important characteristics:

1. They are immutable.
2. They are compared by value.
3. They are copied by value.

You will see each of these rules in this lesson.

## The Seven Primitive Types

Modern JavaScript has seven primitive types:

| Type | Example | Meaning |
| --- | --- | --- |
| `string` | `"Hello"` | Text |
| `number` | `42`, `3.14` | Integers and decimals |
| `boolean` | `true`, `false` | Logical true or false values |
| `undefined` | `undefined` | A variable declared without a value |
| `null` | `null` | Intentional absence of a value |
| `symbol` | `Symbol("id")` | A unique identifier |
| `bigint` | `100n` | Very large whole numbers |

You will learn these types in more detail in the upcoming lessons. For now, focus on recognizing them and understanding how primitive values behave.

## `string`

A `string` represents text.

You can create strings with double quotes, single quotes, or backticks.

```js
const firstName = "Asha";
const language = 'JavaScript';
const message = `Hello, ${firstName}`;
```

Strings are used for names, messages, labels, input values, and any other text.

## `number`

A `number` represents numeric values.

JavaScript uses the same `number` type for integers and decimals.

```js
const age = 25;
const price = 99.99;
const temperature = -4;
```

Unlike some languages, JavaScript does not have separate primitive types for integers and floating-point numbers.

## `boolean`

A `boolean` has only two possible values:

```js
true;
false;
```

Booleans are used for yes/no and on/off style logic.

```js
const isLoggedIn = true;
const hasPermission = false;
```

You will use booleans often in conditions.

## `undefined`

`undefined` means a variable has been declared but no value has been assigned yet.

```js
let result;

console.log(result); // undefined
```

JavaScript automatically gives the value `undefined` in this situation.

## `null`

`null` represents an intentional absence of value.

```js
let selectedUser = null;
```

This usually means the programmer intentionally set the variable to "nothing for now."

The difference between `undefined` and `null` is small but important:

- `undefined` often means JavaScript has no value yet.
- `null` usually means the developer intentionally set no value.

## `symbol`

A `symbol` represents a unique value.

```js
const id = Symbol("id");
const anotherId = Symbol("id");

console.log(id === anotherId); // false
```

Even though both symbols have the same description, they are different unique values.

Symbols are used less often in beginner code. They are commonly used as unique property keys in advanced JavaScript.

## `bigint`

A `bigint` represents very large whole numbers.

Normal JavaScript numbers have a safe integer limit. `bigint` is useful when you need integers larger than that limit.

```js
const largeNumber = 9007199254740993n;
```

The `n` at the end makes it a `bigint`.

`bigint` is only for whole numbers, not decimals.

## Primitives Are Immutable

Primitive values cannot be changed directly.

This can sound confusing, because variables can change. The important difference is:

- A variable can be reassigned.
- A primitive value itself is immutable.

Example:

```js
let greeting = "Hello";

greeting.toUpperCase();

console.log(greeting); // Hello
```

`toUpperCase()` creates and returns a new string, but it does not change the original string.

To use the new value, you must store it:

```js
let greeting = "Hello";

greeting = greeting.toUpperCase();

console.log(greeting); // HELLO
```

The variable now points to a new string value.

## Primitives Are Compared by Value

When you compare primitive values, JavaScript compares the actual values.

```js
const a = 5;
const b = 5;

console.log(a === b); // true
```

Both values are `5`, so the comparison is true.

Another example:

```js
const first = "JavaScript";
const second = "JavaScript";

console.log(first === second); // true
```

The two strings have the same value, so they are equal.

## Primitives Are Copied by Value

When you assign a primitive variable to another variable, JavaScript copies the value.

```js
let x = 10;
let y = x;

y = 20;

console.log(x); // 10
console.log(y); // 20
```

Changing `y` does not affect `x` because `y` received its own copy of the primitive value.

This is different from objects and arrays, which you will learn about later.

## Checking Types with `typeof`

JavaScript provides the `typeof` operator to check the type of a value.

```js
console.log(typeof "Hello");      // string
console.log(typeof 42);           // number
console.log(typeof true);         // boolean
console.log(typeof undefined);    // undefined
console.log(typeof Symbol("id")); // symbol
console.log(typeof 100n);         // bigint
```

`typeof` returns a string.

There is one famous surprise:

```js
console.log(typeof null); // object
```

This is a long-standing bug in JavaScript. It has been kept for backward compatibility because changing it would break old websites.

Even though `typeof null` returns `"object"`, `null` is still considered a primitive value.

## Primitive Wrapper Behavior

Earlier, you saw this:

```js
"hello".toUpperCase();
```

This may look strange because primitives are not objects, but JavaScript still lets you call some methods on strings, numbers, and booleans.

JavaScript temporarily wraps the primitive value so the method can run, then removes the wrapper.

You do not need to understand all the details yet. The key idea is:

**Primitive values are not objects, even though JavaScript lets you use some object-like methods on them.**

## Summary

Primitive values are the simplest building blocks of JavaScript data.

There are seven primitive types:

1. `string`
2. `number`
3. `boolean`
4. `undefined`
5. `null`
6. `symbol`
7. `bigint`

Remember these core rules:

1. Primitive values are immutable.
2. Primitive values are compared by value.
3. Primitive values are copied by value.
4. Use `typeof` to inspect most primitive types.
5. `typeof null` returns `"object"`, but `null` is still a primitive.

Next, you will study each common primitive type in more detail, starting with strings.