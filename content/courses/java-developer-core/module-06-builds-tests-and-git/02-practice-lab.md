# Practical lab: Builds, unit tests, and Git

A team makes the expense tracker reproducible.

## Your challenge

Create a Maven project and add JUnit Jupiter tests for a 20% discount, zero discount, 100% discount, and invalid input.

## Environment

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

## Work through it

1. Predict the original example’s result without running it.
2. Reproduce it locally and explain any difference.
3. Make the requested change in small steps.
4. Check each acceptance criterion below; add a failing case before repairing a bug.

## Acceptance criteria

- [ ] ./mvnw test succeeds from the project root.
- [ ] assertEquals checks 800, 1000, and 0 for price 1000.
- [ ] assertThrows checks percentages -1 and 101.
- [ ] The production method lives under src/main/java.

<details>
<summary>Show a hint</summary>

Use the current stable JUnit Jupiter dependency documented in the course references; keep its scope test.

</details>

<details>
<summary>Show the reference approach</summary>

This is the key change or building block; use the acceptance criteria to finish and verify the complete exercise. Project fragments belong in the environment described above.


```java
@org.junit.jupiter.api.Test
void rejectsInvalidPercent() {
  org.junit.jupiter.api.Assertions.assertThrows(IllegalArgumentException.class,
    () -> discounted(1000, 101));
}
```


</details>

## Runnable reference project

[Download all three Java reference projects](/downloads/java-course-labs.zip). Unzip the archive, read its README, and open `developer-core/` for this stage. Run `./mvnw -pl developer-core test` from the archive root. The download contains complete applications and tests; the small reference above highlights the relevant idea. For project-specific setup, API requests, persistence, and failure demonstrations, follow the included walkthrough.

## Review your work

Explain how the change satisfies each criterion. Keep the relevant source and tests in your local project. For the capstone, record setup instructions and demonstrate both a successful path and a rejected operation. Lab completion is self-reported; the course quiz checks conceptual understanding.

[Take this module’s course quiz](/courses/java-developer-core/module-06-builds-tests-and-git/03-module-quiz) · [Try independent public practice](/quiz/java-builds-tests-and-git-practice) · [See the full path](/courses/java)
