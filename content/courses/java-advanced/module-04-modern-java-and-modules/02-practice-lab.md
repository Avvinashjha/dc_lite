# Practical lab: Modern Java, reflection, and modules

Model API outcomes and inspect explicit application metadata.

## Your challenge

Add a Pending record outcome and update the exhaustive switch. Define a deliberate null policy.

## Environment

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

## Work through it

1. Predict the original example’s result without running it.
2. Reproduce it locally and explain any difference.
3. Make the requested change in small steps.
4. Check each acceptance criterion below; add a failing case before repairing a bug.

## Acceptance criteria

- [ ] All three permitted outcomes have an explicit arm.
- [ ] Adding a new permitted subtype forces a conscious switch update.
- [ ] Reject null explicitly or handle it with a null case.

<details>
<summary>Show a hint</summary>

Update the permits list and the switch together; Objects.requireNonNull makes rejection explicit.

</details>

<details>
<summary>Show the reference approach</summary>

This is the key change or building block; use the acceptance criteria to finish and verify the complete exercise. Project fragments belong in the environment described above.


```java
// Add Pending to the permits clause, then add this record and a switch arm.
record Pending(String jobId) implements Outcome {}
// case Pending p -> "PENDING: " + p.jobId();
```


</details>

## Runnable reference project

[Download all three Java reference projects](/downloads/java-course-labs.zip). Unzip the archive, read its README, and open `backend/` for this stage. Run `./mvnw -pl backend test` from the archive root. The download contains complete applications and tests; the small reference above highlights the relevant idea. For project-specific setup, API requests, persistence, and failure demonstrations, follow the included walkthrough.

## Review your work

Explain how the change satisfies each criterion. Keep the relevant source and tests in your local project. For the capstone, record setup instructions and demonstrate both a successful path and a rejected operation. Lab completion is self-reported; the course quiz checks conceptual understanding.

[Take this module’s course quiz](/courses/java-advanced/module-04-modern-java-and-modules/03-module-quiz) · [Try independent public practice](/quiz/java-modern-java-and-modules-practice) · [See the full path](/courses/java)
