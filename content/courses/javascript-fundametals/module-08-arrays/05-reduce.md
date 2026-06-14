# reduce

If one array method intimidates beginners, it is usually `.reduce()`.

The syntax can look strange at first.

But the core idea is simple:

```text
reduce takes an array and reduces it to one final result.
```

That final result can be:

- a number
- a string
- an object
- another array
- any other JavaScript value

Think of `reduce` like a running total.

It starts with an initial value, then updates that value as it processes each item.

## What Is `reduce`?

`reduce` is an array method that runs a callback on each element and builds one final result.

```js
const numbers = [1, 2, 3, 4];

const total = numbers.reduce((accumulator, currentValue) => {
  return accumulator + currentValue;
}, 0);

console.log(total); // 10
```

The result is a single number: `10`.

The array was reduced into one value.

## The Big Idea

You can read `reduce` like this:

```text
Start with an initial value.
Look at each item in the array.
Use the current item to update the accumulator.
Return the accumulator for the next step.
At the end, return the final accumulator.
```

The most important word is **accumulator**.

The accumulator is the value being built over time.

## Basic Syntax

```js
const result = array.reduce(function (accumulator, currentValue, index, array) {
  return updatedAccumulator;
}, initialValue);
```

The callback can receive four arguments:

| Argument | Meaning | Common? |
| --- | --- | --- |
| `accumulator` | The running result being built | Yes |
| `currentValue` | The current array element | Yes |
| `index` | The index of the current element | Sometimes |
| `array` | The original array | Rarely |

After the callback, you provide the **initial value**:

```js
}, initialValue);
```

This initial value is what the accumulator starts as.

## The Accumulator

The accumulator is the "running result."

For a sum, the accumulator is the running total:

```js
const numbers = [1, 2, 3];

const total = numbers.reduce((sum, number) => {
  return sum + number;
}, 0);

console.log(total); // 6
```

Here:

- `sum` is the accumulator
- `number` is the current value
- `0` is the initial value

The callback returns the next accumulator value.

## Step-by-Step Sum Example

```js
const numbers = [1, 2, 3, 4];

const sum = numbers.reduce((accumulator, currentValue) => {
  return accumulator + currentValue;
}, 0);

console.log(sum); // 10
```

Step by step:

| Step | Accumulator before | Current value | Callback returns |
| --- | --- | --- | --- |
| Start | `0` | none | `0` |
| 1 | `0` | `1` | `1` |
| 2 | `1` | `2` | `3` |
| 3 | `3` | `3` | `6` |
| 4 | `6` | `4` | `10` |

At the end, `reduce` returns `10`.

## Logging the Accumulator

You can log each step to see how it works.

```js
const numbers = [1, 2, 3, 4];

const sum = numbers.reduce((accumulator, currentValue) => {
  console.log(`Accumulator: ${accumulator}, Current: ${currentValue}`);

  return accumulator + currentValue;
}, 0);

console.log(`Final result: ${sum}`);
```

Output:

```text
Accumulator: 0, Current: 1
Accumulator: 1, Current: 2
Accumulator: 3, Current: 3
Accumulator: 6, Current: 4
Final result: 10
```

Every return value becomes the accumulator for the next iteration.

## Always Provide an Initial Value

The initial value is optional in JavaScript, but you should usually provide it.

```js
const total = numbers.reduce((sum, number) => {
  return sum + number;
}, 0);
```

The `0` is the initial value.

It makes the code predictable.

It also makes empty arrays safe:

```js
const numbers = [];

const total = numbers.reduce((sum, number) => {
  return sum + number;
}, 0);

console.log(total); // 0
```

Without an initial value, reducing an empty array throws a `TypeError`.

```js
const numbers = [];

const total = numbers.reduce((sum, number) => {
  return sum + number;
});

// TypeError
```

Best practice:

```text
Always provide an initial value unless you have a specific reason not to.
```

## What Happens Without an Initial Value?

If you do not provide an initial value, JavaScript uses the first array element as the accumulator.

Then it starts with the second element.

```js
const numbers = [1, 2, 3, 4];

const sum = numbers.reduce((accumulator, currentValue) => {
  return accumulator + currentValue;
});

console.log(sum); // 10
```

This works for simple number sums.

But it can be confusing because the first callback call starts with:

```js
accumulator // 1
currentValue // 2
```

With an initial value of `0`, the first callback call starts with:

```js
accumulator // 0
currentValue // 1
```

Providing the initial value makes the flow easier to understand.

## Multiplying Values

`reduce` is not only for addition.

You can multiply values:

```js
const numbers = [2, 3, 4];

const product = numbers.reduce((accumulator, number) => {
  return accumulator * number;
}, 1);

console.log(product); // 24
```

The initial value is `1` because `1` is the neutral starting point for multiplication.

If you started with `0`, the result would always be `0`.

Choosing the right initial value matters.

## Building a String

`reduce` can build strings.

```js
const words = ["JavaScript", "is", "powerful"];

const sentence = words.reduce((accumulator, word) => {
  return `${accumulator} ${word}`;
}, "");

console.log(sentence); //  JavaScript is powerful
```

This works, but it leaves an extra space at the beginning.

For joining strings, `.join()` is usually better:

```js
const sentence = words.join(" ");

console.log(sentence); // JavaScript is powerful
```

This is an important lesson:

```text
reduce is powerful, but not always the clearest tool.
```

Use the simplest method that expresses your intent.

## Summing Object Values

`reduce` is useful when working with arrays of objects.

```js
const cart = [
  { name: "Keyboard", price: 50 },
  { name: "Mouse", price: 25 },
  { name: "Monitor", price: 200 },
];

const total = cart.reduce((sum, item) => {
  return sum + item.price;
}, 0);

console.log(total); // 275
```

The accumulator starts at `0`.

Each item adds its `price` to the running total.

This is a common real-world use case.

## Counting Occurrences

`reduce` can build an object.

For example, count how many times each fruit appears:

```js
const fruits = ["apple", "banana", "apple", "orange", "banana", "apple"];

const counts = fruits.reduce((accumulator, fruit) => {
  accumulator[fruit] = (accumulator[fruit] || 0) + 1;

  return accumulator;
}, {});

console.log(counts);
```

Output:

```js
{
  apple: 3,
  banana: 2,
  orange: 1
}
```

The initial value is an empty object:

```js
{}
```

The accumulator becomes the object being built.

## Counting Occurrences Step by Step

Start:

```js
{}
```

After `"apple"`:

```js
{ apple: 1 }
```

After `"banana"`:

```js
{ apple: 1, banana: 1 }
```

After another `"apple"`:

```js
{ apple: 2, banana: 1 }
```

This line handles both first-time and repeated values:

```js
accumulator[fruit] = (accumulator[fruit] || 0) + 1;
```

If the fruit is not in the object yet, `accumulator[fruit]` is `undefined`.

So the expression becomes:

```js
0 + 1
```

If the fruit already has a count, it adds `1`.

## Grouping Items

`reduce` can group objects by a property.

```js
const users = [
  { name: "Alice", role: "admin" },
  { name: "Bob", role: "user" },
  { name: "Charlie", role: "user" },
  { name: "Dana", role: "admin" },
];

const usersByRole = users.reduce((groups, user) => {
  if (!groups[user.role]) {
    groups[user.role] = [];
  }

  groups[user.role].push(user);

  return groups;
}, {});

console.log(usersByRole);
```

Output:

```js
{
  admin: [
    { name: "Alice", role: "admin" },
    { name: "Dana", role: "admin" }
  ],
  user: [
    { name: "Bob", role: "user" },
    { name: "Charlie", role: "user" }
  ]
}
```

The accumulator is an object.

Each key stores an array of users with that role.

## Flattening an Array of Arrays

`reduce` can also build a new array.

```js
const nestedArrays = [
  [1, 2],
  [3, 4],
  [5, 6],
];

const flat = nestedArrays.reduce((accumulator, currentArray) => {
  return accumulator.concat(currentArray);
}, []);

console.log(flat); // [1, 2, 3, 4, 5, 6]
```

The initial value is an empty array:

```js
[]
```

Each step concatenates another array.

Modern JavaScript also has `.flat()`:

```js
const flat = nestedArrays.flat();
```

For simple flattening, `.flat()` is clearer.

But the `reduce` version helps you understand how arrays can be accumulated.

## Finding a Maximum Value

You can use `reduce` to find the highest number.

```js
const scores = [45, 12, 89, 33, 67];

const highestScore = scores.reduce((max, score) => {
  return score > max ? score : max;
}, 0);

console.log(highestScore); // 89
```

The accumulator is the highest score seen so far.

For this data, `0` works as an initial value because all scores are positive.

But if numbers could be negative, choose the initial value carefully:

```js
const scores = [-10, -5, -30];

const highestScore = scores.reduce((max, score) => {
  return score > max ? score : max;
}, Number.NEGATIVE_INFINITY);

console.log(highestScore); // -5
```

## Returning New Objects vs Mutating the Accumulator

Many `reduce` examples mutate the accumulator object:

```js
const counts = fruits.reduce((accumulator, fruit) => {
  accumulator[fruit] = (accumulator[fruit] || 0) + 1;
  return accumulator;
}, {});
```

This is common and usually fine because the accumulator object was created specifically for the reduce operation.

You can also return a new object each time:

```js
const counts = fruits.reduce((accumulator, fruit) => {
  return {
    ...accumulator,
    [fruit]: (accumulator[fruit] || 0) + 1,
  };
}, {});
```

This is more immutable, but it can be less efficient for large arrays.

For beginners, focus on clarity.

The key rule is:

```text
Always return the next accumulator.
```

## Forgetting to Return the Accumulator

This is the most common `reduce` mistake.

```js
const numbers = [1, 2, 3];

const sum = numbers.reduce((accumulator, number) => {
  accumulator + number;
}, 0);

console.log(sum); // undefined
```

The callback does not return anything.

So the accumulator becomes `undefined` after the first callback call.

Correct:

```js
const sum = numbers.reduce((accumulator, number) => {
  return accumulator + number;
}, 0);
```

Or:

```js
const sum = numbers.reduce((accumulator, number) => accumulator + number, 0);
```

## Choosing the Initial Value

The initial value should match the type of result you want.

| Goal | Initial value |
| --- | --- |
| Sum numbers | `0` |
| Multiply numbers | `1` |
| Build an object | `{}` |
| Build an array | `[]` |
| Build a string | `""` |

Examples:

```js
const sum = numbers.reduce((total, number) => total + number, 0);
```

```js
const items = values.reduce((array, value) => {
  array.push(value);
  return array;
}, []);
```

```js
const lookup = users.reduce((object, user) => {
  object[user.id] = user;
  return object;
}, {});
```

The initial value tells readers what kind of result `reduce` is building.

## `reduce` vs Other Array Methods

`reduce` is flexible, but that does not mean you should use it for everything.

Use `map` for transformations:

```js
const doubled = numbers.map((number) => number * 2);
```

Use `filter` for selecting items:

```js
const adults = users.filter((user) => user.age >= 18);
```

Use `find` when you need one matching item:

```js
const user = users.find((user) => user.id === 1);
```

Use `reduce` when you need to build one accumulated result:

```js
const total = cart.reduce((sum, item) => sum + item.price, 0);
```

If another method expresses your intent more clearly, use that method.

## Chaining With `map` and `filter`

Sometimes `reduce` appears after `map` or `filter`.

```js
const users = [
  { name: "Alice", age: 25, purchases: 3 },
  { name: "Bob", age: 17, purchases: 2 },
  { name: "Charlie", age: 30, purchases: 5 },
];

const adultPurchaseCount = users
  .filter((user) => user.age >= 18)
  .reduce((total, user) => {
    return total + user.purchases;
  }, 0);

console.log(adultPurchaseCount); // 8
```

Step by step:

1. `filter` keeps adult users.
2. `reduce` sums their purchase counts.

This kind of chain can be readable when each step has a clear purpose.

## Best Practices

Always provide an initial value:

```js
const total = numbers.reduce((sum, number) => sum + number, 0);
```

Always return the accumulator:

```js
const total = numbers.reduce((sum, number) => {
  return sum + number;
}, 0);
```

Use meaningful accumulator names:

```js
const totalPrice = cart.reduce((total, item) => {
  return total + item.price;
}, 0);
```

Choose an initial value that matches the result type:

```js
const counts = fruits.reduce((countsByFruit, fruit) => {
  countsByFruit[fruit] = (countsByFruit[fruit] || 0) + 1;
  return countsByFruit;
}, {});
```

Do not use `reduce` when a simpler method is clearer:

```js
const names = users.map((user) => user.name);
```

This is better than using `reduce` just to build the same array.

## Common Mistakes

### Mistake 1: Forgetting `return`

```js
const numbers = [1, 2, 3];

const total = numbers.reduce((sum, number) => {
  sum + number;
}, 0);

console.log(total); // undefined
```

Correct:

```js
const total = numbers.reduce((sum, number) => {
  return sum + number;
}, 0);
```

### Mistake 2: Forgetting the Initial Value

```js
const numbers = [];

const total = numbers.reduce((sum, number) => {
  return sum + number;
});
```

This throws a `TypeError`.

Correct:

```js
const total = numbers.reduce((sum, number) => {
  return sum + number;
}, 0);
```

### Mistake 3: Using the Wrong Initial Value

```js
const numbers = [2, 3, 4];

const product = numbers.reduce((total, number) => {
  return total * number;
}, 0);

console.log(product); // 0
```

For multiplication, start with `1`:

```js
const product = numbers.reduce((total, number) => {
  return total * number;
}, 1);

console.log(product); // 24
```

### Mistake 4: Making `reduce` Too Clever

```js
const result = users.reduce((acc, user) => {
  // filtering, transforming, grouping, and sorting all at once
}, {});
```

`reduce` can do many things, but that does not mean one `reduce` should do everything.

Split complex logic into clearer steps when needed:

```js
const activeUsers = users.filter((user) => user.isActive);
const names = activeUsers.map((user) => user.name);
```

Clear code is better than clever code.

## Quick Check

What does this return?

```js
const numbers = [1, 2, 3];

const total = numbers.reduce((sum, number) => {
  return sum + number;
}, 0);
```

It returns:

```js
6
```

What does this return?

```js
const numbers = [2, 3, 4];

const product = numbers.reduce((total, number) => {
  return total * number;
}, 1);
```

It returns:

```js
24
```

What initial value should you use when building an object?

Use:

```js
{}
```

Example:

```js
const counts = fruits.reduce((object, fruit) => {
  object[fruit] = (object[fruit] || 0) + 1;
  return object;
}, {});
```

## Summary

`reduce` turns an array into one final result.

- The accumulator is the running result.
- The current value is the array item being processed.
- The callback must return the next accumulator.
- The initial value is the accumulator's starting value.
- Always provide an initial value for predictable behavior.
- Use `0` for sums, `1` for products, `{}` for objects, and `[]` for arrays.
- `reduce` can build numbers, strings, objects, arrays, or other values.
- Use simpler methods like `map`, `filter`, `find`, or `join` when they express the intent more clearly.
