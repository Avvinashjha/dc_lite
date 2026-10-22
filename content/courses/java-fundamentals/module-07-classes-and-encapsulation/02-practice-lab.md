# Practical lab: Classes, objects, and encapsulation

A digital wallet protects its balance.

## Your challenge

Add withdraw(int amount), rejecting nonpositive amounts and withdrawals larger than the balance.

## Environment

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

## Work through it

1. Predict the original example’s result without running it.
2. Reproduce it locally and explain any difference.
3. Make the requested change in small steps.
4. Check each acceptance criterion below; add a failing case before repairing a bug.

## Acceptance criteria

- [ ] Deposit 50 then withdraw 20 leaves 30.
- [ ] Withdraw 51 from balance 50 fails without changing the balance.
- [ ] Zero and negative withdrawals fail.

<details>
<summary>Show a hint</summary>

Check every precondition before subtracting.

</details>

<details>
<summary>Show the reference approach</summary>

This is the key change or building block; use the acceptance criteria to finish and verify the complete exercise. Project fragments belong in the environment described above.


```java
void withdraw(int amount) {
  if (amount <= 0 || amount > balance) throw new IllegalArgumentException("Invalid withdrawal");
  balance -= amount;
}
```


</details>

## Runnable reference project

[Download all three Java reference projects](/downloads/java-course-labs.zip). Unzip the archive, read its README, and open `fundamentals/` for this stage. Run `./mvnw -pl fundamentals test` from the archive root. The download contains complete applications and tests; the small reference above highlights the relevant idea. For project-specific setup, API requests, persistence, and failure demonstrations, follow the included walkthrough.

## Review your work

Explain how the change satisfies each criterion. Keep the relevant source and tests in your local project. For the capstone, record setup instructions and demonstrate both a successful path and a rejected operation. Lab completion is self-reported; the course quiz checks conceptual understanding.

[Take this module’s course quiz](/courses/java-fundamentals/module-07-classes-and-encapsulation/03-module-quiz) · [Try independent public practice](/quiz/java-classes-and-encapsulation-practice) · [See the full path](/courses/java)
