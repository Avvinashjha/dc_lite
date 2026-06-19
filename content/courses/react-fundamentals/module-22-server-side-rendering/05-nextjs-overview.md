# Next.js Overview

Next.js is a React framework for routing, rendering, data fetching, bundling, and deployment conventions.

You can build React without Next.js, but Next.js is one of the most common ways teams use SSR, SSG, streaming, and React Server Components in production.

## What Next.js Adds

React provides component primitives.

Next.js adds framework decisions around:

- file-based routing
- server rendering
- static generation
- API routes or server handlers
- image optimization
- code splitting
- metadata and SEO
- deployment patterns

This reduces setup work but also means you must understand the framework's conventions.

## App Router Mental Model

Modern Next.js applications often use the App Router.

```text
app/
  layout.jsx
  page.jsx
  products/
    page.jsx
    [id]/
      page.jsx
```

`layout.jsx` defines shared UI around child routes.

`page.jsx` defines route content.

Dynamic segments such as `[id]` represent route parameters.

## Server Components by Default

In the App Router, components are commonly Server Components by default.

Use a Client Component when you need browser interactivity.

```jsx
"use client";

import { useState } from "react";

export function LikeButton() {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(!liked)}>{liked ? "Liked" : "Like"}</button>;
}
```

The `"use client"` directive marks a boundary. Components imported by that file become part of the client bundle unless carefully separated.

## Rendering Options

Next.js can support multiple rendering strategies:

- static rendering for cacheable pages
- dynamic server rendering for request-specific pages
- streaming with Suspense
- client-side rendering for browser-only sections
- incremental regeneration depending on configuration

A single application can mix these by route and component.

## Data Fetching

Server Components can fetch data on the server.

```jsx
export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);

  return (
    <main>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </main>
  );
}
```

Client Components should fetch data when the data depends on client-only state or must update after interaction.

## Streaming With Suspense

Suspense boundaries can let slower sections stream later.

```jsx
export default function DashboardPage() {
  return (
    <main>
      <FastSummary />
      <Suspense fallback={<p>Loading chart...</p>}>
        <SlowChart />
      </Suspense>
    </main>
  );
}
```

The page shell can appear while slower content is still being prepared.

## Metadata and SEO

Frameworks like Next.js can generate metadata on the server.

Useful metadata includes:

- title
- description
- canonical URL
- Open Graph tags
- robots directives

Metadata matters for search engines, previews, and accessibility.

## Common Mistakes

- Adding `"use client"` at the top of a large page and accidentally shipping too much JavaScript.
- Fetching the same data separately in several nested components without understanding caching.
- Assuming every Next.js page is automatically static.
- Reading browser APIs inside Server Components.
- Ignoring route-level loading and error states.

## Practical Architecture Note

Keep server-only modules separate from client modules.

```text
lib/server/db.js       server-only data access
lib/client/storage.js  browser storage helpers
components/ProductInfo.jsx
components/AddToCartButton.jsx
```

Clear boundaries prevent accidental imports that pull server code into the client or browser code into the server.

:::quiz
question: What does `"use client"` do in a Next.js App Router component?
options:
  - Marks that module as a Client Component boundary
  - Disables React rendering for that file
  - Forces the whole application to use CSR
  - Makes the component run only at build time
answer: 0
explanation: `"use client"` marks a component module as a client boundary so it can use state, effects, event handlers, and browser APIs.
:::

## Practical Challenge

Sketch a Next.js product route.

Decide:

- which parts are Server Components
- which small parts need `"use client"`
- which data is fetched on the server
- where loading and error UI should live
- whether the route should be static, dynamic, or regenerated

## Recap

Next.js provides React application structure for routing, rendering, data fetching, streaming, and deployment.

The most important skill is choosing boundaries: server versus client, static versus dynamic, and route shell versus interactive widgets.
