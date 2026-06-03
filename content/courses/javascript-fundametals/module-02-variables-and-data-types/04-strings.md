# Strings

Strings are how JavaScript represents text.

You use strings for names, messages, emails, paragraphs, labels, URLs, HTML snippets, and many other kinds of text.

```js
const userName = "Asha";
const message = "Welcome to JavaScript";
```

In this lesson, you will learn how to create strings, combine them with values, read individual characters, and use common string methods.

## Creating Strings

JavaScript gives you three common ways to create strings:

```js
const single = 'Hello World';
const double = "Hello World";
const template = `Hello World`;
```

All three create strings.

The most important rule is that the opening and closing quote must match.

This is valid:

```js
const message = "Hello";
```

This is not valid:

```js
const message = "Hello';
```

## Single Quotes vs Double Quotes

Single quotes and double quotes work the same way.

The main reason to choose one over the other is readability.

If your string contains an apostrophe, double quotes are convenient:

```js
const message = "It's a beautiful day.";
```

If your string contains double quotes, single quotes are convenient:

```js
const quote = 'He said, "Hello!"';
```

If you use the same quote inside the string, you must escape it with a backslash:

```js
const message = 'It\'s a beautiful day.';
```

This works, but it is often less readable.

## Template Literals

Strings created with backticks are called **template literals**.

```js
const greeting = `Hello`;
```

Template literals are powerful because they support:

- String interpolation
- Multi-line strings

## String Interpolation

String interpolation lets you insert variables or expressions directly into a string using `${}`.

```js
const name = "Asha";
const age = 25;

const message = `My name is ${name} and I am ${age} years old.`;

console.log(message);
```

Output:

```text
My name is Asha and I am 25 years old.
```

Without template literals, you would need string concatenation:

```js
const message = "My name is " + name + " and I am " + age + " years old.";
```

That works, but it becomes harder to read as the string gets longer.

You can also place expressions inside `${}`:

```js
console.log(`2 + 2 = ${2 + 2}`);
```

Output:

```text
2 + 2 = 4
```

## Multi-Line Strings

Template literals can span multiple lines.

```js
const poem = `Roses are red,
Violets are blue,
JavaScript is fun,
And so are you.`;

console.log(poem);
```

With single or double quotes, you cannot freely break a string across lines like this.

## String Length

The `.length` property gives the number of characters in a string.

```js
const language = "JavaScript";

console.log(language.length); // 10
```

`.length` is a property, not a method, so it does not use parentheses.

Correct:

```js
language.length;
```

Incorrect:

```js
language.length();
```

## Accessing Characters

You can access individual characters using bracket notation.

```js
const word = "JavaScript";

console.log(word[0]); // J
console.log(word[4]); // S
```

String indexes start at `0`.

For `"JavaScript"`:

```text
J a v a S c r i p t
0 1 2 3 4 5 6 7 8 9
```

If you access an index that does not exist, JavaScript returns `undefined`.

```js
const word = "Hi";

console.log(word[10]); // undefined
```

## Strings Are Immutable

Strings are primitive values, and primitive values are immutable.

That means you cannot change a string character directly.

```js
let word = "JavaScript";

word[0] = "j";

console.log(word); // JavaScript
```

The original string does not change.

To create a changed version, you make a new string:

```js
let word = "JavaScript";

word = "j" + word.slice(1);

console.log(word); // javaScript
```

## Common String Methods

JavaScript includes many built-in string methods.

Remember: string methods return new values. They do not change the original string.

## `toUpperCase()`

Converts a string to uppercase.

```js
const text = "hello";

console.log(text.toUpperCase()); // HELLO
console.log(text); // hello
```

## `toLowerCase()`

Converts a string to lowercase.

```js
const text = "HELLO";

console.log(text.toLowerCase()); // hello
```

## `trim()`

Removes whitespace from the beginning and end of a string.

```js
const input = "  Asha  ";

console.log(input.trim()); // Asha
```

This is useful when working with user input.

## `includes()`

Checks whether a string contains another string.

```js
const email = "asha@example.com";

console.log(email.includes("@")); // true
console.log(email.includes("#")); // false
```

`includes()` returns a boolean.

## `startsWith()` and `endsWith()`

Checks how a string begins or ends.

```js
const url = "https://dailycoder.in";

console.log(url.startsWith("https")); // true
console.log(url.endsWith(".in")); // true
```

## `replace()`

Replaces the first matching part of a string.

```js
const sentence = "I like cats.";

const updated = sentence.replace("cats", "dogs");

console.log(updated); // I like dogs.
```

The original string is unchanged.

```js
console.log(sentence); // I like cats.
```

## `slice()`

Extracts part of a string.

```js
const word = "JavaScript";

console.log(word.slice(0, 4)); // Java
console.log(word.slice(4)); // Script
```

The first number is the starting index. The second number is where extraction stops, but that ending index is not included.

## `split()`

Splits a string into an array.

```js
const tags = "html,css,javascript";

const list = tags.split(",");

console.log(list); // ["html", "css", "javascript"]
```

You will learn arrays in detail later. For now, know that `split()` is commonly used to turn text into a list.

## Method Summary

| Method or property | What it does | Example result |
| --- | --- | --- |
| `.length` | Counts characters | `"Hello".length` gives `5` |
| `.toUpperCase()` | Converts to uppercase | `"hi"` becomes `"HI"` |
| `.toLowerCase()` | Converts to lowercase | `"HI"` becomes `"hi"` |
| `.trim()` | Removes outer whitespace | `"  hi  "` becomes `"hi"` |
| `.includes()` | Checks if text exists | `"apple".includes("app")` gives `true` |
| `.startsWith()` | Checks the beginning | `"hello".startsWith("he")` gives `true` |
| `.endsWith()` | Checks the ending | `"hello".endsWith("lo")` gives `true` |
| `.replace()` | Replaces first match | `"cat"` becomes `"bat"` |
| `.slice()` | Extracts part of a string | `"JavaScript".slice(0, 4)` gives `"Java"` |
| `.split()` | Splits into an array | `"a,b".split(",")` gives `["a", "b"]` |

## Putting It Together

Here is a realistic example:

```js
const rawName = "  asha  ";

const cleanedName = rawName.trim();
const displayName = cleanedName[0].toUpperCase() + cleanedName.slice(1);

console.log(`Welcome, ${displayName}!`);
```

Output:

```text
Welcome, Asha!
```

This example uses:

- `trim()`
- bracket notation
- `toUpperCase()`
- `slice()`
- a template literal

## Best Practices

1. Use template literals when inserting variables into strings.
2. Keep quote style consistent within a project.
3. Remember that strings are immutable.
4. Store the result of a string method if you want to use the changed value.
5. Use clear variable names for text values, such as `userName`, `message`, or `email`.

## Summary

Strings represent text in JavaScript.

You learned how to:

1. Create strings with single quotes, double quotes, and backticks.
2. Use template literals and `${}` interpolation.
3. Write multi-line strings.
4. Read string length.
5. Access characters by index.
6. Use common string methods.
7. Remember that string methods return new values instead of changing the original string.

Next, you will learn about numbers and how JavaScript handles numeric values.