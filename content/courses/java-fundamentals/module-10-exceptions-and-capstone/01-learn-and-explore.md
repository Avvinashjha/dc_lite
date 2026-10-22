# Exceptions and the fundamentals capstone

**Real-life problem:** Build a resilient command-line expense tracker.

**You will learn:** Failures, exceptions, and recovery; Checked and unchecked exceptions; try-with-resources and cleanup; Capstone: model, validate, and report expenses.

## Chapter 1: Failures, exceptions, and recovery

An exception signals an operation that could not complete normally. Catch only where you can recover or translate meaningfully. Reject bad input at the boundary, and preserve the original cause when wrapping an exception. Swallowing failures produces misleading success.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
int amount(String value) { try { return Integer.parseInt(value); } catch (NumberFormatException cause) { throw new IllegalArgumentException("Invalid amount", cause); } }
try { amount("oops"); } catch (IllegalArgumentException ex) { System.out.println(ex.getCause().getClass().getSimpleName()); }
```


<details>
<summary>Check the result and reasoning</summary>


```text
NumberFormatException
```


The API translates a parsing detail into a useful boundary error while preserving the cause. A custom domain exception is appropriate when callers need to distinguish a particular recoverable failure.

</details>

**Your turn:** Why is throwing new RuntimeException("failed") without the cause less useful?

<details>
<summary>Check your reasoning</summary>

It loses the original diagnostic chain. Preserve cause and context without including secrets in the message.

</details>

## Chapter 2: Checked and unchecked exceptions

The compiler requires checked exceptions to be caught or declared. RuntimeException subclasses are unchecked. This distinction is about the API contract, not whether an error matters. Use IllegalArgumentException for invalid caller input and domain-specific exceptions when callers need a meaningful recovery choice.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
boolean checked = Exception.class.isAssignableFrom(java.io.IOException.class) && !RuntimeException.class.isAssignableFrom(java.io.IOException.class);
System.out.println(checked);
```


<details>
<summary>Check the result and reasoning</summary>


```text
true
```


IOException is checked and requires a catch or throws declaration. RuntimeException subclasses are unchecked. Errors such as OutOfMemoryError are a different hierarchy and generally do not belong in ordinary input-recovery catches.

</details>

**Your turn:** Is every important failure a checked exception?

<details>
<summary>Check your reasoning</summary>

No. Checkedness is an API design and compiler rule, not a ranking of severity. Do not catch Throwable just to make every failure look like valid input.

</details>

## Chapter 3: try-with-resources and cleanup

Resources such as readers and JDBC connections must be closed. try-with-resources closes AutoCloseable resources in reverse declaration order, including exceptional paths. finally is useful for cleanup but should not return a value that hides the original failure.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
class Resource implements AutoCloseable { public void close() { System.out.println("closed"); } }
try (var resource = new Resource()) { System.out.println("work"); }
```


<details>
<summary>Check the result and reasoning</summary>


```text
work
closed
```


try-with-resources closes resources deterministically. If the body and close both fail, the body failure remains primary and close failures are suppressed. Garbage collection is not a useful resource-release schedule.

</details>

**Your turn:** With two resources declared left to right, which closes first?

<details>
<summary>Check your reasoning</summary>

The second resource closes first. Do not return from finally because it can suppress an earlier return or failure.

</details>

## Chapter 4: Capstone: model, validate, and report expenses

Create an Expense record with a label and positive amount in minor units. Keep an in-memory collection, accept add/list/total/exit commands, and separate parsing from business methods. This first capstone needs no database; persistence arrives in the developer core course.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
record Item(String label, int paise) {}
var values = java.util.List.of(new Item("Food",1250), new Item("Bus",300));
long total = values.stream().mapToLong(Item::paise).sum();
System.out.println(total);
```


<details>
<summary>Check the result and reasoning</summary>


```text
1550
```


The capstone separates input handling, a validated model, storage, and reporting. Summing in long avoids overflowing when several individually valid int amounts are combined.

</details>

**Your turn:** What evidence should demonstrate the finished capstone?

<details>
<summary>Check your reasoning</summary>

Run the provided command transcript, show recovery from negative and nonnumeric amounts, verify total and list, and explain why callers cannot mutate the ledger through its returned list.

</details>

## Predict and explore

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

:::learninglab
{
  "title": "Exceptions and the fundamentals capstone",
  "code": "int parseAmount(String text) {\n  int amount = Integer.parseInt(text);\n  if (amount <= 0) throw new IllegalArgumentException(\"Amount must be positive\");\n  return amount;\n}\ntry {\n  System.out.println(parseAmount(\"-10\"));\n} catch (IllegalArgumentException ex) {\n  System.out.println(ex.getMessage());\n}",
  "output": "Amount must be positive",
  "steps": [
    {
      "label": "Parse",
      "detail": "-10 is syntactically a valid integer."
    },
    {
      "label": "Validate",
      "detail": "The positive-amount rule rejects -10."
    },
    {
      "label": "Recover",
      "detail": "The catch prints the message; no invalid expense is saved."
    }
  ],
  "prediction": {
    "question": "What is printed when this positive-amount parser receives \"-10\"?",
    "options": [
      "-10",
      "NumberFormatException",
      "The program silently stores -10",
      "Amount must be positive"
    ],
    "answer": 3,
    "explanation": "-10 is syntactically a valid integer. The positive-amount rule rejects -10. The catch prints the message; no invalid expense is saved."
  }
}
:::

## Explain it back

Describe why the result follows from the code. Identify one assumption that would change the outcome, then test that change locally. For concurrent examples, distinguish the scheduling from guarantees established by the APIs.

Continue to the [practical lab](/courses/java-fundamentals/module-10-exceptions-and-capstone/02-practice-lab). You can also revisit the [complete Java curriculum](/courses/java).

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
