# Practical lab: Methods and debugging

A restaurant reuses a tip calculator.

## Your challenge

Add validation to tip so negative bills and percentages throw; preserve integer rounding toward zero.

## Environment

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

## Work through it

1. Predict the original example’s result without running it.
2. Reproduce it locally and explain any difference.
3. Make the requested change in small steps.
4. Check each acceptance criterion below; add a failing case before repairing a bug.

## Acceptance criteria

- [ ] tip(800, 10) returns 80.
- [ ] tip(99, 10) returns 9.
- [ ] Negative bill or percent throws IllegalArgumentException.

<details>
<summary>Show a hint</summary>

Guard invalid inputs before return. Consider overflow if this becomes a production money API.

</details>

<details>
<summary>Show the reference approach</summary>

This is the key change or building block; use the acceptance criteria to finish and verify the complete exercise. Project fragments belong in the environment described above.


```java
int tip(int bill, int percent) {
  if (bill < 0 || percent < 0) throw new IllegalArgumentException("Negative input");
  return Math.multiplyExact(bill, percent) / 100;
}
```


</details>

## Runnable reference project

[Download all three Java reference projects](/downloads/java-course-labs.zip). Unzip the archive, read its README, and open `fundamentals/` for this stage. Run `./mvnw -pl fundamentals test` from the archive root. The download contains complete applications and tests; the small reference above highlights the relevant idea. For project-specific setup, API requests, persistence, and failure demonstrations, follow the included walkthrough.

## Review your work

Explain how the change satisfies each criterion. Keep the relevant source and tests in your local project. For the capstone, record setup instructions and demonstrate both a successful path and a rejected operation. Lab completion is self-reported; the course quiz checks conceptual understanding.

[Take this module’s course quiz](/courses/java-fundamentals/module-04-methods-and-debugging/03-module-quiz) · [Try independent public practice](/quiz/java-methods-and-debugging-practice) · [See the full path](/courses/java)
