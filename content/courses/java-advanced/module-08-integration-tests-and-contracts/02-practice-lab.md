# Practical lab: Integration tests and API contracts

Catch API, database, and security regressions before release.

## Your challenge

Create a regression suite for expense creation, validation, persistence, and ownership with a PostgreSQL test container.

## Environment

JUnit Jupiter test source using the Expense and canRead domain example from the previous module. For HTTP tests use the project’s configured Spring MVC test support; these assertions alone are not a full endpoint test.

## Work through it

1. Predict the original example’s result without running it.
2. Reproduce it locally and explain any difference.
3. Make the requested change in small steps.
4. Check each acceptance criterion below; add a failing case before repairing a bug.

## Acceptance criteria

- [ ] A clean test database runs all migrations.
- [ ] Controller tests verify 201, 400, and missing-record behavior.
- [ ] Authenticated cross-user reads and writes are denied.
- [ ] The same suite runs in CI with a documented container requirement.

<details>
<summary>Show a hint</summary>

Use narrowly scoped tests for fast feedback and one HTTP-to-database journey to verify wiring.

</details>

<details>
<summary>Show the reference approach</summary>

This is the key change or building block; use the acceptance criteria to finish and verify the complete exercise. Project fragments belong in the environment described above.


```java
// Example test matrix to implement with the application test fixtures:
// valid owner creates expense -> 201, Location, persisted row
// negative amount -> 400, no row
// unknown id -> documented 404
// other owner -> documented denial, unchanged row
// stale version -> conflict, winning row preserved
```


</details>

## Runnable reference project

[Download all three Java reference projects](/downloads/java-course-labs.zip). Unzip the archive, read its README, and open `backend/` for this stage. Run `./mvnw -pl backend test` from the archive root. The download contains complete applications and tests; the small reference above highlights the relevant idea. For project-specific setup, API requests, persistence, and failure demonstrations, follow the included walkthrough.

## Review your work

Explain how the change satisfies each criterion. Keep the relevant source and tests in your local project. For the capstone, record setup instructions and demonstrate both a successful path and a rejected operation. Lab completion is self-reported; the course quiz checks conceptual understanding.

[Take this module’s course quiz](/courses/java-advanced/module-08-integration-tests-and-contracts/03-module-quiz) · [Try independent public practice](/quiz/java-integration-tests-and-contracts-practice) · [See the full path](/courses/java)
