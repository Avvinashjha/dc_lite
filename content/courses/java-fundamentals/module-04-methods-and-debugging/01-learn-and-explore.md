# Methods and debugging

**Real-life problem:** A restaurant reuses a tip calculator.

**You will learn:** Method signatures, parameters, and return values; Scope, the call stack, and pass-by-value; Overloading and decomposition; Breakpoints and reading failures.

## Chapter 1: Method signatures, parameters, and return values

A method names a focused operation. Parameters make its inputs explicit; the return type describes its result. Prefer a calculation that returns a value over one that prints internally, so the same logic can be reused in a terminal, an API, and a test.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
int square(int value) { return value * value; }
System.out.println(square(4));
```


<details>
<summary>Check the result and reasoning</summary>


```text
16
```


The parameter is local to one invocation, and return sends the calculated value to the caller. A void method performs an action without returning a value. Small pure calculations are easy to exercise with many inputs.

</details>

**Your turn:** What input would expose overflow in this int-based square method?

<details>
<summary>Check your reasoning</summary>

A value such as 50000. Use a long result with multiplication widened before it happens, or Math.multiplyExact when overflow must be rejected.

</details>

## Chapter 2: Scope, the call stack, and pass-by-value

Each invocation has its own local variables. Java always passes values: primitive values are copied, and object reference values are copied too. A method can mutate a shared object through that copied reference, but assigning its parameter to another object does not replace the caller’s variable.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
void replace(int[] numbers) { numbers = new int[]{99}; }
void mutate(int[] numbers) { numbers[0] = 7; }
int[] original = {1};
replace(original);
mutate(original);
System.out.println(original[0]);
```


<details>
<summary>Check the result and reasoning</summary>


```text
7
```


Both calls copy the array reference. replace changes only its local parameter. mutate uses its copied reference to change the object also reachable by the caller.

</details>

**Your turn:** Would making the parameter final prevent mutate from assigning numbers[0]?

<details>
<summary>Check your reasoning</summary>

No. It prevents reassigning the parameter itself, but does not freeze the array elements.

</details>

## Chapter 3: Overloading and decomposition

Overloads share a name but differ in parameter types or counts. Return type alone cannot distinguish them. Break a large feature into validation, calculation, and presentation so each method has a clear contract and a manageable set of cases.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
int sum(int... values) { int total = 0; for (int value : values) total += value; return total; }
System.out.println(sum(2, 3, 4));
```


<details>
<summary>Check the result and reasoning</summary>


```text
9
```


A varargs parameter receives an array and must be the final parameter in its method declaration. Overloading is resolved from argument types at compile time; changing only a return type does not define another overload.

</details>

**Your turn:** What does sum() return with no arguments?

<details>
<summary>Check your reasoning</summary>

0, because the method receives an empty array and the loop executes zero times.

</details>

## Chapter 4: Breakpoints and reading failures

Set a breakpoint before the surprising calculation. Step into a method to inspect its inputs; step over when its implementation is already trusted. Read stack traces from the exception toward the first relevant application frame. Reproduce a bug with a small input before attempting a fix.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
int divide(int a, int b) { return a / b; }
try { divide(10, 0); } catch (ArithmeticException ex) { System.out.println("zero divisor"); }
```


<details>
<summary>Check the result and reasoning</summary>


```text
zero divisor
```


Set a breakpoint before division and inspect b. The most useful application stack frame identifies the failing call, but a catch may be higher up at a boundary that can recover.

</details>

**Your turn:** Should you change every division in the application after this one report?

<details>
<summary>Check your reasoning</summary>

First reproduce the smallest failing case and decide the intended zero-input contract. Repair the specific boundary and add a regression test.

</details>

## Predict and explore

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

:::learninglab
{
  "title": "Methods and debugging",
  "code": "int tip(int bill, int percent) {\n  return bill * percent / 100;\n}\nint bill = 800;\nint result = tip(bill, 10);\nSystem.out.println(result);\nSystem.out.println(bill);",
  "output": "80\n800",
  "steps": [
    {
      "label": "Call tip",
      "detail": "Copies 800 and 10 into the method parameters."
    },
    {
      "label": "Calculate",
      "detail": "800 * 10 / 100 produces 80."
    },
    {
      "label": "Return",
      "detail": "result becomes 80; caller bill remains 800."
    }
  ],
  "prediction": {
    "question": "What are the two printed values after tip returns?",
    "options": [
      "800\n800",
      "80\n800",
      "80\n80",
      "800\n80"
    ],
    "answer": 1,
    "explanation": "Copies 800 and 10 into the method parameters. 800 * 10 / 100 produces 80. result becomes 80; caller bill remains 800."
  }
}
:::

## Explain it back

Describe why the result follows from the code. Identify one assumption that would change the outcome, then test that change locally. For concurrent examples, distinguish the scheduling from guarantees established by the APIs.

Continue to the [practical lab](/courses/java-fundamentals/module-04-methods-and-debugging/02-practice-lab). You can also revisit the [complete Java curriculum](/courses/java).

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
