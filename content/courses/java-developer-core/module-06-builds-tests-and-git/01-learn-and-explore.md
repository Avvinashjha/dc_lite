# Builds, unit tests, and Git

**Real-life problem:** A team makes the expense tracker reproducible.

**You will learn:** Project layout and dependency management; JUnit Jupiter and behavior tests; Parameterized tests and test doubles; Git and a continuous feedback loop.

## Chapter 1: Project layout and dependency management

Use a standard Maven layout: src/main/java for production and src/test/java for tests. A pom declares the Java release and dependencies. Commit the Maven wrapper so teammates use a reproducible tool version; distinguish production dependencies from test-only dependencies.

**Follow the working project:** The root parent pins build behavior and Java 25. Module source is under src/main/java; test code is under src/test/java. The wrapper pins Maven independently of whichever mvn is installed globally.

File in the [reference-project download](/downloads/java-course-labs.zip): `fundamentals/pom.xml`. Follow its README to build and run it.

<details>
<summary>Read the complete example source</summary>


```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion><parent><groupId>in.dailycoder</groupId><artifactId>java-course-labs</artifactId><version>1.0.0</version></parent>
  <artifactId>fundamentals</artifactId>
  <dependencies><dependency><groupId>org.junit.jupiter</groupId><artifactId>junit-jupiter</artifactId><scope>test</scope></dependency></dependencies>
</project>
```


</details>

**Observe:** The module declares its JUnit dependency with test scope.

**Your turn:** Run the fundamentals tests from the archive root. Which command should you use?

<details>
<summary>Check your reasoning</summary>

./mvnw -pl fundamentals test. The first run downloads the pinned Maven distribution and dependencies.

</details>

## Chapter 2: JUnit Jupiter and behavior tests

A useful test arranges inputs, invokes behavior, and asserts an observable result. Cover normal behavior and meaningful boundaries. Use assertThrows for a documented rejection. Prefer checking a contract over checking private implementation details that change during a refactor.

**Follow the working project:** These tests assert observable behavior: totals, immutable returned lists, recoverable input, and a large aggregate. They do not require the implementation to keep a particular private field name.

File in the [reference-project download](/downloads/java-course-labs.zip): `fundamentals/src/test/java/in/dailycoder/basics/ExpenseTrackerTest.java`. Follow its README to build and run it.

<details>
<summary>Read the complete example source</summary>


```java
package in.dailycoder.basics;

import org.junit.jupiter.api.Test;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Scanner;
import static org.junit.jupiter.api.Assertions.*;

class ExpenseTrackerTest {
    @Test void totalsValidExpensesAndProtectsItsCollection() {
        var ledger = new ExpenseTracker.Ledger();
        assertEquals(0, ledger.total());
        ledger.add("Food", 1250); ledger.add("Bus", 300);
        assertEquals(1550, ledger.total());
        assertThrows(UnsupportedOperationException.class, () -> ledger.list().clear());
        assertThrows(IllegalArgumentException.class, () -> ledger.add("Food", -1));
        assertEquals(1550, ledger.total());
    }
    @Test void recoversFromBadCommandsWithoutLosingValidExpenses() {
        var buffer = new StringWriter();
        ExpenseTracker.run(new Scanner("add Food 1250\nadd Bus 300\nadd Wrong nope\nadd Refund -5\nadd Morning tea 100\nlist\ntotal\nexit\nadd Ignored 20\n"), new PrintWriter(buffer));
        String text = buffer.toString();
        assertTrue(text.contains("Food: 1250"));
        assertTrue(text.contains("Bus: 300"));
        assertTrue(text.contains("Morning tea: 100"));
        assertTrue(text.contains("Total: 1650"));
        assertTrue(text.contains("Error:"));
        assertFalse(text.contains("Ignored"));
    }
    @Test void usesLongForAnAggregateOfValidIntAmounts() {
        var ledger = new ExpenseTracker.Ledger();
        ledger.add("A", Integer.MAX_VALUE); ledger.add("B", Integer.MAX_VALUE);
        assertEquals(4294967294L, ledger.total());
    }
}
```


</details>

**Observe:** A bad command is rejected while valid expenses remain in the ledger.

**Your turn:** Which existing test would fail if list() returned the mutable internal list?

<details>
<summary>Check your reasoning</summary>

The assertion that clear throws UnsupportedOperationException. The contract protects the ledger from mutation through a returned collection.

</details>

## Chapter 3: Parameterized tests and test doubles

Parameterized tests exercise one behavior across a table of cases. Use a fake or stub for an external boundary when it makes the unit deterministic. Do not mock simple values or every collaborator; too much mocking can test only the arrangement of mocks.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
record Case(int price, int percent, int expected) {}
for (var c : java.util.List.of(new Case(1000,0,1000),new Case(1000,100,0))) System.out.println(c.price()-c.price()*c.percent()/100 == c.expected());
```


<details>
<summary>Check the result and reasoning</summary>


```text
true
true
```


A table of cases can become a JUnit parameterized test. A fake exchange-rate collaborator tests conversion logic without internet access. Mocking every simple value is not necessary for determinism.

</details>

**Your turn:** Which additional discount cases are important?

<details>
<summary>Check your reasoning</summary>

A representative percentage, negative input, and a percentage above 100. Write the intended rejection behavior explicitly.

</details>

## Chapter 4: Git and a continuous feedback loop

Commit coherent changes, review diffs before committing, and keep secrets out of version control. Run tests before opening a review. A CI job should use the declared JDK and wrapper, then test from a clean checkout. Gradle is a valid alternative; this path uses Maven consistently.

**Follow the working project:** Maven lifecycle phases build on earlier phases. Git stages changes separately from the working tree: inspect git diff and git diff --cached before committing. CI must test a clean checkout with the same JDK and wrapper.

File in the [reference-project download](/downloads/java-course-labs.zip): `verify.sh`. Follow its README to build and run it.

<details>
<summary>Read the complete example source</summary>


```bash
#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"
if [ -n "${JAVA_HOME:-}" ]; then PATH="$JAVA_HOME/bin:$PATH"; export PATH; fi
(unset TEST_DB_URL TEST_DB_USER TEST_DB_PASSWORD; ./mvnw "$@" --batch-mode verify)
if [ -n "${TEST_DB_URL:-}" ]; then
  ./mvnw "$@" --batch-mode -pl backend test
fi
mkdir -p modules/target/classes
javac -d modules/target/classes modules/hello/module-info.java modules/hello/in/dailycoder/hello/Main.java
java --module-path modules/target/classes --module course.hello/in.dailycoder.hello.Main
runtime_root=$(mktemp -d)
trap 'rm -rf "$runtime_root"' EXIT HUP INT TERM
jlink --module-path modules/target/classes --add-modules course.hello --output "$runtime_root/image"
"$runtime_root/image/bin/java" --module course.hello/in.dailycoder.hello.Main
```


</details>

**Observe:** The same verification commands run from a clean checkout.

**Your turn:** Should target/ directories and local database files be committed?

<details>
<summary>Check your reasoning</summary>

No. Commit source, tests, migrations, wrapper, and build configuration. Keep generated artifacts, secrets, and machine-specific data out of version control.

</details>

## Predict and explore

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

:::learninglab
{
  "title": "Builds, unit tests, and Git",
  "code": "int discounted(int price, int percent) {\n  if (price < 0 || percent < 0 || percent > 100)\n    throw new IllegalArgumentException(\"Invalid discount\");\n  return price - price * percent / 100;\n}\nSystem.out.println(discounted(1000, 20));",
  "output": "800",
  "steps": [
    {
      "label": "Validate",
      "detail": "1000 and 20 satisfy the domain bounds."
    },
    {
      "label": "Calculate",
      "detail": "The discount is 200, leaving 800."
    },
    {
      "label": "Test boundary",
      "detail": "A percentage of 101 must be rejected rather than creating a negative price."
    }
  ],
  "prediction": {
    "question": "What price does discounted(1000, 20) print?",
    "options": [
      "200",
      "1000",
      "1200",
      "800"
    ],
    "answer": 3,
    "explanation": "1000 and 20 satisfy the domain bounds. The discount is 200, leaving 800. A percentage of 101 must be rejected rather than creating a negative price."
  }
}
:::

## Explain it back

Describe why the result follows from the code. Identify one assumption that would change the outcome, then test that change locally. For concurrent examples, distinguish the scheduling from guarantees established by the APIs.

Continue to the [practical lab](/courses/java-developer-core/module-06-builds-tests-and-git/02-practice-lab). You can also revisit the [complete Java curriculum](/courses/java).

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
