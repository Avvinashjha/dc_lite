# Custom Events

Browsers create many events automatically, but your code can create events too.

These are called custom events.

Custom events are useful when one part of a page needs to announce something
without directly calling every other part of the page.

## Creating a Custom Event

Use `CustomEvent`.

```js
const event = new CustomEvent("cart:updated");
```

The event name is your choice.

Names like `"cart:updated"` or `"modal:closed"` make it clear that the event is
application-specific, not a built-in browser event.

## Dispatching a Custom Event

Creating an event is not enough.

You also need to dispatch it.

```js
const cart = document.querySelector("#cart");

const event = new CustomEvent("cart:updated");

cart.dispatchEvent(event);
```

Any listener registered for that event on the target can respond.

```js
cart.addEventListener("cart:updated", () => {
  console.log("Cart changed");
});
```

## Passing Data with `detail`

Use the `detail` option to attach data.

```js
const event = new CustomEvent("cart:updated", {
  detail: {
    itemCount: 3,
    total: 49.99
  }
});

cart.dispatchEvent(event);
```

Listeners can read `event.detail`.

```js
cart.addEventListener("cart:updated", (event) => {
  console.log(event.detail.itemCount);
  console.log(event.detail.total);
});
```

## A Practical Example

Imagine a small page with a cart badge.

```html
<button id="add-to-cart">Add to cart</button>
<span id="cart-count">0</span>
```

```js
const button = document.querySelector("#add-to-cart");
const count = document.querySelector("#cart-count");

let itemCount = 0;

button.addEventListener("click", () => {
  itemCount += 1;

  const event = new CustomEvent("cart:updated", {
    detail: { itemCount }
  });

  document.dispatchEvent(event);
});

document.addEventListener("cart:updated", (event) => {
  count.textContent = String(event.detail.itemCount);
});
```

The click handler announces that the cart changed. The badge listener decides how
to update the UI.

## Bubbling Custom Events

Custom events do not bubble by default.

If you want the event to travel up through ancestors, set `bubbles: true`.

```js
const event = new CustomEvent("item:selected", {
  bubbles: true,
  detail: { id: "item-1" }
});

button.dispatchEvent(event);
```

Then a parent can listen for it.

```js
list.addEventListener("item:selected", (event) => {
  console.log(event.detail.id);
});
```

## Cancelable Custom Events

Some custom events can be cancelable.

```js
const event = new CustomEvent("before-save", {
  cancelable: true
});

const shouldContinue = form.dispatchEvent(event);

if (shouldContinue) {
  saveForm();
}
```

If a listener calls `event.preventDefault()`, `dispatchEvent` returns `false`.

```js
form.addEventListener("before-save", (event) => {
  if (!formIsValid()) {
    event.preventDefault();
  }
});
```

Use this pattern sparingly. It can make control flow harder to follow if too many
parts of the page can cancel behavior.

## When Custom Events Help

Custom events can be helpful when:

- a reusable component needs to announce something happened
- a parent component should respond to child behavior
- separate scripts need to coordinate through the DOM
- direct function calls would create tight coupling

## When Not to Use Custom Events

Do not use custom events for everything.

If one function can simply call another function, that is often clearer.

```js
function addItem() {
  updateCart();
  updateBadge();
}
```

Custom events are most useful when the sender should not need to know who is
listening.

## Summary

`CustomEvent` lets your code create application-specific events.

Use `detail` to pass data, `dispatchEvent` to fire the event, and `bubbles: true`
when parent elements should be able to listen.
