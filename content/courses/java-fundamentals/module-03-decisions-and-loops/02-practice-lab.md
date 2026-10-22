# Practical lab: Decisions and loops

A delivery service applies shipping rules.

## Your challenge

Count orders eligible for free shipping at a threshold of 1000, then test an empty order array.

## Environment

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

## Work through it

1. Predict the original example’s result without running it.
2. Reproduce it locally and explain any difference.
3. Make the requested change in small steps.
4. Check each acceptance criterion below; add a failing case before repairing a bug.

## Acceptance criteria

- [ ] The sample produces 1.
- [ ] An empty array produces 0.
- [ ] An order of exactly 1000 qualifies.

<details>
<summary>Show a hint</summary>

Keep >= and change only the threshold; initialize the counter before the loop.

</details>

<details>
<summary>Show the reference approach</summary>

This is the key change or building block; use the acceptance criteria to finish and verify the complete exercise. Project fragments belong in the environment described above.


```java
int free = 0;
for (int subtotal : orders) {
  if (subtotal >= 1000) free++;
}
System.out.println(free);
```


</details>

## Runnable reference project

[Download all three Java reference projects](/downloads/java-course-labs.zip). Unzip the archive, read its README, and open `fundamentals/` for this stage. Run `./mvnw -pl fundamentals test` from the archive root. The download contains complete applications and tests; the small reference above highlights the relevant idea. For project-specific setup, API requests, persistence, and failure demonstrations, follow the included walkthrough.

## Review your work

Explain how the change satisfies each criterion. Keep the relevant source and tests in your local project. For the capstone, record setup instructions and demonstrate both a successful path and a rejected operation. Lab completion is self-reported; the course quiz checks conceptual understanding.

[Take this module’s course quiz](/courses/java-fundamentals/module-03-decisions-and-loops/03-module-quiz) · [Try independent public practice](/quiz/java-decisions-and-loops-practice) · [See the full path](/courses/java)
