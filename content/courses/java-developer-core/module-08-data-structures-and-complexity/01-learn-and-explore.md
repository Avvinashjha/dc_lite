# Data structures and algorithmic thinking

**Real-life problem:** A support queue needs fast lookups and prioritized work.

**You will learn:** Lists, stacks, queues, and heaps; Big O and space tradeoffs; Sorting, binary search, and recursion; Graphs and deliberate interview practice.

## Chapter 1: Lists, stacks, queues, and heaps

Match access patterns to structures. ArrayDeque is a practical stack or queue when null elements are unnecessary. PriorityQueue exposes the least element according to its ordering at the head; iterating it does not produce a sorted sequence. State tie-breaking rules for equal priorities.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
var stack = new java.util.ArrayDeque<String>();
stack.push("first"); stack.push("second");
System.out.println(stack.pop());
```


<details>
<summary>Check the result and reasoning</summary>


```text
second
```


A stack is last-in, first-out; a queue is first-in, first-out. A heap provides priority access. A linked list is not automatically faster than an array-backed list just because insertions are theoretically cheap when the node is already known.

</details>

**Your turn:** Which structure fits repeatedly taking the highest-priority job?

<details>
<summary>Check your reasoning</summary>

A PriorityQueue with a comparator that defines the desired head and tie-breaker, rather than repeatedly sorting the entire collection.

</details>

## Chapter 2: Big O and space tradeoffs

A hash-based lookup is expected O(1), while a linear scan is O(n). Extra memory can avoid repeated scans. These models simplify constant costs and distribution assumptions, so validate real bottlenecks with measurements. Space complexity counts auxiliary storage as well as the input representation when relevant.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
var seen = new java.util.HashSet<Integer>();
int duplicates = 0;
for (int value : new int[]{3,1,3,2,1}) if (!seen.add(value)) duplicates++;
System.out.println(duplicates);
```


<details>
<summary>Check the result and reasoning</summary>


```text
2
```


A set trades O(n) auxiliary space for an expected linear traversal. A nested comparison loop can avoid that set but do O(n²) work. Big O compares growth, not a precise wall-clock guarantee.

</details>

**Your turn:** Would this count duplicate pairs or repeated occurrences after the first?

<details>
<summary>Check your reasoning</summary>

Repeated occurrences after the first. State the counting definition before choosing an algorithm.

</details>

## Chapter 3: Sorting, binary search, and recursion

Binary search requires sorted data under the same ordering used for the search. Recursion needs a base case and progress toward it; deep recursion can overflow the stack. Compare a recursive formulation with an iterative alternative when input depth is unbounded.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
int factorial(int n) { if(n < 0 || n > 12) throw new IllegalArgumentException(); return n == 0 ? 1 : n * factorial(n-1); }
System.out.println(factorial(4));
```


<details>
<summary>Check the result and reasoning</summary>


```text
24
```


Each invocation reduces n and eventually reaches zero. The example bounds n to keep int results valid. Deep recursion also consumes call-stack space; use an iterative approach when input depth is unbounded.

</details>

**Your turn:** Why would returning 0 at n == 0 break the recurrence?

<details>
<summary>Check your reasoning</summary>

Every multiplication would eventually include zero. The multiplicative identity is one.

</details>

## Chapter 4: Graphs and deliberate interview practice

Represent connections using adjacency lists, then explore with breadth-first or depth-first traversal. Track visited vertices to avoid loops. For unweighted shortest path, BFS explores by distance. Explain invariants and edge cases rather than memorizing a final implementation.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
var graph = java.util.Map.of("A",java.util.List.of("B","C"),"B",java.util.List.of("C"),"C",java.util.List.of("A"));
var visited = new java.util.LinkedHashSet<String>();
var queue = new java.util.ArrayDeque<String>();
visited.add("A"); queue.add("A");
while(!queue.isEmpty()) for(String next : graph.get(queue.remove())) if(visited.add(next)) queue.add(next);
System.out.println(visited);
```


<details>
<summary>Check the result and reasoning</summary>


```text
[A, B, C]
```


Breadth-first traversal visits each discovered vertex once, despite the cycle back to A. Mark when enqueuing so the same vertex is not queued repeatedly. Adjacency lists give O(V + E) traversal for a full graph scan.

</details>

**Your turn:** Why does BFS find shortest paths only when these edges have equal cost?

<details>
<summary>Check your reasoning</summary>

It explores by edge count. Unequal nonnegative weights require a cost-aware method such as Dijkstra’s algorithm.

</details>

## Predict and explore

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

:::learninglab
{
  "title": "Data structures and algorithmic thinking",
  "code": "var queue = new java.util.PriorityQueue<Integer>();\nqueue.add(3);\nqueue.add(1);\nqueue.add(2);\nwhile (!queue.isEmpty()) System.out.println(queue.poll());",
  "output": "1\n2\n3",
  "steps": [
    {
      "label": "Enqueue",
      "detail": "The heap contains 3, 1, and 2; internal iteration order is not a sorting contract."
    },
    {
      "label": "First poll",
      "detail": "The minimum 1 is removed."
    },
    {
      "label": "Remaining polls",
      "detail": "The next minima are 2 and 3."
    }
  ],
  "prediction": {
    "question": "In what order do repeated poll calls print these priorities?",
    "options": [
      "2\n1\n3",
      "1\n2\n3",
      "3\n1\n2",
      "3\n2\n1"
    ],
    "answer": 1,
    "explanation": "The heap contains 3, 1, and 2; internal iteration order is not a sorting contract. The minimum 1 is removed. The next minima are 2 and 3."
  }
}
:::

## Explain it back

Describe why the result follows from the code. Identify one assumption that would change the outcome, then test that change locally. For concurrent examples, distinguish the scheduling from guarantees established by the APIs.

Continue to the [practical lab](/courses/java-developer-core/module-08-data-structures-and-complexity/02-practice-lab). You can also revisit the [complete Java curriculum](/courses/java).

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
