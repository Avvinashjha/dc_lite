# Rest Parameters

Sometimes you know exactly how many arguments a function should receive.

For example:

```js
function add(a, b) {
  return a + b;
}

console.log(add(2, 3)); // 5
```

This function expects two arguments.

But sometimes you want a function to accept any number of arguments.

For example:

```js
sum(1, 2);
sum(1, 2, 3, 4, 5);
sum();
```

How can one function handle all of those calls?

That is what **rest parameters** are for.

## What Are Rest Parameters?

A rest parameter gathers remaining arguments into an array.

It uses three dots before the parameter name:

```js
function sum(...numbers) {
  return numbers;
}
```

The `...numbers` parameter means:

```text
Collect the remaining arguments into an array named numbers.
```

Example:

```js
function showNumbers(...numbers) {
  console.log(numbers);
}

showNumbers(1, 2, 3); // [1, 2, 3]
showNumbers(10, 20); // [10, 20]
showNumbers(); // []
```

The rest parameter is always an array.

If no arguments are collected, the array is empty.

## Basic Example: Summing Numbers

Rest parameters are useful when you want a function to handle a flexible number of values.

```js
function sum(...numbers) {
  let total = 0;

  for (const number of numbers) {
    total += number;
  }

  return total;
}

console.log(sum(1, 2)); // 3
console.log(sum(10, 20, 30)); // 60
console.log(sum(5)); // 5
console.log(sum()); // 0
```

Each call passes a different number of arguments.

Inside the function, `numbers` is a normal array:

```js
function sum(...numbers) {
  console.log(numbers);
}

sum(1, 2, 3); // [1, 2, 3]
```

Because it is an array, you can loop through it or use array methods.

## Using Array Methods

Since a rest parameter gives you a real array, array methods work directly.

```js
function sum(...numbers) {
  return numbers.reduce(function (total, number) {
    return total + number;
  }, 0);
}

console.log(sum(1, 2, 3)); // 6
```

Here, `reduce()` adds each number into a running total.

You can also use other array methods:

```js
function getPositiveNumbers(...numbers) {
  return numbers.filter(function (number) {
    return number > 0;
  });
}

console.log(getPositiveNumbers(-2, 5, 0, 8, -1)); // [5, 8]
```

The important point is that `numbers` is not array-like. It is an actual array.

## Rest Parameters With Named Parameters

Rest parameters can be combined with regular parameters.

```js
function introduce(host, ...guests) {
  console.log(`Host: ${host}`);
  console.log(`Guests: ${guests.join(", ")}`);
}

introduce("Alice", "Bob", "Charlie", "Dave");
```

Output:

```text
Host: Alice
Guests: Bob, Charlie, Dave
```

The first argument goes into `host`.

All remaining arguments are gathered into `guests`.

| Argument | Where It Goes |
| --- | --- |
| `"Alice"` | `host` |
| `"Bob"` | `guests[0]` |
| `"Charlie"` | `guests[1]` |
| `"Dave"` | `guests[2]` |

If there are no remaining arguments, the rest parameter becomes an empty array:

```js
function introduce(host, ...guests) {
  console.log(`Host: ${host}`);
  console.log(guests);
}

introduce("Alice");
```

Output:

```text
Host: Alice
[]
```

## The Rest Parameter Must Be Last

A function can have only one rest parameter.

That rest parameter must be the last parameter.

This is valid:

```js
function createOrder(customerId, ...items) {
  return {
    customerId,
    items,
  };
}

console.log(createOrder(101, "Laptop", "Mouse", "Keyboard"));
```

Result:

```js
{
  customerId: 101,
  items: ["Laptop", "Mouse", "Keyboard"]
}
```

This is not valid:

```js
function badExample(...items, discount) {
  return items;
}
```

JavaScript will throw a syntax error.

The reason is simple: a rest parameter gathers all remaining arguments.

If another parameter came after it, JavaScript would not know what should be left for that parameter.

## One Rest Parameter Only

You also cannot have more than one rest parameter.

This is not valid:

```js
function badExample(...numbers, ...names) {
  return numbers;
}
```

There can be only one "collect the rest" parameter.

If you need multiple categories of values, use a clearer structure such as an object or array.

For example:

```js
function createReport(title, options) {
  return {
    title,
    authors: options.authors,
    tags: options.tags,
  };
}

const report = createReport("Quarterly Update", {
  authors: ["Ava", "Noah"],
  tags: ["finance", "planning"],
});

console.log(report);
```

When the data has structure, an object is usually clearer than multiple flexible argument lists.

## Rest Parameters vs Extra Arguments

Earlier, you learned that extra arguments are ignored when there are no matching parameters.

```js
function add(a, b) {
  return a + b;
}

console.log(add(2, 3, 4, 5)); // 5
```

The extra values `4` and `5` are passed, but they are not assigned to named parameters.

A rest parameter lets you capture those extra values intentionally:

```js
function add(first, second, ...others) {
  console.log(first); // 2
  console.log(second); // 3
  console.log(others); // [4, 5]
}

add(2, 3, 4, 5);
```

This makes your intent clear.

The function is designed to accept more than two arguments.

## Practical Example: Calculating an Average

Here is a function that calculates the average of any number of scores:

```js
function average(...scores) {
  if (scores.length === 0) {
    return 0;
  }

  let total = 0;

  for (const score of scores) {
    total += score;
  }

  return total / scores.length;
}

console.log(average(80, 90, 100)); // 90
console.log(average(75, 85)); // 80
console.log(average()); // 0
```

The rest parameter makes this function flexible.

The function does not need separate parameters like `score1`, `score2`, and `score3`.

## Practical Example: Building a List

Rest parameters are also useful when you want to collect items.

```js
function createShoppingList(owner, ...items) {
  return {
    owner,
    items,
    itemCount: items.length,
  };
}

const list = createShoppingList("Mira", "apples", "rice", "milk");

console.log(list.owner); // Mira
console.log(list.items); // ["apples", "rice", "milk"]
console.log(list.itemCount); // 3
```

The first argument has a specific meaning: the owner.

The rest of the arguments are gathered as list items.

## Rest Parameters and Default Parameters

Rest parameters and default parameters solve different problems.

A default parameter provides a fallback for one missing value:

```js
function greet(name = "Guest") {
  return `Hello, ${name}!`;
}

console.log(greet()); // Hello, Guest!
```

A rest parameter collects multiple values:

```js
function listNames(...names) {
  return names.join(", ");
}

console.log(listNames("Ava", "Noah", "Mia")); // Ava, Noah, Mia
```

You can use both in the same function, as long as the rest parameter is last:

```js
function sendMessage(priority = "normal", ...recipients) {
  return {
    priority,
    recipients,
  };
}

console.log(sendMessage("urgent", "alice@example.com", "bob@example.com"));
```

Be careful with this design, though.

Because arguments are positional, the first argument always becomes `priority`.

If you want the default priority but still pass recipients, you must pass `undefined`:

```js
console.log(sendMessage(undefined, "alice@example.com"));
```

In many cases, an object parameter is clearer for options:

```js
function sendMessage(options, ...recipients) {
  return {
    priority: options.priority ?? "normal",
    recipients,
  };
}

console.log(sendMessage({}, "alice@example.com"));
```

## Rest Parameters vs Spread Syntax

Rest parameters and spread syntax both use three dots.

They do opposite jobs.

Rest gathers values into an array:

```js
function sum(...numbers) {
  return numbers;
}

console.log(sum(1, 2, 3)); // [1, 2, 3]
```

Spread expands an array into separate values:

```js
const numbers = [1, 2, 3];

console.log(Math.max(...numbers)); // 3
```

Same symbol, different direction:

| Syntax | Meaning |
| --- | --- |
| `function sum(...numbers)` | Gather arguments into an array |
| `Math.max(...numbers)` | Spread an array into individual arguments |

You can remember it this way:

```text
Rest collects.
Spread expands.
```

## The Legacy `arguments` Object

Before rest parameters, JavaScript functions had access to a special value named `arguments`.

```js
function showArguments() {
  console.log(arguments);
}

showArguments("a", "b", "c");
```

The `arguments` object contains the arguments passed to the function.

However, it is not a real array.

That means array methods like `map()`, `filter()`, and `reduce()` do not work directly on it.

Older code often converted it to an array first:

```js
function oldSum() {
  const numbers = Array.from(arguments);

  return numbers.reduce(function (total, number) {
    return total + number;
  }, 0);
}

console.log(oldSum(1, 2, 3)); // 6
```

Modern JavaScript uses rest parameters instead:

```js
function sum(...numbers) {
  return numbers.reduce(function (total, number) {
    return total + number;
  }, 0);
}

console.log(sum(1, 2, 3)); // 6
```

The modern version is clearer.

## Rest Parameters vs `arguments`

| Feature | Rest Parameters | `arguments` Object |
| --- | --- | --- |
| Syntax | `function fn(...args) {}` | Available automatically in regular functions |
| Real array? | Yes | No |
| Works with array methods? | Yes | Not directly |
| Can choose the name? | Yes | No, always `arguments` |
| Includes named parameters? | Only what the rest parameter collects | All arguments passed to the function |
| Modern preference | Preferred | Mostly legacy code |

Rest parameters also make your function's intent visible in the parameter list:

```js
function sum(...numbers) {
  return numbers.reduce(function (total, number) {
    return total + number;
  }, 0);
}
```

Anyone reading the function can immediately see that it accepts a flexible number of `numbers`.

## A Preview: Rest in Destructuring

The same three-dot syntax can also gather remaining values during destructuring.

You will study destructuring in more detail later, but here is a quick preview.

Array example:

```js
const numbers = [10, 20, 30, 40];

const [first, second, ...remaining] = numbers;

console.log(first); // 10
console.log(second); // 20
console.log(remaining); // [30, 40]
```

Object example:

```js
const user = {
  name: "Alice",
  age: 30,
  role: "admin",
  location: "NY",
};

const { name, age, ...restOfUser } = user;

console.log(name); // Alice
console.log(age); // 30
console.log(restOfUser); // { role: "admin", location: "NY" }
```

This is still rest syntax because it gathers what is left.

In this lesson, the main focus is rest parameters in function definitions.

## Best Practices

Use meaningful names:

```js
function sum(...numbers) {
  return numbers.reduce(function (total, number) {
    return total + number;
  }, 0);
}
```

This is clearer than:

```js
function sum(...args) {
  return args.reduce(function (total, arg) {
    return total + arg;
  }, 0);
}
```

Use rest parameters when a function is intentionally flexible:

```js
function combineWords(...words) {
  return words.join(" ");
}

console.log(combineWords("JavaScript", "is", "fun")); // JavaScript is fun
```

Keep required parameters before the rest parameter:

```js
function logEvent(eventName, ...details) {
  return {
    eventName,
    details,
  };
}
```

Prefer rest parameters over `arguments` in modern code:

```js
function modernFunction(...values) {
  return values.length;
}
```

Use an object when the arguments have many different meanings:

```js
function createUser(options) {
  return {
    name: options.name,
    role: options.role ?? "viewer",
    active: options.active ?? true,
  };
}
```

A rest parameter is best for a list of similar values, such as numbers, names, items, or callbacks.

## Common Mistakes

### Mistake 1: Putting a Parameter After Rest

```js
function badExample(...items, lastItem) {
  return lastItem;
}
```

This causes a syntax error.

The rest parameter must be last.

### Mistake 2: Using More Than One Rest Parameter

```js
function badExample(...names, ...scores) {
  return names;
}
```

This also causes a syntax error.

Only one rest parameter is allowed.

### Mistake 3: Thinking Rest and Spread Are the Same

```js
function showValues(...values) {
  console.log(values);
}

const numbers = [1, 2, 3];

showValues(...numbers);
```

In the function definition, `...values` is rest. It gathers arguments.

In the function call, `...numbers` is spread. It expands the array.

The same three dots can mean different things depending on where they appear.

### Mistake 4: Using Rest for Unrelated Values

```js
function createProfile(...values) {
  return {
    name: values[0],
    age: values[1],
    role: values[2],
  };
}
```

This is hard to read because the meaning depends on index positions.

Use named parameters or an object instead:

```js
function createProfile(user) {
  return {
    name: user.name,
    age: user.age,
    role: user.role,
  };
}
```

## Quick Check

What does this log?

```js
function showItems(first, ...rest) {
  console.log(first);
  console.log(rest);
}

showItems("a", "b", "c");
```

It logs:

```text
a
["b", "c"]
```

The first argument goes into `first`.

The remaining arguments are gathered into `rest`.

What does this return?

```js
function countItems(...items) {
  return items.length;
}

countItems("pen", "book", "bag");
```

It returns:

```js
3
```

The rest parameter gathers three arguments into the `items` array.

## Summary

Rest parameters let a function accept a flexible number of arguments.

- Use `...name` in the parameter list to create a rest parameter.
- A rest parameter gathers remaining arguments into a real array.
- If no arguments are gathered, the rest parameter is an empty array.
- A function can have only one rest parameter.
- The rest parameter must be last.
- Rest parameters are clearer and more useful than the legacy `arguments` object.
- Rest gathers values, while spread expands values.
