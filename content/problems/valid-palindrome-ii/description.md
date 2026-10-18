You're given a string `s`. Report `true` if removing **no more than one** character from it can turn it into a palindrome.

The string is made up solely of lowercase letters, and a string that's already a palindrome also counts — you're allowed to delete zero characters.

A palindrome reads the same forward and backward. Delete a character at any position while keeping the order of the remaining characters; replacing or rearranging characters is not allowed. Return only a boolean.

For `"abca"`, deleting either `b` or `c` works. For `"abc"`, every single deletion leaves two different characters, so return `false`.
