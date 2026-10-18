You're given two numbers, each represented as a linked list of digits. Digits are stored most significant first. Subtract the smaller number from the larger one and return the non-negative result in the same order, without leading zeros except for a single zero node when the numbers are equal.

The input lists may have leading zeros, and either list may represent the larger number. Each node holds one decimal digit in `val`, with `next` pointing to the following digit. Return a list head, not an array or a JavaScript number.

The numbers may contain 10,000 digits, so converting them to `Number` loses precision. For example, `[0,0,1]` and `[2]` represent 1 and 2, giving `[1]`.
