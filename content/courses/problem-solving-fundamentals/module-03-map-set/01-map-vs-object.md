# Map vs Object

**Map** and plain **objects** `{}` both store key-value pairs, but they behave differently. Picking the right one prevents subtle bugs and keeps Big-O reasoning honest.

## Objects as dictionaries

```javascript
const scores = {};
scores["ada"] = 100;
scores["bob"] = 95;
```

Keys are converted to strings (except `Symbol`). Prototype inheritance means you must be careful with keys like `"toString"` unless you use `Object.create(null)`.

## Map basics

```javascript
const scores = new Map();
scores.set("ada", 100);
scores.set("bob", 95);
console.log(scores.get("ada"));  // 100
console.log(scores.has("bob"));  // true
scores.delete("bob");
console.log(scores.size);        // 1
```

```text
Map internally:  key1 -> value1
                  key2 -> value2
                  (any key type, no prototype key collisions)
```

## When to prefer Map

| Situation | Prefer Map |
| --------- | ---------- |
| Keys are not only strings (numbers, objects) | Yes |
| Frequent size checks (`size`) | Yes |
| Frequent add/delete and iteration order matters | Yes |
| JSON serialization needed | Object is easier (`JSON.stringify`) |
| Small fixed shape (known keys) | Object can be fine |

## Non-string keys

```javascript
const m = new Map();
const objKey = { id: 1 };
m.set(objKey, "metadata");
m.get(objKey);  // "metadata" — same object reference
```

Keys are compared with **SameValueZero** (like `===` but `NaN` equals `NaN`).

## Iteration

```javascript
const m = new Map([["a", 1], ["b", 2]]);
for (const [k, v] of m) console.log(k, v);
// or: m.forEach((v, k) => ...)
```

Insertion order is preserved in modern JavaScript for both Map and object string keys — but Map guarantees it for all key types.

:::quiz
question: Which statement about JavaScript Map is true?
options:
  - Map keys are always converted to strings like object keys.
  - Map can use objects as keys; lookup uses reference identity.
  - Map does not support the .size property.
answer: 1
explanation: Map stores keys of any type without stringifying objects; two different object literals are different keys. `.size` gives the number of entries.
:::

:::quiz
question: Why might Object.create(null) be used instead of {} for a string-keyed dictionary?
options:
  - To avoid inheriting Object.prototype keys like toString colliding with user data.
  - To make the object faster than Map.
  - It is required by the JavaScript specification for all objects.
answer: 0
explanation: A null prototype removes inherited properties so user keys cannot shadow prototype methods accidentally.
:::

:::quiz
question: m.get(k) returns undefined when the key is missing. How do you distinguish missing from a stored undefined value?
options:
  - You cannot — Map is broken.
  - Use m.has(k) before relying on the value, or store a sentinel wrapper object instead of undefined.
answer: 1
explanation: If you need to store undefined, `has` tells you whether the key exists. Alternatively use a wrapper like { value: x }.
:::

:::exercise
title: Invert an object to a Map
description: Write `objectToMap(obj)` that returns a new Map with the same string keys and values as a plain object (only own enumerable properties). Use Object.entries.
starterCode: |
  function objectToMap(obj) {
    // new Map(Object.entries(obj))
  }

  const m = objectToMap({ a: 1, b: 2 });
  console.log(m.get("a"), m.size); // 1, 2
:::

## Practice

- [Two Sum](/problems/two-sum) — hash map (object or Map) for complement lookup.
- [Valid Anagram](/problems/valid-anagram) — frequency as array or Map.
