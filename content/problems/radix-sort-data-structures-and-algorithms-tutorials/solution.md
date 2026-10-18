## Least-Significant-Digit Radix Sort

Find the largest value with a loop. This avoids passing an entire large array as arguments to `Math.max`.

For each decimal position, distribute numbers into ten buckets using `floor(number / exp) % 10`. Visit the current array in order and append to each bucket, then concatenate buckets from digit zero to nine. This makes each pass stable.

After processing a digit, numbers are sorted by all digits processed so far. Stability preserves the lower-digit ordering within each equal higher-digit bucket. After the last digit of the maximum value, that ordering is the full numeric ordering. An all-zero array is already sorted and needs no digit passes.

```javascript
function radixSort(arr) {
  let max = 0;
  for (const value of arr) max = Math.max(max, value);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const buckets = Array.from({ length: 10 }, () => []);
    for (const n of arr) buckets[Math.floor(n / exp) % 10].push(n);
    arr = buckets.flat();
  }
  return arr;
}
```

**Time:** O(n + d × (n + 10)) | **Space:** O(n + 10), where d is the number of decimal digit passes (at most 10 under these bounds). The initial maximum scan also runs when all values are zero.
