# Decisions and loops

**Real-life problem:** A delivery service applies shipping rules.

**You will learn:** Conditions and short-circuit logic; if, else, and switch expressions; for, while, and enhanced for; Off-by-one errors and tracing.

## Chapter 1: Conditions and short-circuit logic

A branch encodes a rule: free shipping starts at a particular subtotal. Write boundary examples before the condition. && evaluates its right side only when the left side is true, which makes a null check followed by a method call safe when ordered correctly.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
String name = null;
System.out.println(name != null && !name.isBlank());
```


<details>
<summary>Check the result and reasoning</summary>


```text
false
```


The false left side settles the && result, so isBlank is not invoked on null. Reversing the operands would throw before the null check could protect the method call.

</details>

**Your turn:** Can & replace && safely here?

<details>
<summary>Check your reasoning</summary>

No. Boolean & evaluates both operands, so it would call isBlank on null.

</details>

## Chapter 2: if, else, and switch expressions

Use if for ranges and combinations of predicates. Use switch to map a finite set of values to outcomes. Arrow cases avoid accidental fall-through. A switch expression must produce a value for every possible input accepted by its type.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
String shipping = "express";
int fee = switch (shipping) { case "express" -> 100; case "standard" -> 50; default -> 0; };
System.out.println(fee);
```


<details>
<summary>Check the result and reasoning</summary>


```text
100
```


A switch expression yields a value. Arrow arms avoid implicit fall-through. For ranges such as subtotal >= 600, an if condition is usually clearer than a switch over every number.

</details>

**Your turn:** What would an unknown shipping name return? Is that a good business default?

<details>
<summary>Check your reasoning</summary>

It returns 0 in this sample. A real checkout should probably reject an unsupported policy rather than silently provide free shipping.

</details>

## Chapter 3: for, while, and enhanced for

Use a counted loop when the index matters, an enhanced for for values, and while when repetition depends on evolving state. State the invariant: what remains true before and after an iteration? This makes termination and correctness easier to inspect.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
int total = 0;
for (int i = 1; i <= 3; i++) total += i;
System.out.println(total);
```


<details>
<summary>Check the result and reasoning</summary>


```text
6
```


The loop starts at one, runs while i is at most three, and updates i after each body. Before each iteration, total contains the sum of the earlier integers.

</details>

**Your turn:** Change the loop to start at zero and use i < 3. What result follows?

<details>
<summary>Check your reasoning</summary>

3, because the body accumulates 0 + 1 + 2. The two conditions represent different ranges.

</details>

## Chapter 4: Off-by-one errors and tracing

For an array of length n, valid indexes are 0 through n - 1. Write a trace table with the index, current value, and accumulator. Test empty input, one item, and a value exactly at the shipping threshold. break exits a loop; continue skips the rest of its current iteration.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
for (int n : new int[]{1, 2, 3, 4}) {
  if (n == 2) continue;
  if (n == 4) break;
  System.out.println(n);
}
```


<details>
<summary>Check the result and reasoning</summary>


```text
1
3
```


continue skips printing 2. break exits before printing 4. A do-while loop, unlike while, executes the body at least once before checking its condition.

</details>

**Your turn:** How many times does a while(false) body run? What about do { ... } while(false)?

<details>
<summary>Check your reasoning</summary>

Zero and one. The location of the condition determines whether the first iteration can be skipped.

</details>

## Predict and explore

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

:::learninglab
{
  "title": "Decisions and loops",
  "code": "int[] orders = {400, 600, 1000};\nint free = 0;\nfor (int subtotal : orders) {\n  if (subtotal >= 600) free++;\n}\nSystem.out.println(free);",
  "output": "2",
  "steps": [
    {
      "label": "First order",
      "detail": "400 >= 600 is false; free = 0."
    },
    {
      "label": "Second order",
      "detail": "600 meets the boundary; free = 1."
    },
    {
      "label": "Third order",
      "detail": "1000 meets the boundary; free = 2."
    }
  ],
  "prediction": {
    "question": "How many orders does this loop count as eligible?",
    "options": [
      "3",
      "0",
      "2",
      "1"
    ],
    "answer": 2,
    "explanation": "400 >= 600 is false; free = 0. 600 meets the boundary; free = 1. 1000 meets the boundary; free = 2."
  }
}
:::

## Explain it back

Describe why the result follows from the code. Identify one assumption that would change the outcome, then test that change locally. For concurrent examples, distinguish the scheduling from guarantees established by the APIs.

Continue to the [practical lab](/courses/java-fundamentals/module-03-decisions-and-loops/02-practice-lab). You can also revisit the [complete Java curriculum](/courses/java).

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
