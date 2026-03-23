## Trie / Hash Map

```javascript
function palindromePairs(words) {
  const map = new Map(); words.forEach((w,i) => map.set(w, i));
  const isPalin = s => { let l=0,r=s.length-1; while(l<r) if(s[l++]!==s[r--]) return false; return true; };
  const result = [];
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    for (let j = 0; j <= w.length; j++) {
      const left = w.slice(0,j), right = w.slice(j);
      const revLeft = left.split('').reverse().join('');
      const revRight = right.split('').reverse().join('');
      if (isPalin(right) && map.has(revLeft) && map.get(revLeft)!==i) result.push([i, map.get(revLeft)]);
      if (j > 0 && isPalin(left) && map.has(revRight) && map.get(revRight)!==i) result.push([map.get(revRight), i]);
    }
  }
  return result;
}
```

**Time:** O(n × k²) | **Space:** O(n × k)
