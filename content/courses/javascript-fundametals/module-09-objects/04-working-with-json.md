# Working with JSON

JavaScript objects are used inside your code.

But when data needs to be sent across the internet or saved as text, it usually needs a standard text format.

That format is often **JSON**.

JSON stands for **JavaScript Object Notation**.

It looks similar to JavaScript objects, but it is not exactly the same thing.

## What Is JSON?

JSON is a text format for storing and exchanging data.

Example JSON:

```json
{
  "name": "Alice",
  "age": 25,
  "role": "admin"
}
```

JSON is commonly used in:

- APIs
- configuration files
- databases
- local storage
- data exports

When your frontend talks to a backend API, the data is often sent as JSON.

## JSON Looks Like an Object

This is a JavaScript object:

```js
const user = {
  name: "Alice",
  age: 25,
  role: "admin",
};
```

This is JSON text:

```json
{
  "name": "Alice",
  "age": 25,
  "role": "admin"
}
```

They look similar, but they are different.

The JavaScript object is a real value in memory.

JSON is a string format.

## JSON Rules

JSON has stricter rules than JavaScript object literals.

Valid JSON:

```json
{
  "name": "Alice",
  "age": 25,
  "isActive": true,
  "skills": ["JavaScript", "HTML"],
  "address": {
    "city": "Delhi"
  }
}
```

Important JSON rules:

- property names must use double quotes
- string values must use double quotes
- no trailing commas
- no comments
- no functions
- no `undefined`
- no single quotes

This is not valid JSON:

```js
{
  name: "Alice",
  role: "admin",
}
```

It is a JavaScript object literal, not JSON.

## JSON Values

JSON supports these value types:

- string
- number
- boolean
- null
- array
- object

Example:

```json
{
  "title": "JavaScript Fundamentals",
  "lessons": 12,
  "published": true,
  "tags": ["javascript", "beginner"],
  "author": {
    "name": "DailyCoder"
  },
  "archivedAt": null
}
```

JSON does not support JavaScript-specific values like:

- functions
- `undefined`
- `Symbol`
- `BigInt`

## Converting an Object to JSON

Use `JSON.stringify()` to convert a JavaScript value into a JSON string.

```js
const user = {
  name: "Alice",
  age: 25,
  role: "admin",
};

const json = JSON.stringify(user);

console.log(json);
```

Output:

```json
{"name":"Alice","age":25,"role":"admin"}
```

The result is a string.

```js
console.log(typeof json); // string
```

## Pretty Printing JSON

`JSON.stringify()` can format output with indentation.

```js
const user = {
  name: "Alice",
  age: 25,
  role: "admin",
};

const json = JSON.stringify(user, null, 2);

console.log(json);
```

Output:

```json
{
  "name": "Alice",
  "age": 25,
  "role": "admin"
}
```

The third argument controls spacing.

`2` means two spaces of indentation.

This is useful for logs, debugging, and files meant for humans to read.

## Converting JSON to an Object

Use `JSON.parse()` to convert JSON text into a JavaScript value.

```js
const json = "{\"name\":\"Alice\",\"age\":25,\"role\":\"admin\"}";

const user = JSON.parse(json);

console.log(user.name); // Alice
console.log(user.age); // 25
```

After parsing, `user` is a normal JavaScript object.

```js
console.log(typeof user); // object
```

## Parsing Arrays

JSON can represent arrays too.

```js
const json = "[\"Apple\", \"Banana\", \"Cherry\"]";

const fruits = JSON.parse(json);

console.log(fruits[0]); // Apple
console.log(Array.isArray(fruits)); // true
```

`JSON.parse()` returns the correct JavaScript value based on the JSON text.

If the JSON text represents an array, you get an array.

If it represents an object, you get an object.

## Invalid JSON Throws an Error

`JSON.parse()` expects valid JSON.

Invalid JSON throws an error.

```js
const invalidJson = "{ name: \"Alice\" }";

JSON.parse(invalidJson); // SyntaxError
```

Why is it invalid?

The property name must be in double quotes:

```json
{ "name": "Alice" }
```

When parsing JSON from outside your app, be prepared for parsing errors.

## Handling Parse Errors

Use `try...catch` when parsing uncertain JSON.

```js
const json = "{ bad json }";

try {
  const data = JSON.parse(json);
  console.log(data);
} catch (error) {
  console.log("Could not parse JSON");
}
```

You will learn more about error handling later.

For now, remember:

```text
JSON.parse can fail if the text is not valid JSON.
```

## JSON and APIs

APIs commonly send JSON responses.

Example response body:

```json
{
  "id": 1,
  "name": "Alice",
  "role": "admin"
}
```

In modern frontend code, you often parse JSON from a response:

```js
const response = await fetch("/api/user");
const user = await response.json();

console.log(user.name);
```

The `.json()` method parses the response body into a JavaScript value.

You will learn more about `fetch` and APIs in a later module.

## JSON and Local Storage

Browser local storage stores strings.

If you want to store an object, convert it to JSON first.

```js
const settings = {
  theme: "dark",
  notifications: true,
};

localStorage.setItem("settings", JSON.stringify(settings));
```

When reading it back, parse it:

```js
const savedSettings = JSON.parse(localStorage.getItem("settings"));

console.log(savedSettings.theme); // dark
```

Local storage is a common place where `JSON.stringify()` and `JSON.parse()` appear together.

## What Happens to `undefined` and Functions?

JSON cannot represent `undefined` or functions.

```js
const user = {
  name: "Alice",
  email: undefined,
  greet() {
    return "Hello";
  },
};

console.log(JSON.stringify(user));
```

Output:

```json
{"name":"Alice"}
```

The `email` property and `greet` method are omitted.

This can surprise beginners.

JSON is for data, not behavior.

## What Happens to Dates?

Dates become strings when stringified.

```js
const event = {
  title: "Launch",
  date: new Date("2026-06-14"),
};

const json = JSON.stringify(event);

console.log(json);
```

Output:

```json
{"title":"Launch","date":"2026-06-14T00:00:00.000Z"}
```

When you parse it back, `date` is a string, not a `Date` object.

```js
const parsed = JSON.parse(json);

console.log(typeof parsed.date); // string
```

You would need to convert it back manually if you need a real `Date`.

## Deep Copy With JSON

You may see this pattern:

```js
const copy = JSON.parse(JSON.stringify(original));
```

This creates a deep copy for simple JSON-safe data.

Example:

```js
const original = {
  user: {
    name: "Alice",
  },
};

const copy = JSON.parse(JSON.stringify(original));

copy.user.name = "Ava";

console.log(original.user.name); // Alice
```

But this only works safely for JSON-compatible data.

It loses functions, `undefined`, `Date` objects, `Map`, `Set`, `BigInt`, and other special values.

Modern JavaScript has `structuredClone()` for many deep-copy use cases.

You will learn more about copying in the next lesson.

## JSON vs JavaScript Object

| Feature | JavaScript Object | JSON |
| --- | --- | --- |
| Runtime value? | Yes | No, text format |
| Property quotes required? | No | Yes, double quotes |
| Functions allowed? | Yes | No |
| `undefined` allowed? | Yes | No |
| Trailing commas allowed? | Usually yes in JS | No |
| Used for | Code data structures | Data exchange/storage |

## Best Practices

Use `JSON.stringify()` to send or store data as text:

```js
const json = JSON.stringify(data);
```

Use `JSON.parse()` to turn JSON text back into JavaScript values:

```js
const data = JSON.parse(json);
```

Use pretty formatting for readable output:

```js
JSON.stringify(data, null, 2);
```

Do not put functions or `undefined` in data you plan to serialize.

Use `try...catch` when parsing JSON you do not fully control.

Remember that parsed dates are strings.

## Common Mistakes

### Mistake 1: Writing JavaScript Object Syntax and Calling It JSON

```js
{
  name: "Alice",
}
```

This is not valid JSON.

Valid JSON:

```json
{
  "name": "Alice"
}
```

### Mistake 2: Forgetting That `JSON.stringify()` Returns a String

```js
const user = {
  name: "Alice",
};

const json = JSON.stringify(user);

console.log(json.name); // undefined
```

`json` is a string.

Parse it if you need an object:

```js
const parsed = JSON.parse(json);

console.log(parsed.name); // Alice
```

### Mistake 3: Parsing Invalid JSON

```js
JSON.parse("{ name: \"Alice\" }"); // SyntaxError
```

Property names in JSON must use double quotes.

### Mistake 4: Expecting Functions to Survive JSON

```js
const object = {
  greet() {
    return "Hello";
  },
};

console.log(JSON.stringify(object)); // {}
```

JSON stores data, not functions.

## Quick Check

What does this return?

```js
const user = {
  name: "Alice",
};

JSON.stringify(user);
```

It returns a JSON string:

```json
{"name":"Alice"}
```

What does this return?

```js
JSON.parse("{\"name\":\"Alice\"}");
```

It returns a JavaScript object:

```js
{ name: "Alice" }
```

Is this valid JSON?

```js
{ name: "Alice" }
```

No.

Valid JSON requires double-quoted property names:

```json
{ "name": "Alice" }
```

## Summary

JSON is a text format for storing and exchanging data.

- JSON stands for JavaScript Object Notation.
- JSON looks like JavaScript objects but follows stricter rules.
- Use `JSON.stringify()` to convert JavaScript values to JSON strings.
- Use `JSON.parse()` to convert JSON strings to JavaScript values.
- JSON property names must use double quotes.
- JSON cannot store functions, `undefined`, or symbols.
- Invalid JSON causes `JSON.parse()` to throw an error.
- APIs and local storage commonly use JSON.
- JSON is for data, not behavior.
