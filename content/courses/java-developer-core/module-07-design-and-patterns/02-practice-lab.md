# Practical lab: Clean design and practical patterns

An order service chooses a pricing policy without a growing conditional.

## Your challenge

Add a festival pricing strategy that subtracts 100 but never returns a negative amount; test it through Pricing.

## Environment

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

## Work through it

1. Predict the original example’s result without running it.
2. Reproduce it locally and explain any difference.
3. Make the requested change in small steps.
4. Check each acceptance criterion below; add a failing case before repairing a bug.

## Acceptance criteria

- [ ] Base 1000 returns 900.
- [ ] Base 50 returns 0.
- [ ] Existing regular and member policies retain their behavior.

<details>
<summary>Show a hint</summary>

Use Math.max and keep the new rule in its own implementation.

</details>

<details>
<summary>Show the reference approach</summary>

This is the key change or building block; use the acceptance criteria to finish and verify the complete exercise. Project fragments belong in the environment described above.


```java
class FestivalPricing implements Pricing {
  public int total(int base) { return Math.max(0, base - 100); }
}
```


</details>

## Runnable reference project

[Download all three Java reference projects](/downloads/java-course-labs.zip). Unzip the archive, read its README, and open `developer-core/` for this stage. Run `./mvnw -pl developer-core test` from the archive root. The download contains complete applications and tests; the small reference above highlights the relevant idea. For project-specific setup, API requests, persistence, and failure demonstrations, follow the included walkthrough.

## Review your work

Explain how the change satisfies each criterion. Keep the relevant source and tests in your local project. For the capstone, record setup instructions and demonstrate both a successful path and a rejected operation. Lab completion is self-reported; the course quiz checks conceptual understanding.

[Take this module’s course quiz](/courses/java-developer-core/module-07-design-and-patterns/03-module-quiz) · [Try independent public practice](/quiz/java-design-and-patterns-practice) · [See the full path](/courses/java)
