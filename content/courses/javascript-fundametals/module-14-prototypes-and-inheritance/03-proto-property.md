# __proto__

You may see `__proto__` when inspecting objects in the browser console.

```js
const user = {
  name: "Alice",
};

console.log(user.__proto__);
```

`__proto__` refers to an object's prototype.

However, in modern JavaScript, you should usually avoid using `__proto__` directly.

Use:

```js
Object.getPrototypeOf(object)
```

and:

```js
Object.setPrototypeOf(object, prototype)
```

instead.

## What `__proto__` Shows

```js
const user = {
  name: "Alice",
};

console.log(user.__proto__ === Object.prototype); // true
```

For a normal object literal, the prototype is usually `Object.prototype`.

This means the object can inherit methods like:

- `toString`
- `valueOf`
- `hasOwnProperty`

## `__proto__` Is Not the Same as `prototype`

This is a common source of confusion.

`__proto__` is on objects and points to that object's prototype.

```js
const user = {};

console.log(user.__proto__ === Object.prototype); // true
```

`prototype` is a property on functions used when creating objects with `new`.

```js
function User(name) {
  this.name = name;
}

const user = new User("Alice");

console.log(user.__proto__ === User.prototype); // true
```

Short version:

```text
object.__proto__ points to the object's prototype.
ConstructorFunction.prototype is used for instances created with new.
```

You will learn constructor function prototypes in the next lesson.

## Modern Way: Object.getPrototypeOf()

Instead of reading `__proto__`, use `Object.getPrototypeOf()`.

```js
const user = {
  name: "Alice",
};

const prototype = Object.getPrototypeOf(user);

console.log(prototype === Object.prototype); // true
```

This is the recommended way to inspect a prototype.

## Modern Way: Object.setPrototypeOf()

You can change an object's prototype with `Object.setPrototypeOf()`.

```js
const animal = {
  speak() {
    return "Animal sound";
  },
};

const dog = {
  name: "Bruno",
};

Object.setPrototypeOf(dog, animal);

console.log(dog.speak()); // Animal sound
```

However, changing prototypes after objects are created is usually discouraged.

It can make code harder to understand and can hurt performance.

Prefer creating the object with the correct prototype from the start:

```js
const dog = Object.create(animal);
dog.name = "Bruno";
```

Or use a class when appropriate.

## Why `__proto__` Is Still Seen

You may see `__proto__` because:

- browser DevTools display it
- older tutorials use it
- some code uses it for quick demos
- it helps visualize the prototype chain

It is useful to recognize.

But in production code, prefer modern APIs.

## Prototype Chain Example

```js
const animal = {
  alive: true,
};

const dog = Object.create(animal);
dog.name = "Bruno";

console.log(dog.__proto__ === animal); // true
console.log(Object.getPrototypeOf(dog) === animal); // true
```

Both lines show the same prototype relationship.

The second line is preferred.

## `__proto__` and Object Literals

Object literals can use `__proto__` specially to set the prototype.

```js
const animal = {
  alive: true,
};

const dog = {
  __proto__: animal,
  name: "Bruno",
};

console.log(dog.alive); // true
```

This is valid, but it is not the clearest beginner pattern.

Prefer:

```js
const dog = Object.create(animal);
dog.name = "Bruno";
```

## Best Practices

Recognize `__proto__` when you see it in DevTools.

Use `Object.getPrototypeOf()` to inspect prototypes.

Use `Object.create()` to create objects with a specific prototype.

Avoid changing prototypes after object creation.

Do not confuse `__proto__` with a function's `prototype` property.

## Common Mistakes

### Mistake 1: Confusing `__proto__` and `prototype`

```js
const user = {};

console.log(user.prototype); // undefined
```

Normal objects do not have a `prototype` property like constructor functions do.

### Mistake 2: Using `__proto__` in Application Code

```js
object.__proto__ = parent;
```

Prefer:

```js
Object.setPrototypeOf(object, parent);
```

Even better, create it correctly from the start:

```js
const object = Object.create(parent);
```

### Mistake 3: Changing Prototypes Too Often

Changing prototypes dynamically can make code harder to reason about and may hurt performance.

Design the prototype relationship upfront when possible.

## Quick Check

What is the preferred modern way to get an object's prototype?

```js
Object.getPrototypeOf(object)
```

What does `user.__proto__` usually point to for a normal object literal?

```js
Object.prototype
```

## Summary

`__proto__` points to an object's prototype, but modern code should avoid relying on it directly.

- `__proto__` is commonly seen in DevTools.
- Use `Object.getPrototypeOf()` instead of reading `__proto__`.
- Use `Object.create()` to create objects with a chosen prototype.
- Avoid changing prototypes after creation when possible.
- `__proto__` and `prototype` are different concepts.
- Constructor functions use `.prototype` for objects created with `new`.
