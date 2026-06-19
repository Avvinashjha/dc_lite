# Composition Over Inheritance

Composition means building behavior by combining smaller pieces.

Inheritance means creating a parent-child relationship where child classes receive behavior from parent classes.

"Composition over inheritance" is a guideline: prefer combining focused behaviors unless inheritance clearly fits the problem.

## Inheritance Example

```js
class Animal {
  constructor(name) {
    this.name = name;
  }

  eat() {
    console.log(`${this.name} is eating`);
  }
}

class Dog extends Animal {
  bark() {
    console.log(`${this.name} says woof`);
  }
}
```

This is fine when `Dog` truly is a specialized kind of `Animal`.

## Where Inheritance Gets Awkward

Imagine modeling users.

```js
class User {}
class Admin extends User {}
class Moderator extends User {}
class PayingAdmin extends Admin {}
```

What happens when a moderator also becomes a paying user?

Deep inheritance trees can become rigid.

JavaScript apps often need combinations of capabilities, not strict family trees.

## Composition With Functions

```js
function canLogIn(user) {
  return {
    login() {
      console.log(`${user.name} logged in`);
    },
  };
}

function canModerate(user) {
  return {
    deleteComment(commentId) {
      console.log(`${user.name} deleted comment ${commentId}`);
    },
  };
}

function createModerator(name) {
  const user = { name };

  return {
    ...user,
    ...canLogIn(user),
    ...canModerate(user),
  };
}
```

The moderator is built by combining capabilities.

## Composition With Dependencies

Composition also means giving objects the collaborators they need.

```js
function createOrderService({ paymentService, emailService }) {
  return {
    async placeOrder(order) {
      await paymentService.charge(order.total);
      await emailService.sendReceipt(order.email);
    },
  };
}
```

The order service is composed from smaller services.

## Composition With Small Functions

Functional programming uses composition heavily.

```js
const trim = (value) => value.trim();
const lowercase = (value) => value.toLowerCase();
const removeSpaces = (value) => value.replaceAll(" ", "-");

function createSlug(title) {
  return removeSpaces(lowercase(trim(title)));
}
```

Each function is small and reusable.

## Inheritance Is Not Bad

Inheritance can be appropriate when:

- there is a real `is-a` relationship
- shared behavior is stable
- the hierarchy is shallow
- the parent class has a clear purpose
- the codebase already uses classes consistently

Example:

```js
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}
```

Custom errors are a good inheritance use case.

## Composition Is Often More Flexible

Composition works well when:

- behavior needs to be mixed and matched
- dependencies may change
- testing requires fake collaborators
- many small behaviors combine into larger workflows
- inheritance would create many subclasses

## Pattern Tradeoffs

Composition can create many small functions or objects.

That is good when names are clear and boundaries are useful.

It is bad when the code becomes scattered and hard to follow.

Inheritance can keep related behavior in one class.

That is good when the relationship is simple.

It is bad when changes in the parent accidentally affect many children.

## Anti-Patterns to Watch For

### God Object

A god object knows too much and does too much.

```js
const appManager = {
  users: [],
  orders: [],
  settings: {},
  saveUser() {},
  chargeCard() {},
  renderPage() {},
  sendEmail() {},
};
```

Split responsibilities into focused modules or services.

### Pattern Soup

Pattern soup happens when code uses many patterns at once without a clear reason.

A factory that returns a singleton facade that dispatches commands to strategies may be appropriate in a large system.

It is probably too much for a small feature.

### Premature Abstraction

Do not build an abstraction before the code shows what needs to vary.

Duplication is sometimes the information you need before designing the right abstraction.

## Common Mistakes

### Using Inheritance for Shared Utilities

If two classes need the same formatting function, a shared function may be better than a parent class.

### Composing Without Clear Names

Small pieces still need meaningful names.

`withThing()` and `doStuff()` do not help readers.

### Ignoring Existing Project Style

If a project uses plain modules, do not introduce a class hierarchy without a strong reason.

If a project uses services and classes consistently, follow that style.

## Best Practices

- Prefer small, focused functions and objects.
- Use inheritance for clear and stable `is-a` relationships.
- Use composition for capabilities, workflows, and replaceable dependencies.
- Keep names specific and behavior easy to locate.
- Avoid abstractions built only for imagined future needs.
- Let repeated real code guide your abstractions.

## Summary

Composition builds behavior by combining smaller parts.

Inheritance shares behavior through parent-child relationships.

In JavaScript, composition often fits better because functions, objects, modules, and dependencies are easy to combine.

Use inheritance when the relationship is clear, shallow, and stable.

