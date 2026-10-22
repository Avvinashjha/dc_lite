# Dates, numbers, and text patterns

**Real-life problem:** A booking service schedules visits across time zones.

**You will learn:** Local dates versus instants; Zones, daylight saving, and testable time; BigDecimal and rounding policies; Regular expressions and validation.

## Chapter 1: Local dates versus instants

LocalDate represents a calendar date without a clock or zone. Instant identifies a point on the timeline. LocalDateTime has no zone and cannot identify an unambiguous global instant by itself. Select a type that matches the business meaning instead of storing every timestamp as a string.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
var date = java.time.LocalDate.of(2026,10,22);
var instant = java.time.Instant.parse("2026-10-22T00:00:00Z");
System.out.println(date);
System.out.println(instant.atZone(java.time.ZoneId.of("Asia/Kolkata")).getHour());
```


<details>
<summary>Check the result and reasoning</summary>


```text
2026-10-22
5
```


The date does not identify an instant. The same instant appears at different local times in different zones. Duration measures elapsed time while Period models calendar-based date amounts.

</details>

**Your turn:** Would a LocalDateTime alone be sufficient to store a global meeting time?

<details>
<summary>Check your reasoning</summary>

No. You need a zone or offset policy and must consider zone transitions and ambiguous local times.

</details>

## Chapter 2: Zones, daylight saving, and testable time

ZonedDateTime combines local information with zone rules. Daylight-saving transitions can make a local time ambiguous or nonexistent. Inject a Clock so expiry tests do not depend on wall-clock timing. Store instants for events and preserve the customer’s zone when it is part of the booking contract.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
var clock = java.time.Clock.fixed(java.time.Instant.parse("2026-10-22T12:00:00Z"),java.time.ZoneOffset.UTC);
System.out.println(java.time.LocalDate.now(clock));
```


<details>
<summary>Check the result and reasoning</summary>


```text
2026-10-22
```


A fixed clock turns today into a deterministic input. Production can inject a system clock while tests use a fixed or offset clock. Time-based tests should not sleep until a calendar boundary.

</details>

**Your turn:** How would you test an expiry exactly at its deadline?

<details>
<summary>Check your reasoning</summary>

Use a fixed Clock at the deadline and state whether equality means expired. Add instants just before and after it.

</details>

## Chapter 3: BigDecimal and rounding policies

Use decimal strings to construct exact decimal amounts. equals compares value and scale, while compareTo compares numerical value. Specify scale and RoundingMode for divisions that may repeat. State whether rounding occurs per item or on the final total because those policies can produce different results.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
var a = new java.math.BigDecimal("1.0");
var b = new java.math.BigDecimal("1.00");
System.out.println(a.equals(b));
System.out.println(a.compareTo(b));
```


<details>
<summary>Check the result and reasoning</summary>


```text
false
0
```


equals includes scale while compareTo compares numerical magnitude. This difference matters for collection membership and financial comparisons. Decide which meaning the domain operation needs.

</details>

**Your turn:** Why can three shares rounded to two decimals fail to sum to the original bill?

<details>
<summary>Check your reasoning</summary>

Each independent rounding can discard a fraction. Allocate the remaining minor units deliberately instead of silently changing the total.

</details>

## Chapter 4: Regular expressions and validation

Pattern compiles an expression and Matcher applies it. matches requires the entire input; find searches for a matching subsequence. Escape backslashes in Java string literals. Keep validation bounded and simple, and use domain-aware parsers for complex formats instead of inventing a universal regex.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
var pattern = java.util.regex.Pattern.compile("[A-Z]{2}-[0-9]{4}");
System.out.println(pattern.matcher("AB-1234").matches());
System.out.println(pattern.matcher("code AB-1234 here").find());
```


<details>
<summary>Check the result and reasoning</summary>


```text
true
true
```


matches checks the entire input; find locates a subsequence. Capture groups extract matched sections. Java string literals and regex syntax each have their own escaping layer.

</details>

**Your turn:** What Java string literal represents regex \d+?

<details>
<summary>Check your reasoning</summary>

"\\d+". The Java source uses two backslashes to pass one to the regular-expression engine.

</details>

## Predict and explore

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

:::learninglab
{
  "title": "Dates, numbers, and text patterns",
  "code": "var date = java.time.LocalDate.of(2026, 10, 22);\nSystem.out.println(date.plusDays(10));\nvar amount = new java.math.BigDecimal(\"10.00\");\nSystem.out.println(amount.divide(new java.math.BigDecimal(\"3\"), 2, java.math.RoundingMode.HALF_UP));",
  "output": "2026-11-01\n3.33",
  "steps": [
    {
      "label": "Calendar arithmetic",
      "detail": "Adding 10 days crosses the month boundary to November 1."
    },
    {
      "label": "Decimal division",
      "detail": "10 / 3 has a repeating decimal expansion."
    },
    {
      "label": "Apply policy",
      "detail": "Scale 2 with HALF_UP produces 3.33."
    }
  ],
  "prediction": {
    "question": "What date and rounded decimal does the example print?",
    "options": [
      "2026-11-01\n3.34",
      "2026-11-01\n3.33",
      "2026-10-32\n3.33",
      "2026-11-01\n3"
    ],
    "answer": 1,
    "explanation": "Adding 10 days crosses the month boundary to November 1. 10 / 3 has a repeating decimal expansion. Scale 2 with HALF_UP produces 3.33."
  }
}
:::

## Explain it back

Describe why the result follows from the code. Identify one assumption that would change the outcome, then test that change locally. For concurrent examples, distinguish the scheduling from guarantees established by the APIs.

Continue to the [practical lab](/courses/java-developer-core/module-04-dates-numbers-and-patterns/02-practice-lab). You can also revisit the [complete Java curriculum](/courses/java).

<details>
<summary>Official references and further reading</summary>

- [Java language, APIs, and JVM learning map](https://dev.java/learn/)
- [Java LTS release roadmap](https://www.oracle.com/technetwork/java/javase/tech/eol-135779.html)
- [Virtual thread adoption guidance](https://inside.java/2023/09/20/virtual-threads-adoption-guide/)
- [Maven project and dependency guides](https://maven.apache.org/guides/)
- [JUnit Jupiter user guide](https://docs.junit.org/6.1.3/overview.html)
- [Spring REST service guide](https://spring.io/guides/gs/rest-service/)
- [Spring Data JPA guide](https://spring.io/guides/gs/accessing-data-jpa/)
- [Spring Boot testing reference](https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html)
- [Spring Boot Java compatibility](https://docs.spring.io/spring-boot/system-requirements.html)

</details>
