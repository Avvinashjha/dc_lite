# Executors, futures, and virtual threads

**Real-life problem:** A service makes several independent blocking lookups.

**You will learn:** Executors and task ownership; Futures and CompletableFuture; Virtual threads for blocking workloads; Bounded resources and structured lifetimes.

## Chapter 1: Executors and task ownership

An ExecutorService separates task submission from thread creation. Keep a clear owner responsible for closing it. A fixed pool limits worker concurrency but its default queue can still grow without bound. Design admission limits as well as thread limits.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
try(var executor = java.util.concurrent.Executors.newFixedThreadPool(2)) { var result = executor.submit(() -> 21 * 2); System.out.println(result.get()); }
```


<details>
<summary>Check the result and reasoning</summary>


```text
42
```


The executor owns workers and the caller owns its lifetime. Closing waits for completion under its contract. A fixed worker count does not make an unbounded submission queue safe under overload.

</details>

**Your turn:** Which additional bound can be necessary when requests arrive faster than tasks complete?

<details>
<summary>Check your reasoning</summary>

A bounded queue or admission/concurrency policy, with an explicit rejection or backpressure behavior.

</details>

## Chapter 2: Futures and CompletableFuture

A Future represents a pending result; get may block and can fail. CompletableFuture composes stages with explicit success and failure paths. Understand which executor runs asynchronous work. Cancellation, timeouts, and exception translation are part of the API, not afterthoughts.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
var value = java.util.concurrent.CompletableFuture.completedFuture(20).thenApply(n -> n + 1).thenApply(n -> n * 2);
System.out.println(value.join());
```


<details>
<summary>Check the result and reasoning</summary>


```text
42
```


Stages compose results without manually sharing a mutable accumulator. thenApply transforms a result; thenCompose flattens a transformation that already returns a future. Async stages need a deliberate executor and error path.

</details>

**Your turn:** How do join and get differ in their exception API?

<details>
<summary>Check your reasoning</summary>

get declares checked interruption and execution exceptions; join reports completion failures through unchecked CompletionException. Both may wait.

</details>

## Chapter 3: Virtual threads for blocking workloads

Virtual threads are lightweight Java threads useful for large numbers of tasks that spend time waiting. They do not make CPU-heavy work faster and do not enlarge a database connection pool. Use a virtual-thread-per-task executor rather than creating a pool of virtual threads.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
try(var executor = java.util.concurrent.Executors.newVirtualThreadPerTaskExecutor()) { var result = executor.submit(() -> Thread.currentThread().isVirtual()); System.out.println(result.get()); }
```


<details>
<summary>Check the result and reasoning</summary>


```text
true
```


One virtual thread represents one task. Virtual threads scale blocking workloads without making CPU execution itself faster. Avoid using them to disguise an exhausted connection pool or rate-limited downstream service.

</details>

**Your turn:** Should a scarce database connection pool be resized merely because tasks use virtual threads?

<details>
<summary>Check your reasoning</summary>

No. Size and bound database access from database capacity and workload measurements; lightweight waiting tasks do not create extra database capacity.

</details>

## Chapter 4: Bounded resources and structured lifetimes

Place a bound around scarce resources such as database connections and outbound calls. Keep child work within an explicit lifetime, close executors, and define what happens if one result fails. This course uses finalized APIs; preview concurrency APIs are discussed as optional reading and are not required for labs.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
var pending = new java.util.concurrent.CompletableFuture<String>();
try { pending.get(1,java.util.concurrent.TimeUnit.MILLISECONDS); } catch(java.util.concurrent.TimeoutException ex) { System.out.println("timeout"); }
pending.cancel(true);
System.out.println(pending.isCancelled());
```


<details>
<summary>Check the result and reasoning</summary>


```text
timeout
true
```


A timed wait bounds the caller’s wait, not the lifetime of arbitrary work elsewhere. Cancellation has implementation-specific cooperative behavior. CompletableFuture cancellation in particular does not interrupt an underlying task merely because true is passed.

</details>

**Your turn:** Why can closing an executor still take time after a timed get fails?

<details>
<summary>Check your reasoning</summary>

The task may continue or ignore interruption. Bound dependency operations and define ownership and shutdown for unfinished work.

</details>

## Predict and explore

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

:::learninglab
{
  "title": "Executors, futures, and virtual threads",
  "code": "try (var executor = java.util.concurrent.Executors.newVirtualThreadPerTaskExecutor()) {\n  var first = executor.submit(() -> \"stock\");\n  var second = executor.submit(() -> \"price\");\n  System.out.println(first.get() + \":\" + second.get());\n}",
  "output": "stock:price",
  "steps": [
    {
      "label": "Submit",
      "detail": "Two tasks receive independent virtual threads; execution order is unspecified."
    },
    {
      "label": "Collect",
      "detail": "get waits as needed; output order is determined by concatenation, not task completion order."
    },
    {
      "label": "Close",
      "detail": "The executor closes after its tasks finish."
    }
  ],
  "prediction": {
    "question": "What combined result is printed, regardless of task completion order?",
    "options": [
      "A randomly chosen order",
      "stockprice",
      "stock:price",
      "price:stock"
    ],
    "answer": 2,
    "explanation": "Two tasks receive independent virtual threads; execution order is unspecified. get waits as needed; output order is determined by concatenation, not task completion order. The executor closes after its tasks finish."
  }
}
:::

## Explain it back

Describe why the result follows from the code. Identify one assumption that would change the outcome, then test that change locally. For concurrent examples, distinguish the scheduling from guarantees established by the APIs.

Continue to the [practical lab](/courses/java-advanced/module-03-executors-and-virtual-threads/02-practice-lab). You can also revisit the [complete Java curriculum](/courses/java).

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
