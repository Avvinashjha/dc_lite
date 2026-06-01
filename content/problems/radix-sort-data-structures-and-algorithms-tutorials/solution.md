## LSD Radix Sort

```javascript
function radixSort(arr) {
  const max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const buckets = Array.from({length:10}, ()=>[]);
    for (const n of arr) buckets[Math.floor(n/exp) % 10].push(n);
    arr = buckets.flat();
  }
  return arr;
}
```

**Time:** O(d × (n + k)) | **Space:** O(n + k)
