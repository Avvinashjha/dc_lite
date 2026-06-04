# Comparison Operators

Comparison operators are used to compare values.

Every comparison produces a boolean result:

```js
true;
false;
```

You will use comparison operators in conditions, validation, loops, filtering, sorting, and decision-making logic.

```js
const age = 20;

if (age >= 18) {
  console.log("Adult");
}
```

## Core Comparison Operators

JavaScript has four main relational comparison operators.

| Operator | Meaning | Example | Result |
| --- | --- | --- | --- |
| `>` | Greater than | `10 > 5` | `true` |
| `<` | Less than | `10 < 5` | `false` |
| `>=` | Greater than or equal to | `5 >= 5` | `true` |
| `<=` | Less than or equal to | `4 <= 5` | `true` |

These operators are sometimes called **relational operators** because they check the relationship between two values.

## Comparing Numbers

Number comparisons behave like normal math.

```js
console.log(10 > 5); // true
console.log(10 < 5); // false
console.log(5 >= 5); // true
console.log(4 <= 5); // true
```

Practical example:

```js
const cartTotal = 1200;
const freeShippingMinimum = 999;

if (cartTotal >= freeShippingMinimum) {
  console.log("Free shipping applied");
}
```

## Comparing Strings

When both values are strings, JavaScript compares them lexicographically.

That means it compares characters from left to right based on their character codes.

```js
console.log("b" > "a"); // true
console.log("apple" < "banana"); // true
```

This is similar to alphabetical order, but not exactly the same as dictionary sorting in every language or locale.

## The Numeric String Trap

String comparison is not numeric comparison.

```js
console.log("10" < "2"); // true
```

This looks wrong if you think of them as numbers.

But JavaScript is comparing strings:

- First character of `"10"` is `"1"`.
- First character of `"2"` is `"2"`.
- `"1"` comes before `"2"`.

So `"10" < "2"` is `true`.

If you want numeric comparison, convert first:

```js
const a = Number("10");
const b = Number("2");

console.log(a < b); // false
```

## Comparing Different Types

When comparing a string and a number with relational operators, JavaScript usually tries to convert the string to a number.

```js
console.log("10" > 2); // true
console.log("5" < 10); // true
```

In the first example:

```js
"10" > 2
```

becomes roughly:

```js
10 > 2
```

If the string cannot become a valid number, the result involves `NaN`.

```js
console.log("hello" > 5); // false
console.log("hello" < 5); // false
console.log("hello" >= 5); // false
console.log("hello" <= 5); // false
```

`"hello"` becomes `NaN`, and comparisons with `NaN` are false.

## Comparing with `NaN`

Any relational comparison with `NaN` is false.

```js
console.log(NaN > 1); // false
console.log(NaN < 1); // false
console.log(NaN >= 1); // false
console.log(NaN <= 1); // false
```

This is why you should validate numeric input before comparing it.

```js
const input = "hello";
const value = Number(input);

if (Number.isNaN(value)) {
  console.log("Please enter a valid number");
} else if (value > 10) {
  console.log("Value is greater than 10");
}
```

## Comparing Booleans

When booleans are compared with numbers, JavaScript can coerce them.

```js
console.log(true > false); // true
console.log(true > 0); // true
console.log(false < 1); // true
```

This happens because:

```js
Number(true); // 1
Number(false); // 0
```

Even though this works, it is usually clearer to compare booleans directly in conditions.

```js
const isLoggedIn = true;

if (isLoggedIn) {
  console.log("Welcome");
}
```

## Comparing `null` and `undefined`

Relational comparisons with `null` and `undefined` can be confusing.

```js
console.log(null >= 0); // true
console.log(null > 0); // false
console.log(null == 0); // false
```

This happens because relational comparison and equality comparison follow different coercion rules.

`undefined` usually becomes `NaN` in numeric comparison:

```js
console.log(undefined > 0); // false
console.log(undefined < 0); // false
console.log(undefined >= 0); // false
```

Best practice: avoid relational comparisons with `null` and `undefined`. Check for missing values first.

```js
if (value == null) {
  console.log("Value is missing");
} else if (value > 10) {
  console.log("Value is greater than 10");
}
```

## Comparing Objects and Arrays

Objects and arrays are reference types.

Relational comparisons with them can trigger conversion to primitive values, often strings.

```js
console.log([1, 2] > [1, 1]); // true
```

This happens because arrays can convert to strings:

```js
String([1, 2]); // "1,2"
String([1, 1]); // "1,1"
```

Then JavaScript compares the strings.

Objects are even less useful in relational comparisons:

```js
console.log({} > {}); // false
console.log({} < {}); // false
```

Avoid using `<`, `>`, `<=`, or `>=` directly with objects and arrays unless you intentionally control how conversion works.

Compare specific properties instead:

```js
const userA = { age: 25 };
const userB = { age: 30 };

console.log(userA.age < userB.age); // true
```

## Combining Comparisons with Logical Operators

Comparisons are often combined with logical operators.

```js
const age = 25;
const hasTicket = true;

if (age >= 18 && hasTicket) {
  console.log("Entry allowed");
}
```

Another example:

```js
const score = 82;

if (score >= 80 && score <= 100) {
  console.log("Valid high score");
}
```

This checks whether `score` is inside a range.

## Common Mistakes

## Comparing Numeric Strings as Strings

```js
console.log("10" < "2"); // true
```

Convert to numbers first:

```js
console.log(Number("10") < Number("2")); // false
```

## Assuming Comparisons with `NaN` Work

```js
console.log(NaN > 0); // false
console.log(NaN <= 0); // false
```

Use `Number.isNaN()` to detect invalid numbers.

## Comparing Whole Objects

```js
const productA = { price: 100 };
const productB = { price: 200 };

console.log(productA < productB); // Not useful
```

Compare the property you care about:

```js
console.log(productA.price < productB.price); // true
```

## Best Practices

1. Compare numbers with numbers.
2. Convert numeric strings before numeric comparison.
3. Be careful with string comparisons because they are lexicographical.
4. Validate values before comparing if they may become `NaN`.
5. Avoid relational comparisons with objects and arrays.
6. Compare object properties instead of whole objects.
7. Use parentheses when combining comparisons with logical operators.

## Summary

Comparison operators compare values and return booleans.

Remember:

1. `>`, `<`, `>=`, and `<=` are relational comparison operators.
2. Number comparisons behave like normal math.
3. String comparisons are lexicographical.
4. `"10" < "2"` is `true` because both values are strings.
5. String-number comparisons can trigger numeric coercion.
6. Any comparison with `NaN` is false.
7. Avoid relational comparisons with objects and arrays.

Next, you will learn about equality operators, where JavaScript's strict and loose comparison rules become especially important.