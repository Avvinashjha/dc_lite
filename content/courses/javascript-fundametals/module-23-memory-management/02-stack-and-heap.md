# Stack and Heap

Developers often explain memory with two areas: the stack and the heap.

This is a mental model, not a perfect map of every JavaScript engine. Still, it helps you reason about local variables, objects, function calls, and references.

## The Stack

The stack stores information about active function calls.

```js
function double(number) {
  const result = number * 2;
  return result;
}

function printDouble(value) {
  const doubled = double(value);
  console.log(doubled);
}

printDouble(5);
```

When `printDouble(5)` runs, JavaScript creates a call frame for `printDouble`.

When `double(value)` runs, JavaScript creates another call frame for `double`.

When `double` returns, its call frame is removed.

## Stack Overflow

If function calls keep piling up without returning, the stack can run out of space.

```js
function countDown(number) {
  console.log(number);
  countDown(number - 1);
}

countDown(3);
```

This recursive function has no base case, so it eventually causes a stack overflow.

A fixed version stops:

```js
function countDown(number) {
  if (number < 0) {
    return;
  }

  console.log(number);
  countDown(number - 1);
}
```

## The Heap

Objects, arrays, and functions usually live on the heap.

```js
const user = {
  name: "Ada",
  roles: ["admin", "editor"],
};
```

The variable `user` holds a reference to an object. The object itself can contain references to more values, like the `roles` array.

## Primitive Values and References

Primitive values include strings, numbers, booleans, `null`, `undefined`, symbols, and bigints.

Objects are reference values.

```js
let a = 10;
let b = a;

b = 20;

console.log(a); // 10
console.log(b); // 20
```

Copying a primitive gives you an independent value.

Objects behave differently:

```js
const userA = { name: "Ada" };
const userB = userA;

userB.name = "Grace";

console.log(userA.name); // "Grace"
```

`userA` and `userB` refer to the same object.

## References Can Keep Large Structures Alive

A small variable can keep a large object graph reachable.

```js
let currentProject = {
  name: "Website redesign",
  files: new Array(10000).fill({ status: "draft" }),
};
```

As long as `currentProject` is reachable, the project object and its `files` array are reachable too.

```js
currentProject = null;
```

If nothing else refers to that project, the whole structure can be collected.

## Function Calls Can Hold References

A function's local variables are normally short-lived.

```js
function processUsers(users) {
  const activeUsers = users.filter((user) => user.active);
  return activeUsers.length;
}
```

After the function returns, `activeUsers` can be collected if nothing else refers to it.

But if you return a function that closes over local variables, those variables can live longer.

```js
function createUserCounter(users) {
  return function countUsers() {
    return users.length;
  };
}

const countUsers = createUserCounter(largeUserList);
```

The returned function keeps `users` reachable.

## Best Practices

- Use local variables when data is only needed inside one function.
- Be careful when closures capture large objects.
- Break large work into iterative chunks if recursion may become too deep.
- Remember that assigning one object variable to another copies the reference, not the object.

## Common Mistakes

- Thinking `const copy = object` creates a new object.
- Keeping references to large structures in module-level variables after they are no longer needed.
- Writing recursive code without a base case.
- Treating the stack and heap model as exact engine behavior instead of a useful simplification.

## Summary

The stack helps manage active function calls. The heap stores longer-lived values such as objects, arrays, and functions.

A value stays alive when reachable through references, so understanding references is central to understanding JavaScript memory.
