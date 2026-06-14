# sort and reverse

Sorting and reversing arrays are common tasks.

You might want to:

- sort products by price
- sort users by name
- sort scores from highest to lowest
- reverse messages so the newest appears first
- reverse a list before displaying it

JavaScript gives you two built-in methods for this:

- `.sort()`
- `.reverse()`

They are useful, but they come with two major gotchas:

```text
sort has surprising default behavior.
sort and reverse both mutate the original array.
```

Understanding those two rules will help you avoid many bugs.

## The `reverse` Method

The `.reverse()` method reverses the order of elements in an array.

```js
const letters = ["A", "B", "C", "D"];

letters.reverse();

console.log(letters); // ["D", "C", "B", "A"]
```

The first element becomes the last.

The last element becomes the first.

## `reverse` Mutates the Original Array

This is important:

```text
reverse changes the original array.
```

```js
const letters = ["A", "B", "C", "D"];

const reversed = letters.reverse();

console.log(reversed); // ["D", "C", "B", "A"]
console.log(letters); // ["D", "C", "B", "A"]
```

Both variables show the reversed array.

Why?

Because `.reverse()` mutates the original array and returns a reference to that same array.

## Reversing Without Mutation

If you want to keep the original array unchanged, copy it first.

```js
const letters = ["A", "B", "C", "D"];

const reversed = [...letters].reverse();

console.log(reversed); // ["D", "C", "B", "A"]
console.log(letters); // ["A", "B", "C", "D"]
```

You can also use `slice()`:

```js
const reversed = letters.slice().reverse();
```

Both approaches create a shallow copy before reversing.

## Practical `reverse` Example

Imagine messages are stored oldest to newest:

```js
const messages = [
  "Welcome",
  "Your order shipped",
  "Your order arrived",
];
```

To display newest first without changing the original:

```js
const newestFirst = [...messages].reverse();

console.log(newestFirst);
console.log(messages);
```

Output:

```js
["Your order arrived", "Your order shipped", "Welcome"]
["Welcome", "Your order shipped", "Your order arrived"]
```

The original data remains safe.

## The `sort` Method

The `.sort()` method sorts the elements of an array.

With strings, the default behavior often looks correct:

```js
const names = ["Charlie", "Alice", "Bob"];

names.sort();

console.log(names); // ["Alice", "Bob", "Charlie"]
```

But the default behavior can surprise you with numbers.

```js
const numbers = [10, 2, 1, 25, 3];

numbers.sort();

console.log(numbers); // [1, 10, 2, 25, 3]
```

That is not numeric order.

## Why Default `sort` Is Weird for Numbers

By default, `.sort()` converts elements to strings and sorts them in string order.

That means these numbers:

```js
[10, 2, 1, 25, 3]
```

are compared more like:

```js
["10", "2", "1", "25", "3"]
```

As strings, `"10"` comes before `"2"` because `"1"` comes before `"2"`.

So the result is:

```js
[1, 10, 2, 25, 3]
```

This is the classic `sort` trap.

Rule:

```text
Never sort numbers without a compare function.
```

## The Compare Function

To control sorting, pass a compare function to `.sort()`.

```js
array.sort((a, b) => {
  return a - b;
});
```

The compare function receives two elements:

- `a`
- `b`

It returns a number.

| Return value | Meaning |
| --- | --- |
| Negative number | `a` comes before `b` |
| Positive number | `b` comes before `a` |
| `0` | Keep their relative order |

## Sorting Numbers Ascending

Ascending means smallest to largest.

```js
const numbers = [10, 2, 1, 25, 3];

numbers.sort((a, b) => {
  return a - b;
});

console.log(numbers); // [1, 2, 3, 10, 25]
```

Shorter version:

```js
numbers.sort((a, b) => a - b);
```

How it works:

```js
10 - 2 // 8
```

The result is positive, so `2` should come before `10`.

## Sorting Numbers Descending

Descending means largest to smallest.

```js
const numbers = [10, 2, 1, 25, 3];

numbers.sort((a, b) => {
  return b - a;
});

console.log(numbers); // [25, 10, 3, 2, 1]
```

Shorter version:

```js
numbers.sort((a, b) => b - a);
```

For numbers:

```text
a - b means ascending.
b - a means descending.
```

## `sort` Mutates the Original Array

Just like `reverse`, `sort` changes the original array.

```js
const numbers = [3, 1, 2];

const sorted = numbers.sort((a, b) => a - b);

console.log(sorted); // [1, 2, 3]
console.log(numbers); // [1, 2, 3]
```

The original `numbers` array was changed.

This can be dangerous when other parts of your program expect the original order.

## Sorting Without Mutation

To sort safely, copy the array first.

```js
const numbers = [3, 1, 2];

const sorted = [...numbers].sort((a, b) => a - b);

console.log(sorted); // [1, 2, 3]
console.log(numbers); // [3, 1, 2]
```

You can also use `slice()`:

```js
const sorted = numbers.slice().sort((a, b) => a - b);
```

This pattern is common in modern JavaScript:

```js
const sortedCopy = [...array].sort(compareFunction);
```

## Sorting Strings

Default `sort` can work for simple strings:

```js
const names = ["Charlie", "Alice", "Bob"];

const sortedNames = [...names].sort();

console.log(sortedNames); // ["Alice", "Bob", "Charlie"]
console.log(names); // ["Charlie", "Alice", "Bob"]
```

But string sorting can be affected by capitalization.

```js
const names = ["alice", "Bob", "charlie", "Dana"];

const sortedNames = [...names].sort();

console.log(sortedNames);
```

Uppercase letters may sort before lowercase letters.

For basic beginner examples, default sorting is fine.

For real user-facing text, consider `localeCompare`.

## Sorting Strings With `localeCompare`

`localeCompare` compares strings in a more natural text-aware way.

```js
const names = ["Charlie", "Alice", "Bob"];

const sortedNames = [...names].sort((a, b) => {
  return a.localeCompare(b);
});

console.log(sortedNames); // ["Alice", "Bob", "Charlie"]
```

Descending:

```js
const sortedNames = [...names].sort((a, b) => {
  return b.localeCompare(a);
});

console.log(sortedNames); // ["Charlie", "Bob", "Alice"]
```

For many simple cases, `.sort()` is enough.

For names, labels, or international text, `localeCompare` is safer.

## Sorting Objects by Number Property

In real applications, you often sort arrays of objects.

Example: sort products by price.

```js
const products = [
  { name: "Laptop", price: 999 },
  { name: "Mouse", price: 25 },
  { name: "Monitor", price: 150 },
];

const sortedByPrice = [...products].sort((a, b) => {
  return a.price - b.price;
});

console.log(sortedByPrice);
```

Output:

```js
[
  { name: "Mouse", price: 25 },
  { name: "Monitor", price: 150 },
  { name: "Laptop", price: 999 }
]
```

The original `products` array is unchanged because we used:

```js
[...products]
```

## Sorting Objects by String Property

Use `localeCompare` for string properties.

```js
const users = [
  { name: "Charlie", age: 30 },
  { name: "Alice", age: 25 },
  { name: "Bob", age: 28 },
];

const sortedByName = [...users].sort((a, b) => {
  return a.name.localeCompare(b.name);
});

console.log(sortedByName);
```

Output:

```js
[
  { name: "Alice", age: 25 },
  { name: "Bob", age: 28 },
  { name: "Charlie", age: 30 }
]
```

Descending:

```js
const sortedByNameDesc = [...users].sort((a, b) => {
  return b.name.localeCompare(a.name);
});
```

## Sorting by Multiple Rules

Sometimes you need a backup sort.

For example, sort by role first, then by name.

```js
const users = [
  { name: "Charlie", role: "user" },
  { name: "Alice", role: "admin" },
  { name: "Bob", role: "user" },
  { name: "Dana", role: "admin" },
];

const sortedUsers = [...users].sort((a, b) => {
  const roleCompare = a.role.localeCompare(b.role);

  if (roleCompare !== 0) {
    return roleCompare;
  }

  return a.name.localeCompare(b.name);
});

console.log(sortedUsers);
```

This sorts admins before users, then sorts names within each role.

## Reversing a Sorted Array

You can sort ascending, then reverse to descending.

```js
const numbers = [10, 2, 1, 25, 3];

const descending = [...numbers].sort((a, b) => a - b).reverse();

console.log(descending); // [25, 10, 3, 2, 1]
console.log(numbers); // [10, 2, 1, 25, 3]
```

This works because the copy is sorted and reversed, not the original.

For numbers, this is simpler:

```js
const descending = [...numbers].sort((a, b) => b - a);
```

Use the direct compare function when possible.

## Modern Non-Mutating Alternatives

Modern JavaScript includes non-mutating alternatives in newer environments:

```js
const sorted = numbers.toSorted((a, b) => a - b);
const reversed = numbers.toReversed();
```

These return new arrays and leave the original unchanged.

However, you may still see `sort()` and `reverse()` everywhere.

This course focuses on the methods you are most likely to encounter, so the safe copy pattern is still important:

```js
const sorted = [...numbers].sort((a, b) => a - b);
const reversed = [...numbers].reverse();
```

## `sort` vs `reverse`

| Method | Purpose | Mutates? | Returns |
| --- | --- | --- | --- |
| `sort` | Sorts elements by a rule | Yes | The same sorted array |
| `reverse` | Reverses current order | Yes | The same reversed array |

`reverse` does not sort.

It only flips whatever order the array currently has.

```js
const numbers = [10, 1, 5];

console.log([...numbers].reverse()); // [5, 1, 10]
```

This is not descending numeric order.

It is just the original order reversed.

## Best Practices

Always use a compare function for numeric sorting:

```js
const sorted = [...numbers].sort((a, b) => a - b);
```

Copy before sorting or reversing when you need to preserve the original:

```js
const sorted = [...items].sort(compareFn);
const reversed = [...items].reverse();
```

Use `localeCompare` for string properties:

```js
const sortedUsers = [...users].sort((a, b) => a.name.localeCompare(b.name));
```

Remember that `reverse` only flips order:

```js
const reversed = [...items].reverse();
```

Avoid mutating arrays that are shared or used as state:

```js
const safeSorted = [...stateItems].sort((a, b) => a.price - b.price);
```

## Common Mistakes

### Mistake 1: Sorting Numbers Without a Compare Function

```js
const numbers = [10, 2, 1, 25, 3];

numbers.sort();

console.log(numbers); // [1, 10, 2, 25, 3]
```

Correct:

```js
numbers.sort((a, b) => a - b);
```

### Mistake 2: Forgetting That `sort` Mutates

```js
const original = [3, 1, 2];
const sorted = original.sort((a, b) => a - b);

console.log(original); // [1, 2, 3]
```

Use a copy:

```js
const sorted = [...original].sort((a, b) => a - b);
```

### Mistake 3: Forgetting That `reverse` Mutates

```js
const original = ["A", "B", "C"];
const reversed = original.reverse();

console.log(original); // ["C", "B", "A"]
```

Use a copy:

```js
const reversed = [...original].reverse();
```

### Mistake 4: Using `reverse` Instead of Descending Sort

```js
const numbers = [10, 1, 5];

const descending = [...numbers].reverse();

console.log(descending); // [5, 1, 10]
```

This only reverses the original order.

Use a descending compare function:

```js
const descending = [...numbers].sort((a, b) => b - a);
```

### Mistake 5: Returning a Boolean From the Compare Function

```js
const numbers = [10, 2, 1];

numbers.sort((a, b) => a > b);
```

Compare functions should return a number, not a boolean.

Correct:

```js
numbers.sort((a, b) => a - b);
```

## Quick Check

What does this log?

```js
const numbers = [10, 2, 1];

numbers.sort();

console.log(numbers);
```

It logs:

```js
[1, 10, 2]
```

Default `sort` compares values as strings.

What does this log?

```js
const numbers = [10, 2, 1];

const sorted = [...numbers].sort((a, b) => a - b);

console.log(sorted);
console.log(numbers);
```

It logs:

```js
[1, 2, 10]
[10, 2, 1]
```

The copy was sorted, and the original stayed unchanged.

What does this log?

```js
const letters = ["A", "B", "C"];

const reversed = letters.reverse();

console.log(reversed);
console.log(letters);
```

It logs:

```js
["C", "B", "A"]
["C", "B", "A"]
```

`reverse` mutates the original array.

## Summary

`sort` and `reverse` are useful, but both mutate the original array.

- `reverse()` flips the current order of an array in place.
- `sort()` sorts an array in place.
- Default `sort()` compares values as strings.
- Always use a compare function for numbers.
- Use `(a, b) => a - b` for ascending numeric sort.
- Use `(a, b) => b - a` for descending numeric sort.
- Use `localeCompare` for string properties.
- Copy first with `[...array]` or `array.slice()` when you need immutability.
- `reverse` does not sort; it only flips the current order.
