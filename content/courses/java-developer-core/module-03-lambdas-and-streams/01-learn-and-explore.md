# Lambdas, streams, and Optional

**Real-life problem:** A shop computes revenue from paid orders.

**You will learn:** Functional interfaces and lambdas; Lazy pipelines and terminal operations; Reduction, collection, and parallel pitfalls; Optional and explicit absence.

## Chapter 1: Functional interfaces and lambdas

A functional interface has one abstract method. Predicate tests a value, Function transforms it, Consumer performs an action, and Supplier supplies a value. A lambda captures local variables only when they are final or effectively final; captured references can still point to mutable objects.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
java.util.function.Predicate<String> longName = text -> text.length() > 3;
java.util.function.Function<String,Integer> length = String::length;
System.out.println(longName.test("Maya") + ":" + length.apply("Maya"));
```


<details>
<summary>Check the result and reasoning</summary>


```text
true:4
```


Predicate answers a condition; Function maps one value to another. Consumer accepts a value for an action, and Supplier produces one. Method references reuse a method through a compatible functional interface.

</details>

**Your turn:** Can a captured local int be reassigned after the lambda is defined?

<details>
<summary>Check your reasoning</summary>

No. It must remain final or effectively final. This restriction applies to the local binding; the referenced object may still be mutable.

</details>

## Chapter 2: Lazy pipelines and terminal operations

A stream describes a traversal, not a container. filter keeps matching values; map transforms them. Intermediate operations are lazy until a terminal operation requests a result. Streams are consumed once. Prefer readable pipelines to deeply nested lambdas.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
long count = java.util.List.of(1,2,3).stream().filter(n -> n > 1).count();
System.out.println(count);
```


<details>
<summary>Check the result and reasoning</summary>


```text
2
```


The terminal count triggers traversal and filter selects two values. A stream cannot be reused after a terminal operation. Do not rely on side effects in intermediate operations, which implementations may optimize when results do not depend on them.

</details>

**Your turn:** What happens if you construct a filter pipeline and never request a terminal result?

<details>
<summary>Check your reasoning</summary>

Its elements are not traversed merely because the pipeline was declared.

</details>

## Chapter 3: Reduction, collection, and parallel pitfalls

Use reductions for associative combinations and collectors for grouped results. Avoid shared mutable accumulators in forEach, especially with parallel streams. Parallel execution adds coordination and is not automatically faster; encounter order, blocking, and workload size all matter.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
var grouped = java.util.List.of("tea","coffee","tea").stream().collect(java.util.stream.Collectors.groupingBy(java.util.function.Function.identity(), java.util.TreeMap::new, java.util.stream.Collectors.counting()));
System.out.println(grouped);
```


<details>
<summary>Check the result and reasoning</summary>


```text
{coffee=1, tea=2}
```


The collector groups by value and counts each group. A TreeMap makes printed order deterministic. toMap needs an explicit merge policy when duplicate keys are possible; a shared mutable forEach accumulator is often the wrong parallel design.

</details>

**Your turn:** Why must a reduction combining partial results be associative?

<details>
<summary>Check your reasoning</summary>

Parallel or regrouped execution can change grouping. A non-associative operation can produce different results under another grouping or encounter order.

</details>

## Chapter 4: Optional and explicit absence

Optional models a potentially absent return value. Use map, flatMap, or orElseGet to compose a result without unchecked get calls. orElse evaluates its argument eagerly. Optional does not replace every null field, and the Optional reference itself should not be null.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
String fallback() { System.out.println("fallback evaluated"); return "guest"; }
System.out.println(java.util.Optional.of("Ada").orElse(fallback()));
System.out.println(java.util.Optional.of("Ada").orElseGet(() -> fallback()));
```


<details>
<summary>Check the result and reasoning</summary>


```text
fallback evaluated
Ada
Ada
```


orElse evaluates its argument before the call, even when a value is present. orElseGet defers work inside a supplier. map transforms a present value; flatMap avoids nesting when the transformation already returns Optional.

</details>

**Your turn:** Should a method returning Optional ever return null to mean empty?

<details>
<summary>Check your reasoning</summary>

No. Return Optional.empty(), so the declared absence contract stays useful to the caller.

</details>

## Predict and explore

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

:::learninglab
{
  "title": "Lambdas, streams, and Optional",
  "code": "record Order(int total, boolean paid) {}\nvar orders = java.util.List.of(new Order(100, true), new Order(200, false), new Order(50, true));\nint revenue = orders.stream()\n  .filter(Order::paid)\n  .mapToInt(Order::total)\n  .sum();\nSystem.out.println(revenue);",
  "output": "150",
  "steps": [
    {
      "label": "Filter",
      "detail": "Keep the paid orders of 100 and 50."
    },
    {
      "label": "Map",
      "detail": "Extract their integer totals."
    },
    {
      "label": "Reduce",
      "detail": "sum is the terminal operation and yields 150."
    }
  ],
  "prediction": {
    "question": "What revenue does the paid-order pipeline print?",
    "options": [
      "200",
      "100",
      "150",
      "350"
    ],
    "answer": 2,
    "explanation": "Keep the paid orders of 100 and 50. Extract their integer totals. sum is the terminal operation and yields 150."
  }
}
:::

## Explain it back

Describe why the result follows from the code. Identify one assumption that would change the outcome, then test that change locally. For concurrent examples, distinguish the scheduling from guarantees established by the APIs.

Continue to the [practical lab](/courses/java-developer-core/module-03-lambdas-and-streams/02-practice-lab). You can also revisit the [complete Java curriculum](/courses/java).

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
