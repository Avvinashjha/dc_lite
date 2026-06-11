# What is JavaScript?

JavaScript (JS) is a high-level, interpreted programming language that is one of the three foundational technologies of the World Wide Web, alongside HTML and CSS.

## Key Characteristics

### Interpreted and Just-In-Time (JIT) Compiled

Unlike languages like C++ or Java that are usually compiled before running, JavaScript is run by a JavaScript engine such as Chrome's V8 or Firefox's SpiderMonkey. Modern engines parse the code and often use Just-In-Time (JIT) compilation to optimize it while the program runs.

### Dynamically Typed

You don’t need to declare the data type of a variable (e.g., `int` or `string`). The type is determined at runtime, meaning a variable can hold a number one moment and a `string` the next.

### Multi-Paradigm

It supports multiple programming styles, including:
- **Imperative** (step-by-step instructions)
- **Object-Oriented** (using objects and prototypes)
- **Functional** (using pure functions, closures, and higher-order functions)

### Event-Driven & Asynchronous

JavaScript is designed to handle events (like clicks, keystrokes, or data arriving from a server) without freezing the rest of the application, thanks to its non-blocking, asynchronous nature.

### Single-Threaded

It has only one call stack, meaning it executes one piece of code at a time. However, it uses an **Event Loop** and Web APIs to handle asynchronous operations (like fetching data) efficiently in the background.
