# Your first Java program

**Real-life problem:** A café needs a receipt printer.

**You will learn:** Java, the JDK, and the JVM; Install and verify your tools; Source files, main, and console output; JShell, compiler errors, and runtime errors.

## Chapter 1: Java, the JDK, and the JVM

Java source is a recipe; the compiler turns it into bytecode, and the JVM executes it. The JDK supplies development tools including javac, java, and JShell. This separation lets the same class file run on compatible JVMs on different operating systems.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
System.out.println(System.getProperty("java.specification.version").equals("25"));
```


<details>
<summary>Check the result and reasoning</summary>


```text
true
```


The tool version is an observable part of the environment. A different result means this shell is using another Java release, even if your editor uses 25.

</details>

**Your turn:** How would you check the compiler as well?

<details>
<summary>Check your reasoning</summary>

Run javac --version in the same terminal. Verify JAVA_HOME and the order of PATH entries if the versions disagree.

</details>

## Chapter 2: Install and verify your tools

Install an OpenJDK 25 distribution and verify java --version, javac --version, and jshell --version in a new terminal. If they disagree, inspect JAVA_HOME and PATH before continuing. An IDE helps navigate projects, but the command line makes the execution model visible.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
int cups = 2;
System.out.println(cups * 60);
```


<details>
<summary>Check the result and reasoning</summary>


```text
120
```


A declaration gives a value a name and a type. The multiplication is evaluated before println receives its argument. A semicolon ends each statement.

</details>

**Your turn:** Change the price to 75. What should be printed?

<details>
<summary>Check your reasoning</summary>

150. Change the expression to cups * 75, then run it again.

</details>

## Chapter 3: Source files, main, and console output

Save a public class named Receipt in Receipt.java. The traditional public static void main(String[] args) entry point remains useful when reading existing projects. Compile with javac Receipt.java and run with java Receipt; do not include .class in the launch command.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
class Cafe { static String greeting() { return "Welcome"; } }
System.out.println(Cafe.greeting());
```


<details>
<summary>Check the result and reasoning</summary>


```text
Welcome
```


The class groups behavior. A static method can be invoked through its class name. In a packaged project, a package statement places classes in a namespace and imports shorten qualified type names.

</details>

**Your turn:** Which file and folder would hold public class Cafe in package shop?

<details>
<summary>Check your reasoning</summary>

Use shop/Cafe.java beneath the source root, begin with package shop;, compile from the source root, and launch its fully qualified name when it has a main method.

</details>

## Chapter 4: JShell, compiler errors, and runtime errors

Use JShell for small experiments. A missing semicolon prevents compilation; a program that compiles can still fail at runtime. Read the first useful error and the source line before changing unrelated code. Keep experiments small enough that you can predict their output.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
try { Integer.parseInt("two"); }
catch (NumberFormatException ex) { System.out.println("Please enter digits"); }
```


<details>
<summary>Check the result and reasoning</summary>


```text
Please enter digits
```


This code is syntactically valid. The failure happens during execution because the input does not represent an integer. The catch chooses a useful recovery message.

</details>

**Your turn:** What changes if "two" becomes "2"?

<details>
<summary>Check your reasoning</summary>

No error message is printed. Parsing succeeds, but the returned integer is not printed by this example.

</details>

## Predict and explore

Save the example as Receipt.java, then run javac Receipt.java and java Receipt. You can also paste the class into JShell and call Receipt.main(new String[0]).

:::learninglab
{
  "title": "Your first Java program",
  "code": "class Receipt {\n  public static void main(String[] args) {\n    int coffees = 2;\n    System.out.println(\"Coffees: \" + coffees);\n  }\n}",
  "output": "Coffees: 2",
  "steps": [
    {
      "label": "Enter main",
      "detail": "The JVM calls the entry point. No receipt has been printed."
    },
    {
      "label": "coffees = 2",
      "detail": "The local int holds the value 2."
    },
    {
      "label": "Print receipt",
      "detail": "String concatenation produces Coffees: 2, followed by a newline."
    }
  ],
  "prediction": {
    "question": "After compiling and launching Receipt, what is printed?",
    "options": [
      "Coffees: 2",
      "Coffees: 0",
      "2",
      "Receipt.class"
    ],
    "answer": 0,
    "explanation": "The JVM calls the entry point. No receipt has been printed. The local int holds the value 2. String concatenation produces Coffees: 2, followed by a newline."
  }
}
:::

## Explain it back

Describe why the result follows from the code. Identify one assumption that would change the outcome, then test that change locally. For concurrent examples, distinguish the scheduling from guarantees established by the APIs.

Continue to the [practical lab](/courses/java-fundamentals/module-01-first-program/02-practice-lab). You can also revisit the [complete Java curriculum](/courses/java).

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
