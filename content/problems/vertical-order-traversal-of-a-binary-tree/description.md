You're given a binary tree. Return its vertical order traversal: group nodes into columns based on how many steps left or right they sit from the root (a left child shifts one column left, a right child one column right), list the columns from leftmost to rightmost, and within a column read nodes top to bottom. Nodes tied on the same position are ordered by ascending value.

**Example:** root = [3,9,20,null,null,15,7] → [[9],[3,15],[20],[7]]
