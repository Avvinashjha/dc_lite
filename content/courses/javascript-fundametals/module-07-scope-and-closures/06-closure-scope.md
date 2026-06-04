# Closure Scope

In the previous lesson, you learned what a closure is.

A closure is a function that remembers variables from the scope where it was created.

Now let's look more closely at how closures interact with the **scope chain**.

Closures are not only about one function remembering one variable.

They are about functions keeping access to the lexical environment around them.

That can include:

- local variables
- parameters
- variables from outer functions
- variables from the global scope
- shared variables used by multiple inner functions

Understanding closure scope helps you predict what a function will remember and what it will change.

## Closures Use the Scope Chain

When a function looks for a variable, JavaScript searches through the scope chain.

It starts in the function's own scope.

If the variable is not found there, JavaScript looks in the outer scope.

Then it keeps looking outward until it reaches the global scope.

Example:

```js
const globalTheme = "dark";

function createWidget() {
  const widgetName = "Calendar";

  return function render() {
    return `Rendering ${widgetName} in ${globalTheme} mode.`;
  };
}

const renderWidget = createWidget();

console.log(renderWidget()); // Rendering Calendar in dark mode.
```

The returned `render` function uses two outer variables:

- `widgetName` from `createWidget`
- `globalTheme` from the global scope

The closure keeps access to the scope chain it needs.

## Immediate Parent Scope Is Not the Only Scope

A closure can access more than its direct parent.

```js
const appName = "DailyCoder";

function createPage(pageTitle) {
  const layout = "dashboard";

  function createHeader() {
    const level = "main";

    return function renderHeader() {
      return `${appName}: ${pageTitle} (${layout}, ${level})`;
    };
  }

  return createHeader();
}

const header = createPage("Reports");

console.log(header()); // DailyCoder: Reports (dashboard, main)
```

The `renderHeader` function can access:

- `level` from `createHeader`
- `layout` and `pageTitle` from `createPage`
- `appName` from the global scope

This is lexical scope in action.

The function remembers the scope chain from where it was written.

## Scope Lookup Still Uses the Closest Match

Closures follow the same lookup rules you learned earlier.

JavaScript uses the closest matching variable name.

```js
const message = "global";

function outer() {
  const message = "outer";

  return function inner() {
    const message = "inner";
    return message;
  };
}

const getMessage = outer();

console.log(getMessage()); // inner
```

The `inner` function has its own `message`.

That is the closest match, so JavaScript uses it.

If the inner variable did not exist, JavaScript would look outward:

```js
const message = "global";

function outer() {
  const message = "outer";

  return function inner() {
    return message;
  };
}

const getMessage = outer();

console.log(getMessage()); // outer
```

If the outer variable did not exist, JavaScript would continue to the global scope:

```js
const message = "global";

function outer() {
  return function inner() {
    return message;
  };
}

const getMessage = outer();

console.log(getMessage()); // global
```

Closures do not change scope lookup rules.

They preserve access to the scope chain.

## Shared Closure Environments

When multiple functions are created inside the same outer function, they can share the same outer variables.

```js
function createGame() {
  let score = 0;

  return {
    addPoint() {
      score++;
      return score;
    },
    reset() {
      score = 0;
      return score;
    },
    getScore() {
      return score;
    },
  };
}

const game = createGame();

console.log(game.addPoint()); // 1
console.log(game.addPoint()); // 2
console.log(game.getScore()); // 2
console.log(game.reset()); // 0
console.log(game.addPoint()); // 1
```

The methods `addPoint`, `reset`, and `getScore` all close over the same `score` variable.

They are not each getting a separate copy.

They share one closure environment created by the call to `createGame()`.

## Shared Scope Enables Private State

Shared closure scope is useful when you want several methods to work with the same private data.

```js
function createTodoList() {
  const todos = [];

  return {
    addTodo(text) {
      todos.push(text);
      return todos.length;
    },
    removeLastTodo() {
      return todos.pop();
    },
    getTodos() {
      return [...todos];
    },
  };
}

const list = createTodoList();

console.log(list.addTodo("Learn closures")); // 1
console.log(list.addTodo("Practice scope")); // 2
console.log(list.getTodos()); // ["Learn closures", "Practice scope"]
console.log(list.removeLastTodo()); // Practice scope
console.log(list.getTodos()); // ["Learn closures"]
```

The `todos` array is private.

Outside code cannot access it directly:

```js
console.log(list.todos); // undefined
```

Only the returned methods can interact with it.

They can do that because they all share the closure around `todos`.

## Separate Calls Create Separate Closure Environments

Functions created in the same outer function call can share variables.

But separate calls to the outer function create separate environments.

```js
function createGame() {
  let score = 0;

  return {
    addPoint() {
      score++;
      return score;
    },
    getScore() {
      return score;
    },
  };
}

const firstGame = createGame();
const secondGame = createGame();

console.log(firstGame.addPoint()); // 1
console.log(firstGame.addPoint()); // 2
console.log(secondGame.getScore()); // 0
console.log(secondGame.addPoint()); // 1
```

`firstGame` and `secondGame` do not share the same `score`.

Each call to `createGame()` creates a new `score` variable.

Each returned object closes over its own environment.

## Sharing vs Isolation

This is an important distinction:

```text
Functions from the same outer call share the same closure environment.
Functions from different outer calls get separate closure environments.
```

Same call:

```js
const game = createGame();

game.addPoint();
game.getScore();
```

Both methods use the same `score`.

Different calls:

```js
const firstGame = createGame();
const secondGame = createGame();
```

Each game gets its own `score`.

This gives you a powerful way to create independent pieces of state.

## Variable Shadowing in Closures

**Shadowing** happens when an inner scope declares a variable with the same name as an outer scope.

```js
function outer() {
  let message = "Hello from outer";

  function inner() {
    let message = "Hello from inner";
    console.log(message);
  }

  inner();
  console.log(message);
}

outer();
```

Output:

```text
Hello from inner
Hello from outer
```

The inner `message` shadows the outer `message`.

Inside `inner`, JavaScript uses the closest `message`.

The outer `message` is not changed.

## Shadowing vs Updating an Outer Variable

Shadowing creates a new variable.

Updating changes an existing outer variable.

Shadowing:

```js
function outer() {
  let count = 10;

  function inner() {
    let count = 99;
    console.log(count);
  }

  inner();
  console.log(count);
}

outer();
```

Output:

```text
99
10
```

The inner `count` is a different variable.

Updating:

```js
function outer() {
  let count = 10;

  function inner() {
    count = 99;
  }

  inner();
  console.log(count);
}

outer(); // 99
```

This time, there is no `let` or `const` inside `inner`.

So JavaScript looks outward, finds the outer `count`, and updates it.

## Why Explicit Declarations Matter

Always declare variables with `let` or `const`.

```js
function outer() {
  let count = 10;

  function inner() {
    const count = 99;
    return count;
  }

  console.log(inner()); // 99
  console.log(count); // 10
}
```

The `const count` inside `inner` makes your intent clear.

You are creating a new local variable.

If you omit the declaration:

```js
function outer() {
  let count = 10;

  function inner() {
    count = 99;
  }

  inner();
  console.log(count); // 99
}
```

You are modifying the outer variable.

Sometimes that is exactly what you want.

But it should be intentional.

## Accidental Globals

In sloppy older JavaScript, assigning to a name without declaring it could create an accidental global variable.

```js
function setUser() {
  username = "Alice";
}

setUser();

console.log(username); // Alice in non-strict scripts
```

This is dangerous.

Modern JavaScript modules and strict mode prevent this by throwing an error.

Still, the lesson is important:

```text
Always declare variables with const or let.
```

It prevents accidental outer-scope changes and accidental globals.

## Closures With Parameters

Parameters are part of the function's scope, so closures can remember them too.

```js
function createUserFormatter(prefix) {
  return function formatUser(name) {
    return `${prefix}: ${name}`;
  };
}

const formatAdmin = createUserFormatter("Admin");
const formatGuest = createUserFormatter("Guest");

console.log(formatAdmin("Alice")); // Admin: Alice
console.log(formatGuest("Bob")); // Guest: Bob
```

The returned function remembers the `prefix` parameter.

Each call to `createUserFormatter` creates a different `prefix`.

## Closures With Multiple Levels

Closures can involve multiple nested functions.

```js
function createApiClient(baseUrl) {
  const version = "v1";

  return function createEndpoint(resource) {
    const path = `${baseUrl}/${version}/${resource}`;

    return function request(id) {
      return `${path}/${id}`;
    };
  };
}

const createUserEndpoint = createApiClient("https://api.example.com");
const getUserUrl = createUserEndpoint("users");

console.log(getUserUrl(42));
```

Output:

```text
https://api.example.com/v1/users/42
```

The innermost `request` function remembers:

- `id` from its own parameter when called
- `path` from `createEndpoint`
- `baseUrl` and `version` from `createApiClient`

This is the scope chain working across multiple levels.

## Loop Closures With `var`

The classic closure loop bug happens because `var` is function-scoped.

```js
for (var i = 1; i <= 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, 100);
}
```

This logs:

```text
4
4
4
```

All three callbacks close over the same `i`.

After the loop finishes, that shared `i` has the value `4`.

The callbacks run later, so they all see `4`.

## Loop Closures With `let`

With `let`, each loop iteration gets a new binding.

```js
for (let i = 1; i <= 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, 100);
}
```

This logs:

```text
1
2
3
```

Each callback closes over a different `i`.

You can think of it like this:

```text
Iteration 1 gets its own i with value 1.
Iteration 2 gets its own i with value 2.
Iteration 3 gets its own i with value 3.
```

This is why `let` fixed one of the most common closure bugs in older JavaScript.

## The Old IIFE Loop Fix

Before `let`, developers often used IIFEs to create a new scope for each loop iteration.

```js
for (var i = 1; i <= 3; i++) {
  (function (currentI) {
    setTimeout(function () {
      console.log(currentI);
    }, 100);
  })(i);
}
```

This logs:

```text
1
2
3
```

The IIFE receives the current value of `i` as `currentI`.

Each callback closes over a separate `currentI`.

You do not need this pattern in modern code when `let` works:

```js
for (let i = 1; i <= 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, 100);
}
```

But you may still see the IIFE version in older code.

## Closures and Object References

Closures preserve access to variables.

If the variable points to an object, the closure can access that same object.

```js
function createProfile() {
  const user = {
    name: "Alice",
    visits: 0,
  };

  return function visit() {
    user.visits++;
    return `${user.name}: ${user.visits}`;
  };
}

const visitProfile = createProfile();

console.log(visitProfile()); // Alice: 1
console.log(visitProfile()); // Alice: 2
```

The closure remembers the `user` variable.

That variable points to the same object each time.

So updates to `user.visits` are preserved.

## Returning Copies to Protect State

If a closure stores an array or object privately, be careful about returning it directly.

```js
function createList() {
  const items = [];

  return {
    add(item) {
      items.push(item);
    },
    getItems() {
      return items;
    },
  };
}

const list = createList();
list.add("JavaScript");

const items = list.getItems();
items.push("Unexpected change");

console.log(list.getItems()); // ["JavaScript", "Unexpected change"]
```

The array was private, but returning it directly gave outside code access to the same array.

Return a copy when you want to protect it:

```js
function createList() {
  const items = [];

  return {
    add(item) {
      items.push(item);
    },
    getItems() {
      return [...items];
    },
  };
}
```

Now callers receive a new array instead of the original private array.

## Best Practices

Use closures to share private state between related functions:

```js
function createCounter() {
  let count = 0;

  return {
    increment() {
      count++;
      return count;
    },
    getCount() {
      return count;
    },
  };
}
```

Use `let` in loops when callbacks need the loop value:

```js
for (let index = 0; index < 3; index++) {
  setTimeout(function () {
    console.log(index);
  }, 100);
}
```

Declare variables explicitly:

```js
const message = "Hello";
let count = 0;
```

Avoid unnecessary shadowing:

```js
const defaultTheme = "dark";

function createWidget() {
  const widgetTheme = "light";
  return widgetTheme;
}
```

Return copies of private arrays or objects when outside code should not mutate them directly:

```js
function getItems() {
  return [...items];
}
```

## Common Mistakes

### Mistake 1: Thinking Shared Methods Have Separate State

```js
function createCounter() {
  let count = 0;

  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
  };
}
```

Both methods use the same `count`.

That is usually the point, but it can surprise you if you expect each method to have separate state.

### Mistake 2: Accidentally Modifying an Outer Variable

```js
function outer() {
  let value = 1;

  function inner() {
    value = 2;
  }

  inner();
  console.log(value); // 2
}
```

Because `inner` does not declare its own `value`, it updates the outer one.

Use `const` or `let` if you want a new local variable.

### Mistake 3: Returning a Private Object Directly

```js
function createStore() {
  const state = {
    count: 0,
  };

  return {
    getState() {
      return state;
    },
  };
}
```

This exposes the private object.

Outside code can mutate it.

Return a copy if you need protection:

```js
getState() {
  return { ...state };
}
```

### Mistake 4: Using `var` in Async Loops

```js
for (var i = 1; i <= 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, 100);
}
```

All callbacks share the same `i`.

Use `let`:

```js
for (let i = 1; i <= 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, 100);
}
```

## Quick Check

What does this log?

```js
function createGame() {
  let score = 0;

  return {
    addPoint() {
      score++;
      return score;
    },
    getScore() {
      return score;
    },
  };
}

const game = createGame();

console.log(game.addPoint());
console.log(game.getScore());
```

It logs:

```text
1
1
```

Both methods share the same `score` variable.

What does this log?

```js
function outer() {
  let message = "outer";

  function inner() {
    let message = "inner";
    return message;
  }

  console.log(inner());
  console.log(message);
}

outer();
```

It logs:

```text
inner
outer
```

The inner `message` shadows the outer `message`.

What does this log?

```js
for (let i = 1; i <= 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, 100);
}
```

It logs:

```text
1
2
3
```

Each loop iteration creates a separate `i` binding for the callback to close over.

## Summary

Closure scope is about how closures preserve access to the scope chain.

- Closures can remember variables from multiple outer scopes.
- JavaScript still uses the closest matching variable name.
- Multiple functions created in the same outer call can share the same closure environment.
- Separate calls to the outer function create separate closure environments.
- Shadowing creates a new inner variable with the same name.
- Omitting `let` or `const` can accidentally update an outer variable.
- `let` in loops creates a fresh binding for each iteration, which fixes the classic async loop closure bug.
- Be careful when returning private arrays or objects directly because outside code can mutate them.
