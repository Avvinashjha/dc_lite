## Approach 1: Recursion

Peel off one digit at a time and recurse on the rest.

```javascript
function sumOfDigits(n) {
  if (n < 10) return n;                                // base case
  return (n % 10) + sumOfDigits(Math.floor(n / 10));   // last digit + rest
}
```

**Time:** O(d) where d is the number of digits. &nbsp; **Space:** O(d) stack.

Trace for `n = 1234`:

```text
sumOfDigits(1234)
  └─ 4 + sumOfDigits(123)
          └─ 3 + sumOfDigits(12)
                 └─ 2 + sumOfDigits(1)
                         └─ 1                 ◀── base case
                 ← returns 2 + 1 = 3
          ← returns 3 + 3 = 6
  ← returns 4 + 6 = 10
```

## Approach 2: Iterative

```javascript
function sumOfDigits(n) {
  let sum = 0;
  while (n > 0) {
    sum += n % 10;
    n = Math.floor(n / 10);
  }
  return sum;
}
```

**Time:** O(d) &nbsp; **Space:** O(1)

## Approach 3: String conversion (concise but slightly slower)

```javascript
function sumOfDigits(n) {
  return String(n).split('').reduce((s, d) => s + Number(d), 0);
}
```

Readable, but pays for string allocation. Stick with Approach 1 or 2 for hot paths.

## Bonus: digital root in O(1)

Repeatedly apply `sumOfDigits` until a single digit remains. The final answer equals `0` if `n === 0`, else `1 + (n - 1) % 9` — a delightful number-theory identity:

```javascript
function digitalRoot(n) {
  if (n === 0) return 0;
  return 1 + (n - 1) % 9;
}
```
