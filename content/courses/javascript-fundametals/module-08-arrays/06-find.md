# find

Sometimes you do not want to transform every item with `.map()`.

You do not want all matching items with `.filter()`.

You do not want to reduce the array into a total with `.reduce()`.

Sometimes you just want to find **one specific item**.

That is what **`.find()`** is for.

## What Is `find`?

`find` is an array method that returns the first element that passes a test.

```js
const numbers = [5, 8, 12, 15, 20];

const firstLargeNumber = numbers.find((number) => {
  return number > 10;
});

console.log(firstLargeNumber); // 12
```

The numbers `15` and `20` are also greater than `10`.

But `.find()` stops at the first match.

It returns the element itself, not an array.

## The Big Idea

You can read `.find()` like this:

```text
Look at each item.
Return the first item that passes the condition.
Stop searching after the first match.
If nothing matches, return undefined.
```

This makes `.find()` perfect when you expect one result.

## Basic Syntax

```js
const foundItem = array.find(function (currentValue, index, array) {
  return condition;
});
```

The callback can receive three arguments:

| Argument | Meaning | Common? |
| --- | --- | --- |
| `currentValue` | The current element being checked | Yes |
| `index` | The index of the current element | Sometimes |
| `array` | The original array | Rarely |

The callback should return:

- `true` or a truthy value when this is the item you want
- `false` or a falsy value when this is not the item you want

## Basic Example: Finding a Number

```js
const numbers = [5, 8, 12, 15, 20];

const firstLargeNumber = numbers.find((number) => {
  return number > 10;
});

console.log(firstLargeNumber); // 12
```

Step by step:

| Number | Condition `number > 10` | Result |
| --- | --- | --- |
| `5` | `false` | Keep searching |
| `8` | `false` | Keep searching |
| `12` | `true` | Return `12` and stop |

`find` does not keep searching after it finds `12`.

## Concise Arrow Function Syntax

When the condition is simple, use a concise arrow function.

```js
const numbers = [5, 8, 12, 15, 20];

const firstLargeNumber = numbers.find((number) => number > 10);

console.log(firstLargeNumber); // 12
```

This:

```js
(number) => number > 10
```

is the short version of:

```js
(number) => {
  return number > 10;
}
```

## Finding a String

You can use `find` with strings.

```js
const names = ["Ava", "Noah", "Mira", "Nina"];

const firstLongName = names.find((name) => {
  return name.length > 3;
});

console.log(firstLongName); // Noah
```

`"Noah"` is the first name with more than three characters.

`"Mira"` and `"Nina"` also match, but `find` returns only the first match.

## Finding an Object by ID

The most common real-world use of `find` is searching an array of objects by ID.

```js
const users = [
  { id: 1, name: "Alice", role: "admin" },
  { id: 2, name: "Bob", role: "user" },
  { id: 3, name: "Charlie", role: "user" },
];

const targetUser = users.find((user) => {
  return user.id === 2;
});

console.log(targetUser);
```

Output:

```js
{ id: 2, name: "Bob", role: "user" }
```

Now you can access the user's properties:

```js
console.log(targetUser.name); // Bob
```

This is common when working with data from APIs.

## Finding by Multiple Conditions

You can combine conditions.

```js
const products = [
  { name: "Laptop", price: 999, inStock: true },
  { name: "Mouse", price: 25, inStock: false },
  { name: "Keyboard", price: 75, inStock: true },
];

const affordableAvailableProduct = products.find((product) => {
  return product.inStock && product.price < 100;
});

console.log(affordableAvailableProduct);
```

Output:

```js
{ name: "Keyboard", price: 75, inStock: true }
```

The condition requires both:

- `product.inStock` to be truthy
- `product.price < 100` to be true

## When Nothing Matches

If no item matches, `.find()` returns `undefined`.

```js
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

const missingUser = users.find((user) => {
  return user.id === 99;
});

console.log(missingUser); // undefined
```

This is not an error.

It simply means no matching element was found.

But you must handle this carefully.

## The `undefined` Pitfall

If `.find()` returns `undefined`, trying to read a property from the result will crash.

```js
const users = [{ id: 1, name: "Alice" }];

const missingUser = users.find((user) => user.id === 99);

console.log(missingUser.name); // TypeError
```

Why?

Because this is really:

```js
undefined.name
```

You cannot read `.name` from `undefined`.

## Checking Before Property Access

Use an `if` statement:

```js
const missingUser = users.find((user) => user.id === 99);

if (missingUser) {
  console.log(missingUser.name);
} else {
  console.log("User not found");
}
```

This is safe.

The property is only accessed when a user exists.

## Using Optional Chaining

You can also use optional chaining.

```js
const missingUser = users.find((user) => user.id === 99);

console.log(missingUser?.name); // undefined
```

Optional chaining stops safely if `missingUser` is `null` or `undefined`.

You can combine it with nullish coalescing:

```js
const displayName = missingUser?.name ?? "Unknown user";

console.log(displayName); // Unknown user
```

This pattern is common in modern JavaScript.

## `find` vs `filter`

It is easy to confuse `find` and `filter`.

Use `filter` when you want all matching items.

Use `find` when you only want the first matching item.

```js
const numbers = [1, 2, 3, 4, 5, 6];

const evens = numbers.filter((number) => number % 2 === 0);
const firstEven = numbers.find((number) => number % 2 === 0);

console.log(evens); // [2, 4, 6]
console.log(firstEven); // 2
```

Key difference:

| Method | Returns | How many matches? |
| --- | --- | --- |
| `filter` | A new array | All matches |
| `find` | The element itself or `undefined` | First match only |

## `find` Stops Early

`find` stops as soon as the callback returns `true`.

```js
const numbers = [1, 2, 3, 4, 5];

const result = numbers.find((number) => {
  console.log(`Checking ${number}`);
  return number > 2;
});

console.log(result); // 3
```

Output:

```text
Checking 1
Checking 2
Checking 3
3
```

It does not check `4` or `5`.

This can make `find` more efficient than `filter` when you only need one item.

## `find` Returns the Original Element

`find` does not transform the matching item.

It returns the element from the original array.

```js
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

const user = users.find((user) => user.id === 2);

console.log(user); // { id: 2, name: "Bob" }
```

If the element is an object, the returned value is a reference to that object.

```js
user.name = "Robert";

console.log(users[1].name); // Robert
```

This happens because objects are reference values.

If you do not want to mutate the original object, create a copy before changing it:

```js
const updatedUser = {
  ...user,
  name: "Robert",
};
```

## The Companion: `findIndex`

Sometimes you need the position of the matching item instead of the item itself.

Use `.findIndex()`.

```js
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

const bobIndex = users.findIndex((user) => {
  return user.name === "Bob";
});

console.log(bobIndex); // 1
```

`findIndex` uses the same kind of callback as `find`.

But it returns the index.

## When `findIndex` Finds Nothing

If `findIndex` does not find a match, it returns `-1`.

```js
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

const missingIndex = users.findIndex((user) => {
  return user.name === "Charlie";
});

console.log(missingIndex); // -1
```

This is different from `find`, which returns `undefined`.

| Method | Not found result |
| --- | --- |
| `find` | `undefined` |
| `findIndex` | `-1` |

Always check for `-1` before using the index.

```js
if (missingIndex !== -1) {
  console.log(users[missingIndex]);
}
```

## Using `findIndex` to Update an Item

`findIndex` can help when you need to update an item in an array.

```js
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

const index = users.findIndex((user) => user.id === 2);

if (index !== -1) {
  users[index] = {
    ...users[index],
    name: "Robert",
  };
}

console.log(users);
```

This updates the user at the found index.

Later, you will learn more patterns for updating arrays safely.

## `find` vs `includes`

You will learn `includes` later in this module.

For now:

- use `includes` to check whether a simple value exists
- use `find` when you need a condition or an object match

Simple value:

```js
const roles = ["admin", "editor", "viewer"];

console.log(roles.includes("admin")); // true
```

Object condition:

```js
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

const user = users.find((user) => user.id === 2);

console.log(user); // { id: 2, name: "Bob" }
```

## Best Practices

Use `find` when you only need the first match:

```js
const user = users.find((user) => user.id === targetId);
```

Always handle `undefined`:

```js
const user = users.find((user) => user.id === targetId);

if (!user) {
  console.log("User not found");
}
```

Use optional chaining for safe property access:

```js
const userName = user?.name ?? "Unknown";
```

Use `filter` when you need all matches:

```js
const activeUsers = users.filter((user) => user.isActive);
```

Use `findIndex` when you need the index:

```js
const index = users.findIndex((user) => user.id === targetId);
```

## Common Mistakes

### Mistake 1: Expecting `find` to Return an Array

```js
const numbers = [1, 2, 3, 4];

const result = numbers.find((number) => number % 2 === 0);

console.log(result); // 2
```

`find` returns the first matching element, not an array.

Use `filter` for all matches:

```js
const evens = numbers.filter((number) => number % 2 === 0);

console.log(evens); // [2, 4]
```

### Mistake 2: Not Handling `undefined`

```js
const user = users.find((user) => user.id === 99);

console.log(user.name); // TypeError if user is undefined
```

Use a guard:

```js
if (user) {
  console.log(user.name);
}
```

Or optional chaining:

```js
console.log(user?.name);
```

### Mistake 3: Forgetting `return`

```js
const users = [{ id: 1 }, { id: 2 }];

const user = users.find((user) => {
  user.id === 2;
});

console.log(user); // undefined
```

With braces, arrow functions need an explicit `return`.

Correct:

```js
const user = users.find((user) => {
  return user.id === 2;
});
```

Or:

```js
const user = users.find((user) => user.id === 2);
```

### Mistake 4: Confusing `find` and `findIndex`

```js
const user = users.find((user) => user.id === 2);
```

This returns the user object.

```js
const index = users.findIndex((user) => user.id === 2);
```

This returns the index.

Use the one that matches what you need.

## Quick Check

What does this return?

```js
const numbers = [3, 7, 12, 20];

const result = numbers.find((number) => number > 10);
```

It returns:

```js
12
```

`12` is the first number greater than `10`.

What does this return?

```js
const numbers = [1, 3, 5];

const result = numbers.find((number) => number % 2 === 0);
```

It returns:

```js
undefined
```

No item matches the condition.

What does this return?

```js
const users = [{ id: 1 }, { id: 2 }];

const index = users.findIndex((user) => user.id === 2);
```

It returns:

```js
1
```

The matching user is at index `1`.

## Summary

`find` searches an array and returns the first item that matches a condition.

- Use `find` when you only need one matching item.
- The callback should return `true` or a truthy value for the item you want.
- `find` returns the element itself, not an array.
- `find` returns `undefined` if nothing matches.
- Always guard against `undefined` before reading properties.
- Use optional chaining like `user?.name` for safe property access.
- Use `filter` when you need all matching items.
- Use `findIndex` when you need the matching item's index.
