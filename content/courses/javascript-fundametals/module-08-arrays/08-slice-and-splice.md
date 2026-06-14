# slice and splice

`slice()` and `splice()` sound almost identical.

They are also both array methods.

But they behave very differently.

This difference is important because one method is safe and non-mutating, while the other changes the original array.

In short:

```text
slice extracts.
splice modifies.
```

## The Big Difference

`slice()` returns a selected part of an array as a new array.

It does not change the original array.

`splice()` changes the original array by adding, removing, or replacing elements.

It returns the removed elements.

```js
const items = ["A", "B", "C", "D"];

const sliced = items.slice(1, 3);

console.log(sliced); // ["B", "C"]
console.log(items); // ["A", "B", "C", "D"]
```

```js
const items = ["A", "B", "C", "D"];

const removed = items.splice(1, 2);

console.log(removed); // ["B", "C"]
console.log(items); // ["A", "D"]
```

The first example leaves `items` alone.

The second example changes `items`.

## `slice`: The Safe Extractor

The `.slice()` method returns a shallow copy of part of an array.

It does not mutate the original array.

Syntax:

```js
array.slice(startIndex, endIndex);
```

The parameters are:

| Parameter | Meaning |
| --- | --- |
| `startIndex` | Where extraction starts, inclusive |
| `endIndex` | Where extraction stops, exclusive |

The end index is not included.

## Basic `slice` Example

```js
const fruits = ["Apple", "Banana", "Cherry", "Date", "Elderberry"];

const sliced = fruits.slice(1, 3);

console.log(sliced); // ["Banana", "Cherry"]
console.log(fruits); // ["Apple", "Banana", "Cherry", "Date", "Elderberry"]
```

`slice(1, 3)` means:

```text
Start at index 1.
Stop before index 3.
```

The values included are:

- index `1`: `"Banana"`
- index `2`: `"Cherry"`

Index `3` is not included.

## Why the End Index Is Exclusive

The second argument can feel confusing at first.

```js
const fruits = ["Apple", "Banana", "Cherry", "Date"];

console.log(fruits.slice(1, 3)); // ["Banana", "Cherry"]
```

The item at index `3` is `"Date"`.

But it is not included.

You can think of the range like this:

```text
Include start.
Exclude end.
```

This pattern appears in many JavaScript APIs.

## Omitting the End Index

If you omit the end index, `slice` goes to the end of the array.

```js
const fruits = ["Apple", "Banana", "Cherry", "Date", "Elderberry"];

const fromCherry = fruits.slice(2);

console.log(fromCherry); // ["Cherry", "Date", "Elderberry"]
```

`slice(2)` means:

```text
Start at index 2 and continue to the end.
```

## Using Negative Indexes With `slice`

`slice` supports negative indexes.

A negative index counts from the end of the array.

```js
const fruits = ["Apple", "Banana", "Cherry", "Date", "Elderberry"];

console.log(fruits.slice(-2)); // ["Date", "Elderberry"]
```

`slice(-2)` means:

```text
Start two items from the end.
```

Another example:

```js
console.log(fruits.slice(-3, -1)); // ["Cherry", "Date"]
```

This starts three items from the end and stops before the last item.

## Cloning an Array With `slice`

Calling `slice()` with no arguments creates a shallow copy of the whole array.

```js
const original = ["A", "B", "C"];
const copy = original.slice();

copy.push("D");

console.log(original); // ["A", "B", "C"]
console.log(copy); // ["A", "B", "C", "D"]
```

This is similar to using spread syntax:

```js
const copy = [...original];
```

Both create a shallow copy.

## `slice` Creates a Shallow Copy

The copy is shallow.

That means nested objects are still shared.

```js
const users = [{ name: "Alice" }, { name: "Bob" }];

const copy = users.slice();

copy[0].name = "Ava";

console.log(users[0].name); // Ava
```

The array was copied.

But the object inside the array was not deeply copied.

This is the same shallow-copy behavior you saw with spread syntax.

## Practical Uses for `slice`

Use `slice` when you want part of an array without changing the original.

Get the first three items:

```js
const scores = [95, 88, 72, 100, 64];

const firstThree = scores.slice(0, 3);

console.log(firstThree); // [95, 88, 72]
```

Get all items except the first:

```js
const rest = scores.slice(1);

console.log(rest); // [88, 72, 100, 64]
```

Get the last two items:

```js
const lastTwo = scores.slice(-2);

console.log(lastTwo); // [100, 64]
```

Create a copy before sorting:

```js
const scoresCopy = scores.slice();
```

You will see why this matters in the next lesson on `sort` and `reverse`.

## `splice`: The Mutator

The `.splice()` method changes an array.

It can:

- remove elements
- add elements
- replace elements

It mutates the original array.

It returns an array of the removed elements.

Syntax:

```js
array.splice(startIndex, deleteCount, item1, item2, ...);
```

The parameters are:

| Parameter | Meaning |
| --- | --- |
| `startIndex` | Where to start changing the array |
| `deleteCount` | How many elements to remove |
| `item1, item2, ...` | Optional items to insert |

## Removing Elements With `splice`

```js
const colors = ["Red", "Green", "Blue", "Yellow"];

const removed = colors.splice(1, 2);

console.log(removed); // ["Green", "Blue"]
console.log(colors); // ["Red", "Yellow"]
```

`splice(1, 2)` means:

```text
Start at index 1.
Remove 2 elements.
```

The removed elements are returned in a new array.

The original `colors` array is changed.

## Adding Elements With `splice`

To add elements without deleting anything, use `deleteCount` as `0`.

```js
const numbers = [1, 5];

numbers.splice(1, 0, 2, 3, 4);

console.log(numbers); // [1, 2, 3, 4, 5]
```

`splice(1, 0, 2, 3, 4)` means:

```text
Start at index 1.
Delete 0 elements.
Insert 2, 3, and 4 at that position.
```

The original array is changed.

## Replacing Elements With `splice`

To replace elements, delete some items and insert new ones in the same position.

```js
const animals = ["Cat", "Dog", "Bird"];

const removed = animals.splice(1, 1, "Wolf");

console.log(removed); // ["Dog"]
console.log(animals); // ["Cat", "Wolf", "Bird"]
```

`splice(1, 1, "Wolf")` means:

```text
Start at index 1.
Delete 1 element.
Insert "Wolf".
```

The original array is changed.

## Removing Everything From an Index

If you omit `deleteCount`, `splice` removes everything from the start index to the end.

```js
const letters = ["A", "B", "C", "D"];

const removed = letters.splice(2);

console.log(removed); // ["C", "D"]
console.log(letters); // ["A", "B"]
```

Be careful with this.

Forgetting `deleteCount` can remove more than you intended.

## Negative Start Index With `splice`

`splice` can use a negative start index.

```js
const items = ["A", "B", "C", "D"];

const removed = items.splice(-2, 1);

console.log(removed); // ["C"]
console.log(items); // ["A", "B", "D"]
```

`-2` means:

```text
Start two items from the end.
```

Only the start index supports this negative-position behavior.

## `splice` Return Value

`splice` returns the deleted elements.

```js
const names = ["Ava", "Noah", "Mira"];

const removed = names.splice(1, 1);

console.log(removed); // ["Noah"]
console.log(names); // ["Ava", "Mira"]
```

If nothing is deleted, it returns an empty array.

```js
const numbers = [1, 3];

const removed = numbers.splice(1, 0, 2);

console.log(removed); // []
console.log(numbers); // [1, 2, 3]
```

## `slice` vs `splice`

These two methods are easy to confuse.

| Feature | `slice` | `splice` |
| --- | --- | --- |
| Mutates original? | No | Yes |
| Returns | New array with selected elements | Array of deleted elements |
| Main use | Extract or copy | Add, remove, replace in place |
| Parameters | `(start, end)` | `(start, deleteCount, ...items)` |
| End index | Exclusive | Not used |

Remember:

```text
slice is safe extraction.
splice is in-place surgery.
```

## Side-by-Side Example

```js
const original = ["A", "B", "C", "D"];

const sliced = original.slice(1, 3);

console.log(sliced); // ["B", "C"]
console.log(original); // ["A", "B", "C", "D"]
```

Now compare:

```js
const original = ["A", "B", "C", "D"];

const spliced = original.splice(1, 2);

console.log(spliced); // ["B", "C"]
console.log(original); // ["A", "D"]
```

Both returned `["B", "C"]`.

But only `splice` changed the original array.

## Immutable Removal With `filter`

Modern JavaScript often prefers immutable updates.

If you want to remove an item without changing the original array, use `filter`.

```js
const items = ["A", "B", "C"];

const withoutB = items.filter((item) => item !== "B");

console.log(withoutB); // ["A", "C"]
console.log(items); // ["A", "B", "C"]
```

This is often safer than `splice` when working with state in frontend frameworks.

## Immutable Replacement With `map`

You can replace an item immutably with `map`.

```js
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

const updatedUsers = users.map((user) => {
  if (user.id === 2) {
    return {
      ...user,
      name: "Robert",
    };
  }

  return user;
});

console.log(updatedUsers);
console.log(users);
```

The original array is unchanged.

Only the returned array contains the updated object.

## When `splice` Is Fine

`splice` is not bad.

It is useful when you intentionally want to modify an array in place.

For example:

```js
const queue = ["first", "second", "third"];

queue.splice(1, 1);

console.log(queue); // ["first", "third"]
```

This is fine if:

- you own the array
- no other code expects the original version
- mutation is intentional

The problem is not `splice` itself.

The problem is accidental mutation.

## Best Practices

Use `slice` when you need a copy or subset:

```js
const firstThree = items.slice(0, 3);
```

Use `slice()` or spread to clone an array:

```js
const copyA = items.slice();
const copyB = [...items];
```

Use `splice` only when you intentionally want to mutate the original array:

```js
items.splice(index, 1);
```

Use `filter` for immutable removal:

```js
const remaining = items.filter((item) => item.id !== removedId);
```

Use `map` for immutable replacement:

```js
const updated = items.map((item) =>
  item.id === targetId ? { ...item, done: true } : item
);
```

Be careful with method names:

```text
slice and splice are not interchangeable.
```

## Common Mistakes

### Mistake 1: Expecting `slice` to Change the Original

```js
const items = ["A", "B", "C"];

items.slice(1, 2);

console.log(items); // ["A", "B", "C"]
```

`slice` returns a new array.

If you need the result, store it:

```js
const result = items.slice(1, 2);
```

### Mistake 2: Using `splice` When You Wanted a Safe Copy

```js
const items = ["A", "B", "C"];

const result = items.splice(1, 1);

console.log(result); // ["B"]
console.log(items); // ["A", "C"]
```

The original array changed.

Use `slice` for extraction without mutation:

```js
const result = items.slice(1, 2);
```

### Mistake 3: Forgetting That `slice` End Is Exclusive

```js
const items = ["A", "B", "C", "D"];

console.log(items.slice(1, 3)); // ["B", "C"]
```

Index `3` is not included.

### Mistake 4: Forgetting `deleteCount` in `splice`

```js
const items = ["A", "B", "C", "D"];

items.splice(1);

console.log(items); // ["A"]
```

Without `deleteCount`, `splice` removes everything from the start index to the end.

If you only want to remove one item:

```js
items.splice(1, 1);
```

### Mistake 5: Thinking `slice()` Deeply Copies Objects

```js
const users = [{ name: "Alice" }];
const copy = users.slice();

copy[0].name = "Ava";

console.log(users[0].name); // Ava
```

`slice()` creates a shallow copy of the array.

It does not deeply copy objects inside it.

## Quick Check

What does this log?

```js
const letters = ["A", "B", "C", "D"];

const result = letters.slice(1, 3);

console.log(result);
console.log(letters);
```

It logs:

```js
["B", "C"]
["A", "B", "C", "D"]
```

`slice` does not mutate the original array.

What does this log?

```js
const letters = ["A", "B", "C", "D"];

const result = letters.splice(1, 2);

console.log(result);
console.log(letters);
```

It logs:

```js
["B", "C"]
["A", "D"]
```

`splice` removes items from the original array.

What should you use to get the last two items without mutation?

Use `slice`:

```js
const lastTwo = items.slice(-2);
```

## Summary

`slice` and `splice` sound similar, but they behave very differently.

- `slice` extracts part of an array into a new array.
- `slice` does not mutate the original array.
- `slice(start, end)` includes `start` and excludes `end`.
- `slice()` can create a shallow copy.
- `splice` adds, removes, or replaces elements in the original array.
- `splice` mutates the original array.
- `splice` returns the deleted elements.
- Use `filter` or `map` when you want immutable removal or replacement.
- Use `splice` only when mutation is intentional.
