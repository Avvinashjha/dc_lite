# Practical lab: HTTP, JSON, and the developer core capstone

Turn the expense tracker into a tested application boundary.

## Your challenge

Complete the persistent expense capstone with a replaceable exchange-rate client, deterministic tests, and a monthly report.

## Environment

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

## Work through it

1. Predict the original example’s result without running it.
2. Reproduce it locally and explain any difference.
3. Make the requested change in small steps.
4. Check each acceptance criterion below; add a failing case before repairing a bug.

## Acceptance criteria

- [ ] The monthly report excludes expenses outside its date range.
- [ ] JDBC storage survives a restart.
- [ ] A simulated HTTP 500 produces a useful failure rather than a fake exchange rate.
- [ ] Unit tests use a fake client and never require internet access.

<details>
<summary>Show a hint</summary>

Define an ExchangeRates interface and inject it into the service; keep parsing in the HTTP adapter.

</details>

<details>
<summary>Show the reference approach</summary>

This is the key change or building block; use the acceptance criteria to finish and verify the complete exercise. Project fragments belong in the environment described above.


```java
interface ExchangeRates { java.math.BigDecimal rate(String from, String to); }
class FixedRates implements ExchangeRates {
  public java.math.BigDecimal rate(String from, String to) {
    return new java.math.BigDecimal("1.00");
  }
}
System.out.println(new FixedRates().rate("INR", "INR"));
```


</details>

## Runnable reference project

[Download all three Java reference projects](/downloads/java-course-labs.zip). Unzip the archive, read its README, and open `developer-core/` for this stage. Run `./mvnw -pl developer-core test` from the archive root. The download contains complete applications and tests; the small reference above highlights the relevant idea. For project-specific setup, API requests, persistence, and failure demonstrations, follow the included walkthrough.

## Review your work

Explain how the change satisfies each criterion. Keep the relevant source and tests in your local project. For the capstone, record setup instructions and demonstrate both a successful path and a rejected operation. Lab completion is self-reported; the course quiz checks conceptual understanding.

[Take this module’s course quiz](/courses/java-developer-core/module-10-http-json-and-core-capstone/03-module-quiz) · [Try independent public practice](/quiz/java-http-json-and-core-capstone-practice) · [See the full path](/courses/java)
