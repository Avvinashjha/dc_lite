Assign a decimal digit to every letter so that the sum of the addends in `words` equals `result`.

- Each letter always represents the same digit.
- Different letters must represent different digits.
- The first letter of every word must be nonzero. **In this version, this also applies to one-letter words.**
- Return a **letter-to-digit object**, such as `{"A":1,"B":2,"C":3}` for `A + B = C`. Any valid assignment is accepted.
- Return `null` if no assignment satisfies all rules.

For `SEND + MORE = MONEY`, one assignment gives `9567 + 1085 = 10652`.

Words may contain up to 20 letters. Their numeric values can exceed JavaScript's safe integer range; use column arithmetic with carries or exact integer arithmetic rather than converting whole words to `Number`.
