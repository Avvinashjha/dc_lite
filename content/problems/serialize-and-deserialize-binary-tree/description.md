Implement two functions that encode a binary tree into a string and reconstruct its values and shape:

- `serialize(root)` returns a string. Use any unambiguous encoding you choose.
- `deserialize(data)` returns a newly constructed tree from that string.

The functions run in separate fresh scopes. Do not rely on shared variables or saved node references: the string must contain everything needed to reconstruct the tree. The empty tree must also round-trip correctly.

Missing children matter. For example, `[1,2]` (a left child) and `[1,null,2]` (a right child) must have distinguishable encodings. Node values can repeat or be negative.

The result shown by the runner is the reconstructed tree, not the encoded string. The displayed level-order array is only the input/output notation; you do not have to use it as your string format.
