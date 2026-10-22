# Arrays and problem solving

**Real-life problem:** A weather station summarizes daily temperatures.

**You will learn:** Fixed-size arrays and indexes; Accumulation, search, and empty inputs; Two-dimensional arrays and copying; Complexity and small test cases.

## Chapter 1: Fixed-size arrays and indexes

An array groups values of one element type into an indexed sequence. Its length is fixed at creation. Accessing an invalid index raises ArrayIndexOutOfBoundsException. An int array receives zero-initialized elements, but you still need to decide what those zeros mean in the domain.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
int[] seats = new int[3];
seats[2] = 8;
System.out.println(seats.length + ":" + seats[0] + ":" + seats[2]);
```


<details>
<summary>Check the result and reasoning</summary>


```text
3:0:8
```


The array has three fixed positions, initially zero. The field is length rather than a length() method. An out-of-range access fails instead of returning a sentinel value.

</details>

**Your turn:** Which access is invalid: seats[0], seats[2], or seats[3]?

<details>
<summary>Check your reasoning</summary>

seats[3] is outside the valid range 0–2 and throws ArrayIndexOutOfBoundsException.

</details>

## Chapter 2: Accumulation, search, and empty inputs

A sum starts at zero; a maximum cannot safely start at zero when all values may be negative. Choose an explicit empty-input policy before accessing element zero. Linear search examines values until it finds a match or exhausts the array.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
int indexOf(int[] values, int target) { for (int i = 0; i < values.length; i++) if (values[i] == target) return i; return -1; }
System.out.println(indexOf(new int[]{4, 7, 7}, 7));
System.out.println(indexOf(new int[]{}, 7));
```


<details>
<summary>Check the result and reasoning</summary>


```text
1
-1
```


Linear search checks positions in order and returns the first match. The explicit -1 sentinel cannot be confused with a valid array index, including on empty input.

</details>

**Your turn:** How would the contract change if all matching indexes were needed?

<details>
<summary>Check your reasoning</summary>

Return a collection of indexes and continue after a match, rather than returning immediately.

</details>

## Chapter 3: Two-dimensional arrays and copying

A Java two-dimensional array is an array of array references and may be ragged. Copying the outer array does not deep-copy its rows. Arrays.copyOf creates a new one-dimensional array; copying reference elements still preserves references to the same objects.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
int[][] original = {{1, 2}, {3}};
int[][] copy = original.clone();
copy[0][0] = 9;
System.out.println(original[0][0]);
```


<details>
<summary>Check the result and reasoning</summary>


```text
9
```


The outer array was copied, but its entries are references to the same row arrays. Ragged rows are legal. Deep-copy each row when independent mutable rows are required.

</details>

**Your turn:** How can you copy all the rows independently?

<details>
<summary>Check your reasoning</summary>

Allocate a new outer array, then clone each nonnull row. A shallow outer clone is insufficient.

</details>

## Chapter 4: Complexity and small test cases

A single pass over n readings takes O(n) time. Nested full passes often take O(n²). Complexity describes growth, not exact elapsed time. Draw the array and trace a tiny example before optimizing. Include duplicates, negative values, empty input, and an item at the final index.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
int[] values = {7, 2, 5};
java.util.Arrays.sort(values);
System.out.println(java.util.Arrays.toString(values));
System.out.println(java.util.Arrays.binarySearch(values, 5));
```


<details>
<summary>Check the result and reasoning</summary>


```text
[2, 5, 7]
1
```


Sorting mutates this array. Binary search then uses the established order to discard portions of the search space. Search on an unsorted array does not meet the algorithm’s precondition.

</details>

**Your turn:** What is the auxiliary-space cost of creating a full copy of n readings?

<details>
<summary>Check your reasoning</summary>

O(n). A faster lookup or a simpler ownership boundary may justify the additional memory, but it is still a real tradeoff.

</details>

## Predict and explore

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

:::learninglab
{
  "title": "Arrays and problem solving",
  "code": "int[] temperatures = {-3, 4, 1};\nint max = temperatures[0];\nfor (int value : temperatures) {\n  if (value > max) max = value;\n}\nSystem.out.println(max);",
  "output": "4",
  "steps": [
    {
      "label": "Initialize",
      "detail": "max = -3, the first actual reading."
    },
    {
      "label": "Compare 4",
      "detail": "4 > -3, so max becomes 4."
    },
    {
      "label": "Compare 1",
      "detail": "1 is not greater than 4; max stays 4."
    }
  ],
  "prediction": {
    "question": "Which maximum is printed for these readings?",
    "options": [
      "4",
      "-3",
      "1",
      "0"
    ],
    "answer": 0,
    "explanation": "max = -3, the first actual reading. 4 > -3, so max becomes 4. 1 is not greater than 4; max stays 4."
  }
}
:::

## Explain it back

Describe why the result follows from the code. Identify one assumption that would change the outcome, then test that change locally. For concurrent examples, distinguish the scheduling from guarantees established by the APIs.

Continue to the [practical lab](/courses/java-fundamentals/module-05-arrays-and-algorithms/02-practice-lab). You can also revisit the [complete Java curriculum](/courses/java).

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
