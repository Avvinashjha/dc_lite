# E-Commerce Cart

An e-commerce cart project practices state modeling, derived totals, forms, routing, validation, and user trust. Small cart bugs can feel serious because users expect prices and quantities to be correct.

The goal is to build a storefront and cart flow that is simple, predictable, and easy to test.

## Project Goal

Build a mini store where users can browse products, add items to a cart, update quantities, remove items, see totals, and complete a mock checkout.

No real payments are required. The checkout can be simulated.

## Core Requirements

Your app must support:

- product listing
- product detail view
- add to cart
- quantity increase and decrease
- remove from cart
- subtotal, tax, shipping, and total calculation
- cart persistence
- promo code validation with at least one mock code
- checkout form validation
- order confirmation screen

## Suggested Component Architecture

```text
App
  ProductRoutes
    ProductList
      ProductCard
    ProductDetails
  CartPage
    CartItem
    CartSummary
    PromoCodeForm
  CheckoutPage
    CheckoutForm
    OrderSummary
  OrderConfirmation
```

For shared cart state, choose one:

- lift state to `App`
- use Context plus `useReducer`
- use a small external store if already taught in your course path

For this project, `useReducer` is a good fit because cart actions are explicit.

```js
const initialCartState = {
  items: [],
  promoCode: null
};
```

Example cart item:

```js
const item = {
  productId: "sku-1",
  name: "React Hoodie",
  price: 49.99,
  quantity: 2,
  imageUrl: "/images/hoodie.png"
};
```

## Cart Actions

Define clear actions:

```text
add_item
remove_item
increase_quantity
decrease_quantity
set_quantity
apply_promo
clear_cart
```

Keep calculations derived:

```js
const subtotal = cart.items.reduce(
  (total, item) => total + item.price * item.quantity,
  0
);
```

Do not store subtotal in state unless there is a strong reason. It can become stale.

## Milestones

1. Render product data from a local array.
2. Add product cards.
3. Add product details route.
4. Implement cart reducer.
5. Add and remove items.
6. Update quantities.
7. Calculate totals.
8. Persist cart state.
9. Add promo code behavior.
10. Build checkout form.
11. Add order confirmation.
12. Test edge cases and deploy.

## Acceptance Criteria

- Adding the same product twice increases quantity instead of duplicating rows.
- Quantity cannot go below one unless the item is removed.
- Cart totals update after every cart action.
- Prices are formatted as currency.
- Invalid promo codes show a clear message.
- Checkout rejects missing required fields.
- Refreshing keeps the cart.
- Order confirmation clears the cart only after successful mock submission.

## Edge Cases

Test these:

- empty cart page
- product id that does not exist
- quantity set to zero, negative, or non-numeric input
- decimal price rounding
- promo code applied twice
- checkout submitted while cart is empty
- cart data in storage references a deleted product
- user refreshes on checkout page

## Money and Rounding

Money is tricky. For a learning project, you may use numbers and format carefully:

```js
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});
```

For production payment systems, store money in the smallest currency unit, such as cents, and let the backend calculate trusted totals.

Awareness note:

Frontend totals are for display. A real backend must recalculate prices, discounts, inventory, taxes, and payment amount.

## Common Mistakes

- Trusting frontend prices during real checkout.
- Storing derived totals in state and forgetting to update them.
- Using floating point math without formatting or rounding strategy.
- Allowing duplicate cart rows for the same product.
- Losing cart state on refresh.
- Hiding validation errors until after a fake payment step.
- Using array indexes as keys for cart items.

:::quiz
question: In a real e-commerce app, where should the final trusted order total be calculated?
options:
  - Only in the React component.
  - In localStorage.
  - On the backend or trusted server.
  - In a CSS file.
answer: 2
explanation: Frontend totals can be changed by users, so real payment amounts must be calculated and verified on a trusted server.
:::

## Practice Challenges

Beginner challenge:

- Add a cart badge that shows total item count.

Intermediate challenge:

- Add sorting and category filters to the product list.

Advanced challenge:

- Add optimistic inventory warnings.
- If a user requests more than available stock, show a clear correction path.

## Extension Ideas

- wishlist
- recently viewed products
- product search
- checkout progress steps
- saved shipping address
- responsive cart drawer
- tests for reducer actions

## Recap

An e-commerce cart is a state modeling project. Use clear actions, derive totals, handle invalid quantities, persist carefully, and remember that real checkout logic belongs on a trusted backend.
