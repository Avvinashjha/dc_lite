# Composition vs Inheritance

Inheritance is powerful, but it is not always the best design.

Classes give you more than one way to share behavior.

Two important approaches are:

- inheritance
- composition

## Inheritance

Inheritance uses `extends`.

```js
class Animal {
  eat() {
    return "Eating";
  }
}

class Dog extends Animal {
  bark() {
    return "Woof";
  }
}
```

This says:

```text
Dog is an Animal.
```

Inheritance works best for true "is-a" relationships.

## Composition

Composition means building an object by giving it other objects or functions to use.

```js
class Engine {
  start() {
    return "Engine started";
  }
}

class Car {
  constructor(engine) {
    this.engine = engine;
  }

  start() {
    return this.engine.start();
  }
}

const car = new Car(new Engine());

console.log(car.start()); // Engine started
```

This says:

```text
Car has an Engine.
```

That is a "has-a" relationship.

## Is-A vs Has-A

Use inheritance for "is-a".

```text
Admin is a User.
Dog is an Animal.
SavingsAccount is a BankAccount.
```

Use composition for "has-a" or "uses-a".

```text
Car has an Engine.
UserService uses an ApiClient.
Checkout has a PaymentProcessor.
```

This distinction helps you avoid forced inheritance.

## Composition Example

```js
class EmailSender {
  send(to, message) {
    return `Sending email to ${to}: ${message}`;
  }
}

class UserNotifier {
  constructor(sender) {
    this.sender = sender;
  }

  notify(user, message) {
    return this.sender.send(user.email, message);
  }
}

const notifier = new UserNotifier(new EmailSender());

console.log(
  notifier.notify({ email: "alice@example.com" }, "Welcome!")
);
```

`UserNotifier` does not need to extend `EmailSender`.

It uses an `EmailSender`.

## Why Composition Is Often Flexible

Composition lets you swap behavior.

```js
class SmsSender {
  send(to, message) {
    return `Sending SMS to ${to}: ${message}`;
  }
}

const smsNotifier = new UserNotifier(new SmsSender());
```

`UserNotifier` can work with any object that has a compatible `send` method.

This can make code easier to test and change.

## When Inheritance Gets Awkward

Imagine this:

```text
Bird
  FlyingBird
  SwimmingBird
  FlyingAndSwimmingBird
```

Real-world categories can get messy.

Some birds fly.

Some swim.

Some do both.

Some do neither.

Inheritance can create complicated class trees.

Composition can be simpler:

```js
const canFly = {
  fly() {
    return "Flying";
  },
};

const canSwim = {
  swim() {
    return "Swimming";
  },
};
```

You can combine behavior where needed.

## Prefer Simple Designs

For beginner JavaScript, the best design is usually the clearest design.

Use a class when it helps model repeated objects with behavior.

Use inheritance when there is a clear parent-child relationship.

Use composition when an object uses another object to do part of its work.

Use plain functions when a class is unnecessary.

## Classes With Modules

Classes are often exported from modules.

```js
// User.js
export class User {
  constructor(name) {
    this.name = name;
  }
}
```

Import:

```js
import { User } from "./User.js";

const user = new User("Alice");
```

A class can also be a default export.

```js
export default class User {}
```

```js
import User from "./User.js";
```

Use the export style that matches your project.

## Best Practices

Use inheritance only for meaningful "is-a" relationships.

Use composition for "has-a" and "uses-a" relationships.

Keep inheritance chains shallow.

Avoid designing class hierarchies before you need them.

Prefer simple functions or objects when they solve the problem clearly.

Use modules to keep classes focused and reusable.

## Common Mistakes

### Mistake 1: Using Inheritance Only to Reuse One Method

If you only need a helper function, export a function.

```js
export function formatDate(date) {}
```

Do not create a parent class just for unrelated utility sharing.

### Mistake 2: Confusing Has-A With Is-A

```text
Car is an Engine
```

This is wrong.

A car has an engine.

Composition is a better fit.

### Mistake 3: Creating Deep Class Trees Too Early

Deep inheritance can become hard to change.

Start simple.

Add inheritance only when it makes the model clearer.

## Summary

Inheritance and composition are two ways to organize behavior.

- Inheritance models "is-a" relationships.
- Composition models "has-a" or "uses-a" relationships.
- `extends` is useful, but should not be forced.
- Composition is often more flexible.
- Plain functions and objects are sometimes simpler than classes.
- Keep class designs focused and easy to understand.
