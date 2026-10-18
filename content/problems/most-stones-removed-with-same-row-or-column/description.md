You're given a list of stones placed on a 2D grid, each described by its `[x, y]` coordinates. A stone can be removed as long as some other remaining stone still shares its row or its column. Determine the largest number of stones that can be removed this way.

The other stone must still be present at the moment of removal. Sharing a row or column does not require adjacent coordinates; diagonal contact alone does not count. Return the count, not a removal order.

For `[[0,0],[0,1],[1,1]]`, remove `(0,0)` first using `(0,1)`, then remove `(0,1)` using `(1,1)`. Two removals are possible, leaving one stone.
