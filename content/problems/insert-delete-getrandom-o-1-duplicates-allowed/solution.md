Use an array for O(1) random access and a hash map that maps each value to a set of its indices. To remove in O(1), swap the target with the last element, update index sets, then pop the array.

```javascript
class RandomizedCollection {
  constructor() {
    this.list = [];
    this.idxMap = new Map();
  }

  insert(val) {
    this.list.push(val);
    if (!this.idxMap.has(val)) this.idxMap.set(val, new Set());
    this.idxMap.get(val).add(this.list.length - 1);
    return this.idxMap.get(val).size === 1;
  }

  remove(val) {
    if (!this.idxMap.has(val) || this.idxMap.get(val).size === 0) return false;
    const removeIdx = this.idxMap.get(val).values().next().value;
    const lastIdx = this.list.length - 1;
    const lastVal = this.list[lastIdx];

    this.list[removeIdx] = lastVal;
    this.idxMap.get(val).delete(removeIdx);
    this.idxMap.get(lastVal).add(removeIdx);
    this.idxMap.get(lastVal).delete(lastIdx);

    this.list.pop();
    if (this.idxMap.get(val).size === 0) this.idxMap.delete(val);
    return true;
  }

  getRandom() {
    return this.list[Math.floor(Math.random() * this.list.length)];
  }
}
```

**Time:** O(1) average for insert, remove, and getRandom
**Space:** O(n)
