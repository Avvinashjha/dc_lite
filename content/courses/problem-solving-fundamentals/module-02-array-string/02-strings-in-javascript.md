# Strings in JavaScript

A **string** is an ordered sequence of characters. In JavaScript, strings are **immutable**: methods that look like they change a string actually return a **new** string.

## Characters and indexing

You can read `s[i]` or `s.charAt(i)`. Out-of-range access gives `undefined` (bracket) or `""` (`charAt`).

```javascript
const s = "hello";
console.log(s[0]);       // "h"
console.log(s.length);   // 5
```

## Immutability

There is no `s[0] = "H"` that works on primitives. You build a new string:

```javascript
const s = "hello";
const t = "H" + s.slice(1);  // "Hello"
```

For heavy editing, sometimes you convert to an array, mutate, and join:

```javascript
const chars = "hello".split("");
chars[0] = "H";
const u = chars.join("");   // "Hello"
```

## slice, substring, substr

Prefer **`slice(start, end)`** — it behaves consistently with arrays (`end` exclusive, negative indices count from the end). `substring` has different rules with negative args; avoid mixing them in interviews.

```javascript
"abcdef".slice(1, 4);   // "bcd"
"abcdef".slice(-2);     // "ef"
```

## split and join

`split` breaks a string into an array; `join` glues an array back.

```javascript
"a,b,c".split(",");           // ["a", "b", "c"]
"hello".split("");            // ["h","e","l","l","o"]
["a", "b"].join("-");         // "a-b"
```

## String vs array mental model

| Operation | Array | String |
| --------- | ----- | ------ |
| Index read | `a[i]` | `s[i]` |
| Mutate index | `a[i] = x` | Not for primitives — build new string |
| Append cheaply | `push` | Use array or repeated concat is O(n²) in loops — use `Array.join` |

```text
String "abc" is immutable:
  s.slice(0, 2) + "d"  -->  new string "abd"
  original "abc" unchanged
```

## Template literals

Backticks allow interpolation and multiline strings — great for building messages or small snippets:

```javascript
const name = "Ada";
const msg = `Hello, ${name}!`;
```

:::quiz
question: After `let s = "hi"; s[0] = "H";` (assignment ignored), what is `s`?
options:
  - "Hi"
  - "hi" — string primitives are immutable; the write has no effect.
  - "H"
  - undefined
answer: 1
explanation: Strings are immutable. Assigning to an index does not change the string; `s` remains `"hi"`.
:::

:::quiz
question: Which expression produces a new string without mutating the original `const s = "abc"`?
options:
  - `s[0] = "z"`
  - `s.slice(0, 2)`
  - `s.splice(1, 1)`
  - `s.push("d")`
answer: 1
explanation: `slice` returns a new string. The others either do not apply to strings or imply mutation (strings have no `splice` or `push`).
:::

:::quiz
question: `"a,b,c".split(",").join("-")` evaluates to what?
options:
  - "a-b-c"
  - ["a","b","c"]
  - "a,b,c"
  - Error
answer: 0
explanation: Split produces an array of three parts; join with "-" concatenates them with hyphens.
:::

:::exercise
title: Title case a word
description: Write `titleCase(word)` that returns a new string with the first character uppercased and the rest lowercased. Assume `word` is non-empty and contains only letters. Use `slice`, not a loop.
starterCode: |
  function titleCase(word) {
    // e.g. "hELLo" -> "Hello"
  }

  console.log(titleCase("hELLo")); // "Hello"
:::

## Practice

- [Longest Common Prefix](/problems/longest-common-prefix) — compare string prefixes across an array of strings.
- [Valid Parentheses](/problems/valid-parentheses) — scan a string with a stack mental model.
