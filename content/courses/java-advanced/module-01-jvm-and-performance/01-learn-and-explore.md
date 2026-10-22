# JVM internals and performance

**Real-life problem:** Diagnose a service whose memory use grows over time.

**You will learn:** Loading, bytecode, and JIT compilation; Stacks, heap, reachability, and garbage collection; JFR, thread dumps, and heap evidence; Benchmarking and responsible optimization.

## Chapter 1: Loading, bytecode, and JIT compilation

Class loaders locate definitions and the JVM links and initializes classes before use. The interpreter and just-in-time compiler cooperate to execute bytecode. Warm-up affects measurements: a single timing from a cold process is not evidence of steady-state performance.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
System.out.println(String.class.getClassLoader() == null);
```


<details>
<summary>Check the result and reasoning</summary>


```text
true
```


Core classes such as String are loaded by the bootstrap loader, represented as null here. Application classes use other loaders. Verification, linking, initialization, interpretation, and JIT compilation are distinct parts of the lifecycle.

</details>

**Your turn:** Does compiling a .java file produce machine code for only your laptop?

<details>
<summary>Check your reasoning</summary>

Ordinary javac produces bytecode. A compatible JVM executes it and may compile hot paths to native code at runtime.

</details>

## Chapter 2: Stacks, heap, reachability, and garbage collection

Each thread has a call stack; objects are generally managed in the heap, though optimizations can change physical allocation. Garbage collection reclaims unreachable storage, not resources such as sockets on a useful schedule. A growing cache that still retains objects can cause a memory leak even with a garbage collector.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
var retained = new java.util.ArrayList<byte[]>();
retained.add(new byte[1024]);
var alias = retained;
retained.clear();
System.out.println(alias.size());
```


<details>
<summary>Check the result and reasoning</summary>


```text
0
```


Both variables refer to one list; clear removes its element references. Objects can become collectible when no roots reach them, but collection timing and process-memory return are separate questions. Local references and JIT escape analysis complicate simplistic stack-versus-heap diagrams.

</details>

**Your turn:** Would assigning retained = null clear the list also referenced by alias?

<details>
<summary>Check your reasoning</summary>

No. It changes one reference binding. The alias still retains the list and its contents.

</details>

## Chapter 3: JFR, thread dumps, and heap evidence

Use Java Flight Recorder to inspect allocation, CPU, locks, and latency with context. Thread dumps reveal blocked and waiting threads; heap evidence reveals retention. Begin with a reproducible symptom and compare before and after under the same workload. Do not guess a collector setting before identifying the bottleneck.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
try(var recording = new jdk.jfr.Recording()) { recording.start(); System.out.println(recording.getState()); recording.stop(); }
```


<details>
<summary>Check the result and reasoning</summary>


```text
RUNNING
```


A recording collects selected runtime events; it is not a heap dump. Use jcmd <pid> JFR.start settings=profile duration=30s filename=lab.jfr for a live process. Thread.print helps investigate blocked threads; heap histograms and dumps require an appropriate diagnostic plan.

</details>

**Your turn:** What context should accompany a performance recording?

<details>
<summary>Check your reasoning</summary>

The workload, duration, JDK, configuration, symptom, and comparison run. A recording without a reproducible scenario is difficult to interpret.

</details>

## Chapter 4: Benchmarking and responsible optimization

Use JMH for isolated microbenchmarks rather than handwritten nanoTime loops. Account for warm-up, dead-code elimination, and realistic inputs. Optimize the slow path that measurements identify, and rerun behavior tests after a performance change. Native memory and process memory are not identical to live Java heap size.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
long sum(int[] values) { long total = 0; for(int value : values) total += value; return total; }
System.out.println(sum(new int[]{1,2,3}));
```


<details>
<summary>Check the result and reasoning</summary>


```text
6
```


Returning and consuming a result is necessary for meaningful benchmark work. This snippet verifies behavior, not performance. JMH adds warm-up, repeated measurement, forks, and safeguards against common JVM optimization traps.

</details>

**Your turn:** Why is an unused loop timed once with nanoTime weak evidence?

<details>
<summary>Check your reasoning</summary>

Dead-code elimination, constant folding, warm-up, timer noise, and an unrealistic input can dominate. First establish behavior, then benchmark the real question with a suitable harness.

</details>

## Predict and explore

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

:::learninglab
{
  "title": "JVM internals and performance",
  "code": "var cache = new java.util.HashMap<Integer, byte[]>();\nfor (int id = 0; id < 3; id++) cache.put(id, new byte[1024]);\nSystem.out.println(cache.size());\ncache.clear();\nSystem.out.println(cache.size());",
  "output": "3\n0",
  "steps": [
    {
      "label": "Retain",
      "detail": "The map references three arrays. They remain reachable through cache."
    },
    {
      "label": "Clear",
      "detail": "clear removes those map references."
    },
    {
      "label": "Eligibility",
      "detail": "Unreferenced arrays may become eligible for collection; no collection time is promised."
    }
  ],
  "prediction": {
    "question": "What two map sizes are printed before and after clear?",
    "options": [
      "3\n0",
      "3\n3",
      "0\n0",
      "1\n0"
    ],
    "answer": 0,
    "explanation": "The map references three arrays. They remain reachable through cache. clear removes those map references. Unreferenced arrays may become eligible for collection; no collection time is promised."
  }
}
:::

## Explain it back

Describe why the result follows from the code. Identify one assumption that would change the outcome, then test that change locally. For concurrent examples, distinguish the scheduling from guarantees established by the APIs.

Continue to the [practical lab](/courses/java-advanced/module-01-jvm-and-performance/02-practice-lab). You can also revisit the [complete Java curriculum](/courses/java).

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
