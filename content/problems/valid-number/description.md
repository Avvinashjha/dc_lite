Return whether the **entire string** `s` is a valid number under these rules:

1. Start with an optional `+` or `-` sign.
2. Follow it with an integer or decimal containing at least one digit. A decimal has exactly one dot and may omit digits on either side, but not both: `"4."`, `".5"`, and `"4.5"` are valid; `"."` is not.
3. Optionally append `e` or `E`, an optional sign, and **one or more digits**. The exponent must be an integer, so `"1e2.5"` is invalid.

Leading zeros are allowed. Other letters are invalid, including `"NaN"`, `"Infinity"`, and hexadecimal notation such as `"0x10"`. Inputs contain no whitespace.

Check syntax only, not numerical magnitude: `"1e999"` is valid even though its value exceeds the finite range of a JavaScript Number. Return a boolean, not a parsed number.
