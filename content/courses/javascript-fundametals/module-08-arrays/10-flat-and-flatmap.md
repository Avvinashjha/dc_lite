# flat and flatMap

Arrays can contain other arrays.

For example:

```js
const groups = [
  ["Alice", "Bob"],
  ["Charlie", "Dana"],
  ["Eve"],
];
```

This is called a **nested array**.

Nested arrays are useful, but sometimes you need one simple array instead.

JavaScript gives you two methods for this:

- `.flat()`
- `.flatMap()`

## What Does Flattening Mean?

Flattening means taking nested arrays and turning them into a less nested array.

Example:

```js
const nested = [
  [1, 2],
  [3, 4],
  [5, 6],
];

const flat = nested.flat();

console.log(flat); // [1, 2, 3, 4, 5, 6]
```

The original array has arrays inside it.

The flattened array contains the values directly.

## The `flat` Method

The `.flat()` method creates a new array with nested arrays flattened.

```js
const numbers = [[1, 2], [3, 4], [5]];

const result = numbers.flat();

console.log(result); // [1, 2, 3, 4, 5]
console.log(numbers); // [[1, 2], [3, 4], [5]]
```

`flat()` does not mutate the original array.

It returns a new array.

## Default Depth

By default, `.flat()` flattens one level deep.

```js
const nested = [1, [2, 3], [4, [5, 6]]];

const result = nested.flat();

console.log(result); // [1, 2, 3, 4, [5, 6]]
```

The array `[2, 3]` was flattened.

The array `[4, [5, 6]]` was flattened one level.

But `[5, 6]` is still nested because it was two levels deep.

## Flattening More Than One Level

You can pass a depth argument to `.flat()`.

```js
const nested = [1, [2, 3], [4, [5, 6]]];

const result = nested.flat(2);

console.log(result); // [1, 2, 3, 4, 5, 6]
```

`flat(2)` means:

```text
Flatten up to two levels deep.
```

Another example:

```js
const deeplyNested = [1, [2, [3, [4]]]];

console.log(deeplyNested.flat(1)); // [1, 2, [3, [4]]]
console.log(deeplyNested.flat(2)); // [1, 2, 3, [4]]
console.log(deeplyNested.flat(3)); // [1, 2, 3, 4]
```

## Flattening All Levels

If you want to flatten all levels, you can use `Infinity`.

```js
const deeplyNested = [1, [2, [3, [4]]]];

const result = deeplyNested.flat(Infinity);

console.log(result); // [1, 2, 3, 4]
```

Use this carefully.

It is convenient, but if your data is deeply nested for a reason, flattening everything may remove useful structure.

## Practical Example: Combining Groups

Imagine users are grouped by team:

```js
const teams = [
  ["Alice", "Bob"],
  ["Charlie"],
  ["Dana", "Eve"],
];
```

If you want one list of all users:

```js
const allUsers = teams.flat();

console.log(allUsers); // ["Alice", "Bob", "Charlie", "Dana", "Eve"]
```

This is clearer than using `reduce` for simple flattening:

```js
const allUsers = teams.reduce((result, team) => {
  return result.concat(team);
}, []);
```

Both work.

But for simple flattening, `flat()` communicates your intent directly.

## Practical Example: API Results

Sometimes API data comes grouped.

```js
const categoryResults = [
  [
    { id: 1, title: "JavaScript Basics" },
    { id: 2, title: "Array Methods" },
  ],
  [
    { id: 3, title: "DOM Events" },
  ],
];

const lessons = categoryResults.flat();

console.log(lessons);
```

Now you have one array of lesson objects.

This makes it easier to search, filter, map, or render the list.

## `flat` and Empty Slots

`flat()` removes empty slots from arrays.

```js
const values = [1, , 3, [4, , 6]];

console.log(values.flat()); // [1, 3, 4, 6]
```

This usually does not matter in normal arrays.

But it is another reason to avoid creating sparse arrays intentionally.

## The `flatMap` Method

The `.flatMap()` method combines two steps:

1. Map each item to a new value.
2. Flatten the result one level.

This:

```js
array.flatMap(callback);
```

is similar to:

```js
array.map(callback).flat();
```

But `flatMap` is more direct when you know you need both steps.

## Basic `flatMap` Example

Suppose each sentence should become words.

```js
const sentences = ["hello world", "learn javascript"];

const words = sentences.flatMap((sentence) => {
  return sentence.split(" ");
});

console.log(words); // ["hello", "world", "learn", "javascript"]
```

Here is what happens:

First, `map` would produce:

```js
[
  ["hello", "world"],
  ["learn", "javascript"]
]
```

Then `flat` would turn it into:

```js
["hello", "world", "learn", "javascript"]
```

`flatMap` does both in one method.

## `map` Plus `flat`

This code:

```js
const words = sentences
  .map((sentence) => sentence.split(" "))
  .flat();
```

produces the same result as:

```js
const words = sentences.flatMap((sentence) => sentence.split(" "));
```

Use `flatMap` when:

- each input item becomes an array
- you want one combined result array
- you only need to flatten one level

## `flatMap` Flattens One Level Only

`flatMap` only flattens one level.

```js
const values = [1, 2];

const result = values.flatMap((value) => {
  return [[value, value * 2]];
});

console.log(result); // [[1, 2], [2, 4]]
```

The callback returns nested arrays like:

```js
[[1, 2]]
```

`flatMap` flattens one level, so one level of nesting remains.

If you need deeper flattening, use `map()` and then `flat(depth)`.

```js
const result = values
  .map((value) => [[value, value * 2]])
  .flat(2);

console.log(result); // [1, 2, 2, 4]
```

## Returning One, Many, or No Items

`flatMap` is useful because each input item can produce:

- one output item
- multiple output items
- zero output items

One item:

```js
const numbers = [1, 2, 3];

const doubled = numbers.flatMap((number) => {
  return [number * 2];
});

console.log(doubled); // [2, 4, 6]
```

Multiple items:

```js
const numbers = [1, 2, 3];

const pairs = numbers.flatMap((number) => {
  return [number, number * 2];
});

console.log(pairs); // [1, 2, 2, 4, 3, 6]
```

No items:

```js
const numbers = [1, 2, 3, 4];

const evenDoubles = numbers.flatMap((number) => {
  if (number % 2 === 0) {
    return [number * 2];
  }

  return [];
});

console.log(evenDoubles); // [4, 8]
```

This can act like filtering and mapping in one step.

But use it only when it stays readable.

## `flatMap` for Tags

Imagine each article has tags.

```js
const articles = [
  { title: "Intro to JS", tags: ["javascript", "basics"] },
  { title: "Array Methods", tags: ["javascript", "arrays"] },
  { title: "CSS Layout", tags: ["css", "layout"] },
];

const allTags = articles.flatMap((article) => {
  return article.tags;
});

console.log(allTags);
```

Output:

```js
["javascript", "basics", "javascript", "arrays", "css", "layout"]
```

Each article maps to an array of tags.

`flatMap` combines all those tag arrays into one array.

## Removing Duplicates After `flatMap`

If you want unique tags, combine `flatMap` with `Set`.

```js
const uniqueTags = [...new Set(allTags)];

console.log(uniqueTags); // ["javascript", "basics", "arrays", "css", "layout"]
```

This is a common pattern:

```js
const uniqueTags = [
  ...new Set(
    articles.flatMap((article) => article.tags)
  ),
];
```

It:

1. extracts all tag arrays
2. flattens them into one array
3. removes duplicates with `Set`

## `flat` vs `flatMap`

Use `flat` when the array is already nested.

```js
const nested = [[1, 2], [3, 4]];

const result = nested.flat();

console.log(result); // [1, 2, 3, 4]
```

Use `flatMap` when you need to transform each item and flatten the result.

```js
const sentences = ["hello world", "learn js"];

const words = sentences.flatMap((sentence) => sentence.split(" "));

console.log(words); // ["hello", "world", "learn", "js"]
```

Comparison:

| Method | Use when | Depth |
| --- | --- | --- |
| `flat` | You already have nested arrays | Configurable |
| `flatMap` | You need to map, then flatten | One level |

## `flatMap` vs `map`

`map` keeps one output element per input element.

```js
const sentences = ["hello world", "learn js"];

const mapped = sentences.map((sentence) => sentence.split(" "));

console.log(mapped);
```

Output:

```js
[
  ["hello", "world"],
  ["learn", "js"]
]
```

`flatMap` combines those nested arrays:

```js
const flatMapped = sentences.flatMap((sentence) => sentence.split(" "));

console.log(flatMapped); // ["hello", "world", "learn", "js"]
```

Use `map` when you want to keep the nested structure.

Use `flatMap` when you want the combined result.

## `flat` Does Not Deep Clone

Like `slice` and spread, `flat` creates a shallow result.

If the array contains objects, the objects are still shared references.

```js
const nestedUsers = [
  [{ name: "Alice" }],
  [{ name: "Bob" }],
];

const users = nestedUsers.flat();

users[0].name = "Ava";

console.log(nestedUsers[0][0].name); // Ava
```

The outer array structure was flattened.

The objects inside were not deeply copied.

## Best Practices

Use `flat` for already nested arrays:

```js
const allItems = groupedItems.flat();
```

Pass a depth when you need more than one level:

```js
const result = nestedValues.flat(2);
```

Use `flatMap` when each item turns into an array and you want one combined result:

```js
const words = sentences.flatMap((sentence) => sentence.split(" "));
```

Keep `flatMap` callbacks easy to read:

```js
const tags = articles.flatMap((article) => article.tags);
```

Use `map().flat(depth)` when you need a custom flattening depth:

```js
const result = values.map(transform).flat(2);
```

Avoid using `flatMap` just to look clever.

If `filter().map()` is clearer, use that.

## Common Mistakes

### Mistake 1: Expecting `flat` to Flatten All Levels by Default

```js
const nested = [1, [2, [3, [4]]]];

console.log(nested.flat()); // [1, 2, [3, [4]]]
```

By default, `flat()` flattens one level.

Use a depth:

```js
console.log(nested.flat(3)); // [1, 2, 3, 4]
```

Or:

```js
console.log(nested.flat(Infinity)); // [1, 2, 3, 4]
```

### Mistake 2: Using `flatMap` When the Callback Does Not Return Arrays

```js
const numbers = [1, 2, 3];

const doubled = numbers.flatMap((number) => number * 2);

console.log(doubled); // [2, 4, 6]
```

This works, but `map` is clearer because no flattening is needed:

```js
const doubled = numbers.map((number) => number * 2);
```

### Mistake 3: Expecting `flatMap` to Flatten Deeply

```js
const values = [1, 2];

const result = values.flatMap((value) => [[value]]);

console.log(result); // [[1], [2]]
```

`flatMap` flattens one level only.

Use `map().flat(2)` if you need deeper flattening.

### Mistake 4: Forgetting That Objects Are Still Shared

```js
const nestedUsers = [[{ name: "Alice" }]];
const users = nestedUsers.flat();

users[0].name = "Ava";

console.log(nestedUsers[0][0].name); // Ava
```

Flattening does not deeply clone objects.

## Quick Check

What does this return?

```js
const values = [[1, 2], [3, 4]];

const result = values.flat();
```

It returns:

```js
[1, 2, 3, 4]
```

What does this return?

```js
const values = [1, [2, [3]]];

const result = values.flat();
```

It returns:

```js
[1, 2, [3]]
```

`flat()` only flattens one level by default.

What does this return?

```js
const sentences = ["hi there", "learn arrays"];

const words = sentences.flatMap((sentence) => sentence.split(" "));
```

It returns:

```js
["hi", "there", "learn", "arrays"]
```

Each sentence becomes an array of words, and `flatMap` combines them.

## Summary

`flat` and `flatMap` help you work with nested arrays.

- `flat()` flattens nested arrays into a new array.
- `flat()` flattens one level by default.
- Pass a depth like `flat(2)` for deeper flattening.
- Use `flat(Infinity)` to flatten all levels.
- `flatMap()` maps each item and then flattens one level.
- `flatMap()` is similar to `map().flat()`.
- Use `flat` when the array is already nested.
- Use `flatMap` when each item becomes an array and you want one combined result.
- Flattening is shallow; objects inside arrays are still shared references.
