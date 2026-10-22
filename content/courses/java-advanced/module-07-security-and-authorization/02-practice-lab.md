# Practical lab: Application security and authorization

Ensure each user sees only their own expenses.

## Your challenge

Add authenticated access to the expense API and enforce ownership in reads, updates, and deletes.

## Environment

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

## Work through it

1. Predict the original example’s result without running it.
2. Reproduce it locally and explain any difference.
3. Make the requested change in small steps.
4. Check each acceptance criterion below; add a failing case before repairing a bug.

## Acceptance criteria

- [ ] Anonymous access is rejected according to the configured authentication scheme.
- [ ] Alice can access her own expense.
- [ ] Bob cannot read or modify Alice’s expense by guessing an id.
- [ ] Security tests cover all three cases; logs contain no credentials.

<details>
<summary>Show a hint</summary>

Use an ownership-qualified repository query or a service authorization check; never trust an owner field supplied in the request body.

</details>

<details>
<summary>Show the reference approach</summary>

This is the key change or building block; use the acceptance criteria to finish and verify the complete exercise. Project fragments belong in the environment described above.


```java
// Service-boundary sketch using the authenticated identity, not a request owner field:
// var expense = repository.findByIdAndOwner(id, authenticatedUser)
//     .orElseThrow(() -> new ExpenseNotFoundException(id));
// Apply the same ownership constraint to updates and deletes.
```


</details>

## Runnable reference project

[Download all three Java reference projects](/downloads/java-course-labs.zip). Unzip the archive, read its README, and open `backend/` for this stage. Run `./mvnw -pl backend test` from the archive root. The download contains complete applications and tests; the small reference above highlights the relevant idea. For project-specific setup, API requests, persistence, and failure demonstrations, follow the included walkthrough.

## Review your work

Explain how the change satisfies each criterion. Keep the relevant source and tests in your local project. For the capstone, record setup instructions and demonstrate both a successful path and a rejected operation. Lab completion is self-reported; the course quiz checks conceptual understanding.

[Take this module’s course quiz](/courses/java-advanced/module-07-security-and-authorization/03-module-quiz) · [Try independent public practice](/quiz/java-security-and-authorization-practice) · [See the full path](/courses/java)
