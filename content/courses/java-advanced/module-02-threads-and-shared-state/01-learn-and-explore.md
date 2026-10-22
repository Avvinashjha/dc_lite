# Threads, visibility, and shared state

**Real-life problem:** Prevent lost updates when two workers count orders.

**You will learn:** Thread lifecycle and shared data; Races, visibility, and happens-before; Locks, atomics, and concurrent collections; Deadlocks and cancellation.

## Chapter 1: Thread lifecycle and shared data

Starting a thread schedules work independently; calling run directly is an ordinary method call. join waits for completion. Identify which values are shared before adding threads: immutable values and confined state often remove the need for coordination entirely.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
var result = new java.util.concurrent.atomic.AtomicInteger();
Thread worker = new Thread(() -> result.set(7));
worker.start(); worker.join();
System.out.println(result.get());
```


<details>
<summary>Check the result and reasoning</summary>


```text
7
```


start schedules the worker, while join waits for termination. The final read occurs after successful completion. Directly invoking run would not create an independent thread.

</details>

**Your turn:** Would a sleep in the caller replace the completion guarantee of join?

<details>
<summary>Check your reasoning</summary>

No. Sleep guesses at timing; join expresses the required lifecycle relationship.

</details>

## Chapter 2: Races, visibility, and happens-before

A read-modify-write such as count++ is not a single atomic operation. volatile provides visibility and ordering guarantees for its field, but does not make a compound increment atomic. Use the Java Memory Model’s happens-before relationships rather than assumptions about what a CPU probably does.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
class Published { int value; volatile boolean ready; void publish() { value = 42; ready = true; } }
var state = new Published();
Thread writer = new Thread(state::publish); writer.start(); writer.join();
System.out.println(state.ready + ":" + state.value);
```


<details>
<summary>Check the result and reasoning</summary>


```text
true:42
```


The volatile write can publish earlier writes to a reader that observes that value; join also supplies a completion relationship in this small example. This does not make unrelated multi-step updates atomic.

</details>

**Your turn:** Why is volatile count++ still unsafe with several writers?

<details>
<summary>Check your reasoning</summary>

Each increment performs a read, calculation, and write. Visibility of each field access does not prevent two writers from losing an update.

</details>

## Chapter 3: Locks, atomics, and concurrent collections

synchronized protects a critical section and establishes visibility through matching monitor operations. AtomicInteger provides atomic single-variable updates. ConcurrentHashMap supports concurrent access, but a check followed by a separate update is still a compound action; use an appropriate atomic method.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
var counts = new java.util.concurrent.ConcurrentHashMap<String,Integer>();
counts.merge("tea",1,Integer::sum);
counts.merge("tea",1,Integer::sum);
System.out.println(counts.get("tea"));
```


<details>
<summary>Check the result and reasoning</summary>


```text
2
```


merge performs the key update through the collection’s atomic contract. A separate get followed by put can race even when each individual collection call is thread-safe. Atomics solve single-variable coordination, while locks can protect a larger invariant.

</details>

**Your turn:** When would AtomicInteger not be enough for a transfer between two balances?

<details>
<summary>Check your reasoning</summary>

When both balances and related checks must change as one invariant. Use a deliberate common lock or transaction boundary rather than independent atomic field updates.

</details>

## Chapter 4: Deadlocks and cancellation

A deadlock can occur when threads wait on locks held by one another. Prefer consistent lock ordering and bounded waits where suitable. Interruption is cooperative cancellation; propagate it or restore the flag when translating. Thread safety needs an explicit state and locking policy, not scattered synchronized keywords.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
var observed = new java.util.concurrent.atomic.AtomicBoolean();
Thread task = new Thread(() -> { Thread.currentThread().interrupt(); observed.set(Thread.interrupted()); });
task.start(); task.join();
System.out.println(observed.get());
```


<details>
<summary>Check the result and reasoning</summary>


```text
true
```


Thread.interrupted checks and clears the current thread’s flag. isInterrupted checks a flag without clearing it. Blocking methods can throw InterruptedException, so callers must propagate or restore cancellation instead of silently continuing.

</details>

**Your turn:** How can two-lock code avoid one common deadlock pattern?

<details>
<summary>Check your reasoning</summary>

Acquire the locks in a consistent global order and keep critical sections focused. Do not hold one resource while waiting indefinitely for another without a lifecycle policy.

</details>

## Predict and explore

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

:::learninglab
{
  "title": "Threads, visibility, and shared state",
  "code": "var count = new java.util.concurrent.atomic.AtomicInteger();\nThread first = new Thread(() -> { for (int i = 0; i < 1000; i++) count.incrementAndGet(); });\nThread second = new Thread(() -> { for (int i = 0; i < 1000; i++) count.incrementAndGet(); });\nfirst.start(); second.start();\nfirst.join(); second.join();\nSystem.out.println(count.get());",
  "output": "2000",
  "steps": [
    {
      "label": "Start",
      "detail": "Two workers each perform 1000 updates; their scheduling is unspecified."
    },
    {
      "label": "Coordinate",
      "detail": "Each incrementAndGet is atomic, preventing lost increments."
    },
    {
      "label": "Join",
      "detail": "After both joins, all 2000 increments have completed."
    }
  ],
  "prediction": {
    "question": "After both joined workers complete, what count is guaranteed?",
    "options": [
      "1000",
      "An arbitrary value below 2000",
      "The code cannot compile because AtomicInteger is mutable",
      "2000"
    ],
    "answer": 3,
    "explanation": "Two workers each perform 1000 updates; their scheduling is unspecified. Each incrementAndGet is atomic, preventing lost increments. After both joins, all 2000 increments have completed."
  }
}
:::

## Explain it back

Describe why the result follows from the code. Identify one assumption that would change the outcome, then test that change locally. For concurrent examples, distinguish the scheduling from guarantees established by the APIs.

Continue to the [practical lab](/courses/java-advanced/module-02-threads-and-shared-state/02-practice-lab). You can also revisit the [complete Java curriculum](/courses/java).

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
