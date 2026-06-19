# Map and Set

ES6 introduced two useful data structures:

- `Map`
- `Set`

They are not replacements for arrays and objects.

They solve different problems.

## What Is a Set?

A `Set` stores unique values.

```js
const numbers = new Set([1, 2, 2, 3]);

console.log(numbers); // Set(3) { 1, 2, 3 }
```

Duplicate values are removed.

## Creating a Set

```js
const skills = new Set();

skills.add("JavaScript");
skills.add("React");
skills.add("JavaScript");

console.log(skills);
// Set(2) { "JavaScript", "React" }
```

Adding `"JavaScript"` twice does not create a duplicate.

## Checking Values in a Set

Use `.has()`.

```js
const roles = new Set(["admin", "editor"]);

console.log(roles.has("admin")); // true
console.log(roles.has("guest")); // false
```

This is often clearer than checking an array with `includes()` when uniqueness matters.

## Set Size

Sets use `.size`, not `.length`.

```js
const tags = new Set(["js", "html", "css"]);

console.log(tags.size); // 3
```

## Removing Values From a Set

```js
const tags = new Set(["js", "html", "css"]);

tags.delete("html");

console.log(tags.has("html")); // false
```

To remove everything:

```js
tags.clear();
```

## Converting Between Set and Array

Set to array:

```js
const uniqueTags = new Set(["js", "css"]);
const tags = [...uniqueTags];

console.log(tags); // ["js", "css"]
```

Array to Set:

```js
const numbers = [1, 2, 2, 3, 3, 3];
const uniqueNumbers = new Set(numbers);

console.log(uniqueNumbers); // Set(3) { 1, 2, 3 }
```

## Removing Duplicates From an Array

This is a common Set pattern.

```js
const numbers = [1, 2, 2, 3, 3, 4];

const uniqueNumbers = [...new Set(numbers)];

console.log(uniqueNumbers); // [1, 2, 3, 4]
```

Use this for primitive values like strings and numbers.

For objects, uniqueness is based on reference.

```js
const a = { id: 1 };
const b = { id: 1 };

const set = new Set([a, b]);

console.log(set.size); // 2
```

The objects look the same, but they are different references.

## What Is a Map?

A `Map` stores key-value pairs.

It is similar to an object, but with important differences.

```js
const userRoles = new Map();

userRoles.set("alice", "admin");
userRoles.set("bob", "editor");

console.log(userRoles.get("alice")); // admin
```

## Map Keys Can Be Any Value

Object keys are usually strings or symbols.

Map keys can be any value, including objects.

```js
const user = {
  id: 1,
  name: "Alice",
};

const sessions = new Map();

sessions.set(user, "active");

console.log(sessions.get(user)); // active
```

This can be useful when you need to associate data with object references.

## Map Methods

```js
const roles = new Map();

roles.set("alice", "admin");
roles.set("bob", "editor");

console.log(roles.get("alice")); // admin
console.log(roles.has("bob")); // true
console.log(roles.size); // 2

roles.delete("bob");

console.log(roles.has("bob")); // false
```

Common Map methods:

| Method | Purpose |
| --- | --- |
| `.set(key, value)` | Add or update a key-value pair |
| `.get(key)` | Read a value |
| `.has(key)` | Check if a key exists |
| `.delete(key)` | Remove a key |
| `.clear()` | Remove all entries |

## Looping Through a Map

Maps are iterable.

```js
const roles = new Map([
  ["alice", "admin"],
  ["bob", "editor"],
]);

for (const [name, role] of roles) {
  console.log(`${name}: ${role}`);
}
```

Output:

```text
alice: admin
bob: editor
```

You can also use:

```js
roles.keys();
roles.values();
roles.entries();
```

## Map vs Object

Use objects for normal structured data:

```js
const user = {
  name: "Alice",
  role: "admin",
};
```

Use `Map` when:

- keys are not simple strings
- you frequently add and remove key-value pairs
- you need reliable iteration of entries
- you want a collection specifically designed for key-value storage

For most beginner application data, objects are still more common.

## Set vs Array

Use arrays when:

- order matters
- duplicates are allowed
- you need array methods like `map`, `filter`, and `reduce`

Use `Set` when:

- values must be unique
- you need fast existence checks
- you are removing duplicates

## Best Practices

Use `Set` for unique primitive values:

```js
const uniqueIds = new Set(ids);
```

Use `Map` for dynamic key-value collections:

```js
const cache = new Map();
```

Use objects for plain records:

```js
const user = { id: 1, name: "Alice" };
```

Remember that Set uniqueness for objects is based on reference.

Use `.size` for both Map and Set.

## Common Mistakes

### Mistake 1: Using `.length`

```js
const set = new Set([1, 2, 3]);

console.log(set.length); // undefined
```

Use:

```js
console.log(set.size); // 3
```

### Mistake 2: Expecting Set to Remove Duplicate Objects by Shape

```js
const users = new Set([{ id: 1 }, { id: 1 }]);

console.log(users.size); // 2
```

Objects are unique by reference, not by matching contents.

### Mistake 3: Using Object Syntax on a Map

```js
const map = new Map();

map.name = "Alice";
```

This does not create a normal Map entry.

Use:

```js
map.set("name", "Alice");
```

## Summary

`Map` and `Set` are ES6 data structures.

- `Set` stores unique values.
- `Map` stores key-value pairs.
- Sets and Maps use `.size`, not `.length`.
- Use `Set` to remove duplicates or enforce uniqueness.
- Use `Map` for dynamic key-value collections.
- Map keys can be any value.
- Object and Set equality for objects is based on reference.
