# Template Literals

Template literals are a modern way to work with strings.

They use backticks instead of quotes.

```js
const message = `Hello, world!`;
```

Template literals make it easier to:

- insert values into strings
- write multi-line strings
- build readable messages
- avoid messy string concatenation

## Regular Strings vs Template Literals

Regular strings use single or double quotes.

```js
const name = "Alice";
const message = "Hello, " + name + "!";

console.log(message); // Hello, Alice!
```

Template literals use backticks and `${}` placeholders.

```js
const name = "Alice";
const message = `Hello, ${name}!`;

console.log(message); // Hello, Alice!
```

This is usually easier to read.

## String Interpolation

String interpolation means inserting values directly into a string.

```js
const product = "Keyboard";
const price = 50;

const message = `The ${product} costs $${price}.`;

console.log(message); // The Keyboard costs $50.
```

Anything inside `${}` is evaluated as JavaScript.

```js
const a = 10;
const b = 5;

console.log(`${a} + ${b} = ${a + b}`);
// 10 + 5 = 15
```

## Expressions Inside `${}`

You can use expressions inside placeholders.

```js
const score = 85;

const result = `You ${score >= 60 ? "passed" : "failed"}.`;

console.log(result); // You passed.
```

You can call functions too:

```js
const name = "alice";

const message = `Hello, ${name.toUpperCase()}!`;

console.log(message); // Hello, ALICE!
```

Keep expressions simple.

If the logic becomes complex, calculate it before the template literal.

## Multi-Line Strings

Template literals can span multiple lines.

```js
const message = `Hello Alice,
Welcome to JavaScript.
Let's build something great.`;

console.log(message);
```

This preserves line breaks.

Before template literals, multi-line strings were awkward:

```js
const message =
  "Hello Alice,\n" +
  "Welcome to JavaScript.\n" +
  "Let's build something great.";
```

Template literals are much cleaner.

## Building HTML Strings

Template literals are often used to build small HTML strings.

```js
const user = {
  name: "Alice",
  role: "admin",
};

const html = `
  <article>
    <h2>${user.name}</h2>
    <p>${user.role}</p>
  </article>
`;
```

Be careful when inserting user-generated content into HTML.

Untrusted content can create security risks.

You will learn more about security later.

## Formatting Data

Template literals are useful for clear formatting.

```js
const order = {
  id: 101,
  total: 2499,
  status: "paid",
};

const summary = `Order #${order.id}: ${order.status} - Rs.${order.total}`;

console.log(summary);
```

Output:

```text
Order #101: paid - Rs.2499
```

## Nested Property Access

Template literals work well with object data.

```js
const user = {
  profile: {
    name: "Alice",
  },
};

const message = `Welcome, ${user.profile.name}!`;

console.log(message); // Welcome, Alice!
```

If nested data may be missing, use optional chaining and a fallback.

```js
const message = `Welcome, ${user.profile?.name ?? "Guest"}!`;
```

## Template Literals vs Concatenation

Concatenation:

```js
const message =
  "Hello, " + user.name + ". You have " + count + " new messages.";
```

Template literal:

```js
const message = `Hello, ${user.name}. You have ${count} new messages.`;
```

Template literals are usually better when a string contains multiple values.

## Tagged Template Literals

Template literals also support advanced behavior called tagged templates.

```js
function tag(strings, value) {
  console.log(strings);
  console.log(value);
}

const name = "Alice";

tag`Hello, ${name}!`;
```

Tagged templates are useful in some libraries, but they are advanced.

You do not need them for everyday beginner JavaScript.

For now, focus on normal template literals.

## Best Practices

Use template literals when a string includes variables:

```js
const message = `Hello, ${name}!`;
```

Use them for multi-line strings:

```js
const text = `Line one
Line two`;
```

Keep expressions inside `${}` simple.

If an expression is complex, calculate it first:

```js
const status = score >= 60 ? "passed" : "failed";
const message = `You ${status}.`;
```

Be careful when building HTML from untrusted data.

## Common Mistakes

### Mistake 1: Using Quotes Instead of Backticks

```js
const name = "Alice";
const message = "Hello, ${name}!";

console.log(message); // Hello, ${name}!
```

Interpolation only works with backticks:

```js
const message = `Hello, ${name}!`;
```

### Mistake 2: Forgetting the Dollar Sign

```js
const message = `Hello, {name}!`;
```

Correct:

```js
const message = `Hello, ${name}!`;
```

### Mistake 3: Putting Too Much Logic Inside `${}`

```js
const message = `${users.filter((user) => user.active).map((user) => user.name).join(", ")}`;
```

This works, but it is hard to read.

Better:

```js
const activeNames = users
  .filter((user) => user.active)
  .map((user) => user.name)
  .join(", ");

const message = `Active users: ${activeNames}`;
```

## Quick Check

What does this log?

```js
const name = "Alice";
const count = 3;

console.log(`${name} has ${count} messages.`);
```

It logs:

```text
Alice has 3 messages.
```

What does this log?

```js
console.log("Hello, ${name}!");
```

It logs:

```text
Hello, ${name}!
```

Interpolation does not work inside regular quotes.

## Summary

Template literals make strings easier to write and read.

- Use backticks for template literals.
- Use `${}` to insert values or expressions.
- Template literals support multi-line strings.
- They are usually clearer than string concatenation.
- Keep expressions inside placeholders simple.
- Be careful when building HTML from untrusted data.
