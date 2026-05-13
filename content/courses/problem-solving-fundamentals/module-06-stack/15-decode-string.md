# Decode String (Nested Structure Pattern)

**LeetCode 394.** Decode strings of the form `k[encoded_string]`, meaning the substring inside the brackets is repeated `k` times. Encoded strings can be **nested**.

Examples:

```text
"3[a]2[bc]"       -> "aaabcbc"
"3[a2[c]]"        -> "accaccacc"
"2[abc]3[cd]ef"   -> "abcabccdcdcdef"
```

This is a **nested-structure** problem: the `[`-`]` brackets behave like parentheses, and the number before each `[` controls the repetition of whatever is inside. The general pattern for problems that involve nested contexts is **push current context on `[`, pop and apply on `]`**.

## The approach: two stacks

We walk through the string character by character and maintain:

- `currentString` — the string being built at the current nesting level.
- `currentCount` — the number being parsed before a `[`.
- A **stack of strings** — previous outer strings waiting to be resumed.
- A **stack of counts** — the multipliers for the current bracket when we close it.

When we hit `[`, we push the current state and reset it. When we hit `]`, we pop and concatenate.

## The code

```javascript
function decodeString(s) {
  const stringStack = [];
  const countStack = [];
  let currentString = "";
  let currentCount = 0;

  for (const ch of s) {
    if (ch >= "0" && ch <= "9") {
      currentCount = currentCount * 10 + (ch.charCodeAt(0) - 48);
    } else if (ch === "[") {
      stringStack.push(currentString);
      countStack.push(currentCount);
      currentString = "";
      currentCount = 0;
    } else if (ch === "]") {
      const repeat = countStack.pop();
      const prev = stringStack.pop();
      currentString = prev + currentString.repeat(repeat);
    } else {
      currentString += ch;
    }
  }
  return currentString;
}
```

Key details:

- `currentCount = currentCount * 10 + digit` correctly handles multi-digit counts like `"10[a]"`.
- On `[`, we **save** the outer context (the string and multiplier-so-far — not the upcoming multiplier, which is already in `currentCount`) and reset.
- On `]`, the **count** we pop is the multiplier for **the inner string we just built**; the **string** we pop is the prefix of the current level.

## Walkthrough

```text
s = "3[a2[c]]"

ch='3'  currentCount = 3
ch='['  push "" onto strStack, push 3 onto cntStack
         currentString = "", currentCount = 0
ch='a'  currentString = "a"
ch='2'  currentCount = 2
ch='['  push "a" onto strStack, push 2 onto cntStack
         currentString = "", currentCount = 0
ch='c'  currentString = "c"
ch=']'  pop 2, pop "a"
         currentString = "a" + "c".repeat(2) = "acc"
ch=']'  pop 3, pop ""
         currentString = "" + "acc".repeat(3) = "accaccacc"

return "accaccacc"
```

## Complexity

- **Time:** O(N) where N is the length of the **decoded** output. Each output character is written exactly once.
- **Space:** O(D + N) where D is the maximum nesting depth (for the two stacks).

## The general nested-context pattern

Many interview problems share this shape:

1. Push current context on an **opening token**.
2. Pop and combine on a **closing token**.

Examples:

- **Basic Calculator (LC 224, 227, 772).** Push on `(`, pop on `)`.
- **Remove parentheses from expressions.**
- **Evaluate boolean expressions with parentheses.**
- **Recursive JSON-style parsing.**

The two-stack approach generalizes: one stack for **what was built so far at each level**, another for **what operator/multiplier/context applies to the current level**.

## Alternative: recursive parser

You can solve decode-string with a recursive descent parser that takes the remaining input and returns `(decodedString, newIndex)`. The recursion tracks nesting implicitly. Functionally equivalent; the iterative two-stack approach is usually cleaner to explain and debug in interviews.

## Common bugs

1. **Single-character count parsing.** Using `parseInt(ch)` once instead of accumulating via `count * 10 + digit` breaks `"10[a]"`.
2. **Forgetting to reset both `currentString` and `currentCount` on `[`.** If either leaks across levels, the decoded output is wrong.
3. **Wrong pop order on `]`.** Pop the count **and** the prev string; concatenate prev + current.repeat(count), not the other way around.
4. **Using `+` on digit characters instead of `charCodeAt(0) - 48`.** `"3" + "4"` is `"34"` (string concat), not `34`. Either subtract ASCII 48 or parse each digit with `Number`.

:::quiz
question: Why do we store two separate stacks (strings and counts) instead of pushing pairs?
options:
  - Just a convention — two parallel stacks are easier to reason about; pushing pairs is equally correct.
  - Two stacks are required for correctness.
answer: 0
explanation: Either design works; parallel stacks are common and reduce boilerplate around object construction.
:::

:::quiz
question: How does the algorithm handle multi-digit counts like "10[a]"?
options:
  - By accumulating digits: `count = count * 10 + digit` for each digit encountered before `[`.
  - It treats each digit as its own count.
answer: 0
explanation: Left-to-right digit accumulation is the standard numeric-parse pattern.
:::

:::quiz
question: The space complexity is bounded by:
options:
  - O(D + N) where D is max nesting depth and N is output length.
  - O(1).
answer: 0
explanation: The two stacks grow with nesting depth; the output we build grows with the decoded length.
:::

:::exercise
title: Implement decodeString
description: Implement `decodeString(s)` using the two-stack approach. Support digits, brackets, and letters; handle multi-digit counts.
starterCode: |
  function decodeString(s) {
    const strStack = [];
    const cntStack = [];
    let curStr = "", curCnt = 0;
    // iterate characters, handle digit / '[' / ']' / letter
    return curStr;
  }

  console.log(decodeString("3[a]2[bc]"));       // "aaabcbc"
  console.log(decodeString("3[a2[c]]"));        // "accaccacc"
  console.log(decodeString("2[abc]3[cd]ef"));   // "abcabccdcdcdef"
  console.log(decodeString("10[a]"));           // "aaaaaaaaaa"
:::

## Practice

- [Decode String](/problems/decode-string)
