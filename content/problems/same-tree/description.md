Given the roots `p` and `q` of two binary trees, return whether they have exactly the same structure and matching values at every corresponding position.

Left and right positions matter: a left child does not match a right child. The nodes do not need to be the same objects; compare their values and child structure. Equal collections of values alone are not enough.

Two empty trees are the same. If exactly one tree is empty, they are different. For `p = [1, 2]` and `q = [1, null, 2]`, return `false` because the node containing `2` is on a different side.

Examples use level-order arrays with `null` for missing children. Your function receives nodes with `val`, `left`, and `right` properties.
