## Trie with Sorted Suggestions

Sort a copy of the contacts lexicographically. Insert each name into a trie, appending it to the suggestion list at every prefix node along its route. Because insertion follows sorted order, every node's suggestion list is already sorted; no per-query sorting is necessary.

Walk the trie one query character at a time and return that node's list. Once a character has no child, no longer prefix can match either, so append empty lists for the remaining characters. A complete contact is included at its last prefix node, just like longer contacts sharing that prefix.

```javascript
function phoneDirectory(contacts, query) {
  const makeNode = () => ({ children: new Map(), words: [] });
  const root = makeNode();
  for (const contact of [...contacts].sort()) {
    let node = root;
    for (const char of contact) {
      if (!node.children.has(char)) node.children.set(char, makeNode());
      node = node.children.get(char);
      node.words.push(contact);
    }
  }
  const results = [];
  let node = root;
  for (const char of query) {
    node = node?.children.get(char);
    results.push(node ? node.words.slice() : []);
  }
  return results;
}
```

Let N be the number of contacts, L their maximum length, Q the query length, and R the total number of returned contact references across all suggestion lists.

**Time:** O(N log N × L + N × L + Q + R), including string comparisons during sorting, trie construction, and copying suggestions.

**Space:** O(N × L + Q + R), including the trie and returned lists. Suggestion arrays reference the input strings rather than copying each name's characters.
