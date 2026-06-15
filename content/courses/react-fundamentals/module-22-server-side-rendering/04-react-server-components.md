# React Server Components

React Server Components let some components render only on the server.

They are different from traditional SSR. SSR produces initial HTML. Server Components change the component model by allowing parts of the tree to stay server-only.

## The Key Idea

A Server Component can access server resources and send a rendered description to the client without shipping its component code to the browser.

```jsx
async function ProductDetails({ id }) {
  const product = await db.products.findById(id);

  return (
    <section>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </section>
  );
}
```

In a framework that supports Server Components, this component can run on the server and avoid sending database code or product fetching logic to the client.

## Server Components vs Client Components

Server Components can:

- read from databases or server-only APIs
- use async data fetching directly
- keep large dependencies off the client bundle
- render non-interactive UI
- pass serializable props to Client Components

Server Components cannot:

- use `useState`
- use `useEffect`
- access `window` or `document`
- attach event handlers directly
- depend on browser-only APIs

Client Components can use state, effects, refs, browser APIs, and event handlers.

## Boundary Example

```jsx
// Server Component
async function ProductPage({ productId }) {
  const product = await getProduct(productId);

  return (
    <main>
      <ProductSummary product={product} />
      <AddToCartButton productId={product.id} />
    </main>
  );
}
```

```jsx
// Client Component
function AddToCartButton({ productId }) {
  const [isAdding, setIsAdding] = useState(false);

  async function handleClick() {
    setIsAdding(true);
    await addToCart(productId);
    setIsAdding(false);
  }

  return <button onClick={handleClick}>{isAdding ? "Adding..." : "Add to cart"}</button>;
}
```

The server part loads and renders product content. The client part handles interaction.

## What Gets Sent to the Browser?

Server Components do not send their source code to the browser as interactive component code.

The browser receives a payload that describes what should be shown and where Client Components fit.

```text
Server Component tree
  -> rendered payload
  -> references to Client Components
  -> browser hydrates client islands
```

This can reduce bundle size when large UI sections do not need interactivity.

## Serializable Props

Props crossing from server to client must be serializable.

Good:

```jsx
<UserBadge user={{ id: "u1", name: "Asha" }} />
```

Problematic:

```jsx
<UserBadge user={userModelWithMethods} />
```

Functions, class instances, database connections, and complex non-serializable values cannot cross the boundary safely.

## Security Awareness

Server Components can access sensitive systems, but rendered output still goes to the user.

Do not render secrets.

```jsx
return <pre>{process.env.PRIVATE_API_KEY}</pre>; // never do this
```

Server-only execution protects code from being bundled, not data from being displayed.

## Relationship to SSR

Server Components and SSR can work together.

SSR:

- produces HTML for the initial request
- improves first content
- still hydrates client components

Server Components:

- decide which components run only on the server
- reduce client JavaScript for server-only UI
- enable server data access in the component tree

They solve related but different problems.

## Common Mistakes

- Trying to use `useState` or `useEffect` in a Server Component.
- Passing functions from Server Components to Client Components.
- Assuming Server Components remove all client JavaScript.
- Rendering secrets because the code runs on the server.
- Making too many components client components and losing bundle-size benefits.

## Edge Case

If a component needs only a tiny click handler, you may be tempted to mark a large parent as a Client Component.

Instead, keep the large parent server-rendered and move the interactive control into a small Client Component.

:::quiz
question: Which task is a good fit for a React Server Component?
options:
  - Reading product data from a database and rendering static product details
  - Tracking input text with `useState`
  - Adding a click handler directly to a button
  - Reading `window.innerWidth` during render
answer: 0
explanation: Server Components can access server-side data sources and render non-interactive UI. State, effects, event handlers, and browser APIs belong in Client Components.
:::

## Practical Challenge

Design a product page with:

- server-rendered product description
- client-side add-to-cart button
- client-side favorite toggle
- server-only database access

Mark which components should be server components and which should be client components.

## Recap

React Server Components let non-interactive parts of the UI run on the server and avoid shipping their component code to the browser.

Use them to keep server concerns on the server, but keep interactive behavior in focused Client Components.
