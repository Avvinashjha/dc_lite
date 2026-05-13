## Approach 1: Set (O(n) time, O(n) space)

```javascript
function containsDuplicate(nums) {
  const seen = new Set();
  for (const x of nums) {
    if (seen.has(x)) return true;
    seen.add(x);
  }
  return false;
}
```

Or compare sizes: `new Set(nums).size !== nums.length`.

## Approach 2: Sort (O(n log n) time, O(1) or O(n) space)

Sort and check adjacent pairs for equality.

## Approach 2b: Sorting in place

```javascript
function containsDuplicate(nums) {
  const a = [...nums].sort((x, y) => x - y);
  for (let i = 1; i < a.length; i++) {
    if (a[i] === a[i - 1]) return true;
  }
  return false;
}
```

For interviews, the Set solution is the usual expected answer.
