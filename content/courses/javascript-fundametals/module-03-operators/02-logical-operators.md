# Logical Operators

Logical operators help you combine, reverse, and evaluate conditions.

They are used heavily in decision-making code, especially inside `if` statements, loops, form validation, permissions, and fallback logic.

JavaScript has three main logical operators:

| Operator | Name | Meaning |
| --- | --- | --- |
| `&&` | AND | All conditions must be truthy |
| `||` | OR | At least one condition must be truthy |
| `!` | NOT | Reverses truthy/falsy meaning |

Before using logical operators, remember that JavaScript values can be **truthy** or **falsy**.

Falsy values include:

```js
false;
0;
"";
null;
undefined;
NaN;
```

Most other values are truthy.

## Logical AND

The `&&` operator means AND.

It returns a truthy result only when both conditions are truthy.

```js
const hasTicket = true;
const isAdult = true;

console.log(hasTicket && isAdult); // true
```

If one condition is false, the result is false.

```js
console.log(true && false); // false
console.log(false && true); // false
console.log(false && false); // false
```

A practical example:

```js
const isLoggedIn = true;
const hasPermission = true;

if (isLoggedIn && hasPermission) {
  console.log("Show admin dashboard");
}
```

Both conditions must be true for the code to run.

## Logical OR

The `||` operator means OR.

It returns a truthy result when at least one condition is truthy.

```js
const hasCreditCard = false;
const hasCash = true;

console.log(hasCreditCard || hasCash); // true
```

It only returns false when both sides are false.

```js
console.log(true || false); // true
console.log(false || true); // true
console.log(false || false); // false
```

A practical example:

```js
const isAdmin = false;
const isOwner = true;

if (isAdmin || isOwner) {
  console.log("Allow edit");
}
```

The user can edit if either condition is true.

## Logical NOT

The `!` operator means NOT.

It reverses the boolean meaning of a value.

```js
const isRaining = true;

console.log(!isRaining); // false
```

Examples:

```js
console.log(!false); // true
console.log(!true); // false
console.log(!0); // true
console.log(!"Hello"); // false
```

`0` is falsy, so `!0` becomes `true`.

`"Hello"` is truthy, so `!"Hello"` becomes `false`.

## Using NOT in Conditions

`!` is useful when you want to check the opposite of a condition.

```js
const isLoggedIn = false;

if (!isLoggedIn) {
  console.log("Please log in");
}
```

This reads as:

```text
if not logged in
```

## Double NOT

You may see `!!` in JavaScript code.

It converts any value into a strict boolean.

```js
const name = "Asha";

console.log(!!name); // true
```

How it works:

```js
const name = "Asha";

console.log(!name); // false
console.log(!!name); // true
```

More examples:

```js
console.log(!!"Hello"); // true
console.log(!!""); // false
console.log(!!0); // false
console.log(!!42); // true
console.log(!!null); // false
```

`Boolean(value)` does the same thing and is often more readable for beginners.

```js
console.log(Boolean("Hello")); // true
```

## Short-Circuit Evaluation

JavaScript logical operators evaluate from left to right.

They can stop early when the result is already known. This is called **short-circuit evaluation**.

Important detail:

**In JavaScript, `&&` and `||` do not always return `true` or `false`. They return one of the actual operand values.**

## How `&&` Returns Values

The `&&` operator returns the first falsy value it finds.

```js
console.log("Hello" && 0 && "World"); // 0
```

JavaScript stops at `0` because `0` is falsy.

If all values are truthy, `&&` returns the last value.

```js
console.log("Hello" && "World"); // World
console.log(1 && "Done"); // Done
```

This works because all previous values were truthy.

## How `||` Returns Values

The `||` operator returns the first truthy value it finds.

```js
console.log(0 || "" || "Fallback" || "Ignored"); // Fallback
```

JavaScript stops at `"Fallback"` because it is truthy.

If all values are falsy, `||` returns the last value.

```js
console.log(0 || "" || null); // null
```

## Default Values with `||`

You can use `||` to provide a fallback value.

```js
const inputName = "";
const displayName = inputName || "Guest";

console.log(displayName); // Guest
```

This works because an empty string is falsy.

Another example:

```js
function greet(user) {
  const name = user.name || "Guest";

  console.log(`Hello, ${name}!`);
}

greet({}); // Hello, Guest!
greet({ name: "Asha" }); // Hello, Asha!
```

Be careful: `||` treats all falsy values as missing.

```js
const count = 0;
const finalCount = count || 10;

console.log(finalCount); // 10
```

If `0` is a valid value, this may be a bug.

Later, you will learn about the nullish coalescing operator `??`, which solves this specific problem.

## Guarding with `&&`

`&&` can be used to run code only when a value exists.

```js
const user = {
  name: "Asha"
};

user && console.log(user.name); // Asha
```

If `user` is `null`, JavaScript stops before trying to access the name.

```js
const user = null;

const userName = user && user.name;

console.log(userName); // null
```

This avoids an error because `user.name` is never evaluated.

Modern JavaScript often uses optional chaining for this:

```js
const userName = user?.name;
```

You will study optional chaining later. For now, understand that short-circuiting is the idea behind this kind of safe access.

## Combining Multiple Conditions

You can combine logical operators.

```js
const isLoggedIn = true;
const isAdmin = false;
const isOwner = true;

if (isLoggedIn && (isAdmin || isOwner)) {
  console.log("Access granted");
}
```

Parentheses make the logic clear:

```text
logged in AND (admin OR owner)
```

Without parentheses, the code may still work due to operator precedence, but it is harder to read.

## Operator Precedence

`!` runs before `&&`, and `&&` runs before `||`.

```js
console.log(true || false && false); // true
```

This is evaluated like:

```js
console.log(true || (false && false)); // true
```

Use parentheses when combining logical operators:

```js
const canEdit = isLoggedIn && (isAdmin || isOwner);
```

Readable logic is better than clever logic.

## Common Mistakes

## Expecting `&&` and `||` to Always Return Booleans

```js
console.log("Asha" && "Developer"); // Developer
console.log("" || "Guest"); // Guest
```

These operators return actual values, not always `true` or `false`.

If you need a strict boolean, use `Boolean()` or `!!`.

```js
console.log(Boolean("Asha" && "Developer")); // true
```

## Using `||` When `0` Is Valid

```js
const quantity = 0;
const finalQuantity = quantity || 1;

console.log(finalQuantity); // 1
```

This may be wrong if `0` is a valid quantity.

Use a direct check when needed:

```js
const finalQuantity = quantity === undefined ? 1 : quantity;
```

## Making Conditions Too Hard to Read

This is difficult to understand:

```js
if (!isBlocked && isLoggedIn && (isAdmin || isOwner) && hasActivePlan) {
  console.log("Allowed");
}
```

Sometimes it is clearer to name pieces of logic:

```js
const canManageResource = isAdmin || isOwner;
const hasAccess = !isBlocked && isLoggedIn && canManageResource && hasActivePlan;

if (hasAccess) {
  console.log("Allowed");
}
```

## Summary

Logical operators help you write decision-making logic.

Remember:

1. `&&` means AND. It returns the first falsy value or the last truthy value.
2. `||` means OR. It returns the first truthy value or the last falsy value.
3. `!` reverses truthy/falsy meaning.
4. `!!value` converts a value to a strict boolean, though `Boolean(value)` is more explicit.
5. Logical operators short-circuit by stopping evaluation early.
6. `||` can provide default values, but it treats all falsy values as missing.
7. `&&` can guard access to values.
8. Use parentheses to make complex conditions clear.

Next, you will learn about comparison operators, which are often combined with logical operators in real conditions.